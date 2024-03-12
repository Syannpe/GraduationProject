import {LinearInterpolation} from "./LinearInterpolation.js";
import {GraphicBase} from "../Graphic/GraphicBase.js";
import {GraphicKeyframeEffect} from "./GraphicKeyframeEffect.js";
import {TextFormat} from "../Graphic/TextFormat.js";
import {Shadow} from "../Graphic/Shadow.js";
import {Border} from "../Graphic/Border.js";
import {Font} from "../Graphic/Font.js";
import {AnimationRunningEvent} from "../Event/AnimationRunningEvent.js";
import {AnimationRenderingEvent} from "../Event/AnimationRenderingEvent.js";
import {AnimationCancelEvent} from "../Event/AnimationCancelEvent.js";
import {AnimationFinishEvent} from "../Event/AnimationFinishEvent.js";
import {AnimationRemoveEvent} from "../Event/AnimationRemoveEvent.js";
import {Debugger} from "../Global/DebugOptions.js";
import {linear} from "./timing-function/linear.js";
import {AnimationInvalidDuration} from "../Exception/Animation.InvalidDuration.js";
import {AnimationInvalidTimingFunction} from "../Exception/Animation.InvalidTimingFunction.js";

class Animation extends LinearInterpolation {
    private static animationIdCounter: number = -1;

    /*
    * Animation.currentTime：动画的当前时间值，以毫秒为单位，无论是运行还是暂停。如果动画没有时间轴、处于非活动状态或尚未播放，其值为 null。
    * Animation.effect：获取或设置与此动画关联的 AnimationEffect。通常，这将是一个 KeyframeEffect 对象。
    * Animation.finished（只读）：返回当前动画的已完成 Promise。
    * Animation.id：获取或设置用于标识动画的字符串。
    * Animation.pending（只读）：指示动画当前是否正在等待异步操作，例如启动播放或暂停正在运行的动画。
    * Animation.playState（只读）：返回描述动画播放状态的枚举值。
    * Animation.playbackRate：获取或设置动画的播放速率。
    * Animation.ready（只读）：返回当前动画的就绪 Promise。
    * 不要了Animation.replaceState（只读）：指示动画是否处于活动状态，是否已被另一个动画自动替换并删除，或是否已通过调用 Animation.persist() 显式保留。
    * Animation.startTime：获取或设置动画播放应该开始的计划时间。
    * Animation.timeline：获取或设置与此动画关联的时间轴。
    * */

    public currentTime: number = 0;
    public finished: boolean;
    public id: number;
    public pending: boolean;
    public playbackRate: number;
    public playState: "idle" | "running" | "paused" | "finished";
    public ready: boolean;
    public startTime: number;
    public timeline: AnimationTimeline;
    public keyframeEffect: GraphicKeyframeEffect;

    public target: GraphicBase[] = [];     //被注册的图元
    #timer: number;     //requestAnimationFrame返回标识
    #lastTime = 0;      //记录上一帧运行时间，用于计算时间差
    #deltaTime = 0;     //计算当前时间和上一帧运行时间的差值，用于计算时间差
    #reclocking = false;        //动画是否已经触发cancel需要重新计时，用于计算时间差
    #keyframeToTimes = new Map();       //每一个关键帧和开始结束时间的对应关系
    #leftIterations = 0;        //剩余迭代次数
    #isFirstRun = true;     //是否是第一次运行，来设置延迟时间

    #run(renderTime: number): void {
        /*
         * delay?: number;
         * direction?: PlaybackDirection;
         * duration?: number | CSSNumericValue | string;
         * 没实现easing?: string;
         * endDelay?: number;
         * 没实现fill?: FillMode= "none", "forwards", "backwards", "both", "auto"
         * 没实现iterationStart?: number;
         * 没实现iterations?: number;
         * playbackRate?: number;
         * 没实现composite?: CompositeOperation;
         * 不要了iterationComposite?: IterationCompositeOperation;
        */
        /*
        * Animation.currentTime：动画的当前时间值，以毫秒为单位，无论是运行还是暂停。如果动画没有时间轴、处于非活动状态或尚未播放，其值为 null。
        * Animation.effect：获取或设置与此动画关联的 AnimationEffect。通常，这将是一个 KeyframeEffect 对象。
        * Animation.finished（只读）：返回当前动画的已完成 Promise。
        * Animation.id：获取或设置用于标识动画的字符串。
        * Animation.pending（只读）：指示动画当前是否正在等待异步操作，例如启动播放或暂停正在运行的动画。
        * Animation.playState（只读）：返回描述动画播放状态的枚举值。
        * Animation.playbackRate：获取或设置动画的播放速率。
        * Animation.ready（只读）：返回当前动画的就绪 Promise。
        * !Animation.replaceState（只读）：指示动画是否处于活动状态，是否已被另一个动画自动替换并删除，或是否已通过调用 Animation.persist() 显式保留。
        * Animation.startTime：获取或设置动画播放应该开始的计划时间。
        * Animation.timeline：获取或设置与此动画关联的时间轴。
        * */
        //当前动画的开始帧和结束帧，两个关键帧
        let kf1, kf2;
        let keyframes = this.keyframeEffect.getKeyframes();
        let startTime = this.#keyframeToTimes.get(keyframes[0])?.startTime;
        let duration = this.#keyframeToTimes.get(keyframes[keyframes.length - 1])?.endTime -
            this.#keyframeToTimes.get(keyframes[0])?.startTime;
        const that = this;

        //cancel再play的bug出在这里，时间差不会变
        this.currentTime += this.#deltaTime * this.playbackRate;
        let timeAfterFunc = this.keyframeEffect.options.easing(
                (this.currentTime - startTime) / duration).y
            * duration + startTime;

        //每一个关键帧都有一个对应的运行时间区间，
        //倘若在这一区间内，那么当前帧就是开始帧，下一个关键帧即为结束帧
        keyframes.forEach((value, i, a) => {
            if (!a[i + 1]) return;

            if (timeAfterFunc > that.#keyframeToTimes.get(value).startTime &&
                timeAfterFunc < that.#keyframeToTimes.get(value).endTime) {
                kf1 = keyframes[i];
                kf2 = keyframes[i + 1];
            }
        });


        /*
        * 开始根据两个关键帧进行插值动画，
        * 如果第一个关键帧没有第二个关键帧需要的数据会进行复制（）
        * 这里有一个bug就是当反向播放的时候同时也会给第一个进行复制
        * */
        for (let i = 0; i < this.target.length; i++) {
            for (let name in kf2) {
                if (name === "offset") continue;
                if (!kf1[name]) kf1[name] = this.target[i][name] || kf2[name];

                let currentAnimeStart = that.#keyframeToTimes.get(kf1).startTime;
                let currentAnimeDur = that.#keyframeToTimes.get(kf1).endTime - currentAnimeStart;

                if (kf1[name] instanceof TextFormat) this.target[i][name] = this.getTextFormatAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
                else if (kf1[name] instanceof Shadow) this.target[i][name] = this.getShadowAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
                else if (kf1[name] instanceof Border) this.target[i][name] = this.getBorderAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
                else if (kf1[name] instanceof Font) this.target[i][name] = this.getFontAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
                else if (kf1[name] instanceof DOMMatrixReadOnly) this.target[i][name] = this.getDOMMatrixAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
                else if (name === "fillType") this.target[i].fillType = this.getFillTypeAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
                else if (name === "fillRule") this.target[i].fillRule = this.getFillRuleAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
                else if (name === "backgroundColor") {
                    this.target[i].backgroundColor = this.getFillableAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
                } else if (name === "color") this.target[i].color = this.getFillableAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
            }
        }

        /*
        * 根据渲染时间差对当前时间进行修改
        * */
        if (this.#reclocking) {
            this.#reclocking = false;
            this.#lastTime = Number.parseFloat(this.timeline.currentTime.toString());
        } else {
            this.#deltaTime = Number.parseFloat(this.timeline.currentTime.toString()) - this.#lastTime;
            this.#lastTime = Number.parseFloat(this.timeline.currentTime.toString());
        }

        /*刷新动画并且触发刷新事件*/
        this.#timer = requestAnimationFrame(this.#run.bind(this));
        const ev = new AnimationRenderingEvent("rendering", {
            bubbles: true,
            cancelable: true
        });
        this.dispatchEvent(ev);

        /*
        * 如果动画结束的话就触发这个判断
        * */
        if (this.currentTime > that.#keyframeToTimes.get(keyframes[keyframes.length - 1])?.endTime) {
            //结束之后，先删除默认的计时器，
            //再注册一个计时器用于将时间改为终点时间
            //之后设置finished，再运行此函数时
            //会直接运行finished中的语句，结束计时器
            cancelAnimationFrame(this.#timer);

            this.#timer = undefined
            //结束本轮循环，循环次数减一，如果小于等于0次则循环结束
            this.#leftIterations--;
            if (this.#leftIterations <= 0) {
                this.finished = true;
            } else if (this.#leftIterations > 0) {
                //如果动画方向为alternate和alternate-reverse这种交替动画的话每一次循环完需要更换方向
                // "normal", "reverse", "alternate", "alternate-reverse"
                if (this.keyframeEffect.options.direction === "alternate-reverse" ||
                    this.keyframeEffect.options.direction === "alternate") {
                    this.#keyFrameReverse();
                }
                this.replay();
                return;
            }

            if (!this.finished)
                return;

            if (this.keyframeEffect.options.endDelay &&
                this.currentTime < that.#keyframeToTimes.get(keyframes[keyframes.length - 1])?.endTime +
                this.keyframeEffect.options.endDelay) {
                this.#timer = requestAnimationFrame(this.#run.bind(this));
                return;
            }

            cancelAnimationFrame(this.#timer);
            this.#timer = undefined;

            //处理填充方式属性，有以下几种取值：
            //"auto" | "backwards" | "both" | "forwards" | "none"
            if (this.keyframeEffect.options.fill === "forwards") {
                for (let keyframeKey in keyframes[0]) {
                    this.target.forEach(gra => {
                        gra[keyframeKey] = keyframes[0][keyframeKey];
                    })
                }
            } else if (this.keyframeEffect.options.fill === "backwards") {
                for (let keyframeKey in keyframes[keyframes.length - 1]) {
                    this.target.forEach(gra => {
                        gra[keyframeKey] = keyframes[keyframes.length - 1][keyframeKey];
                    })
                }
            } else if (this.keyframeEffect.options.fill === "both") {
                for (let keyframeKey in keyframes[0]) {
                    this.target.forEach(gra => {
                        gra[keyframeKey] = keyframes[0][keyframeKey];
                    })
                }
                for (let keyframeKey in keyframes[keyframes.length - 1]) {
                    this.target.forEach(gra => {
                        gra[keyframeKey] = keyframes[keyframes.length - 1][keyframeKey];
                    })
                }
            } else if (this.keyframeEffect.options.fill === "none" ||
                this.keyframeEffect.options.fill === "auto") {
                for (let keyframeKey in keyframes[keyframes.length - 1]) {
                    this.target.forEach(gra => {
                        gra[keyframeKey] = keyframes[keyframes.length - 1][keyframeKey];
                    })
                }
            }

            //如果动画已经结束并且

            let ev = new AnimationFinishEvent("finish", {
                bubbles: true,
                cancelable: true
            });
            this.dispatchEvent(ev);


            this.pending = false;
            this.playState = "finished";
            this.ready = false;

            this.target.forEach(v => v.animation = null);

            ev = new AnimationRemoveEvent("remove", {
                bubbles: true,
                cancelable: true
            });
            this.dispatchEvent(ev);
        }
    }

    /*
    * Animation.cancel() 清除由此动画引起的所有关键帧效果，并中止其播放。
    * Animation.commitStyles() 即使动画已被移除，也会将当前的样式状态提交到被动画化的元素。这将导致当前的样式状态以样式属性内的属性形式写入被动画化的元素。
    * Animation.finish() 根据动画是正在播放还是正在倒放，寻找动画的任一端。
    * Animation.pause() 暂停动画的播放。
    * Animation.persist() 明确地保持一个动画，防止它在被另一个动画替换时自动移除。
    * Animation.play() 开始或继续播放动画，或者如果动画之前已经结束，则重新开始动画。
    * Animation.reverse() 反转播放方向，停在动画的开始处。如果动画已经结束或未播放，它将从结束到开始播放。
    * Animation.updatePlaybackRate() 在首次同步播放位置后，设置动画的播放速度。
    * */
    public replay(): void {
        let duration = this.keyframeEffect.options.duration;
        let keyframes = this.keyframeEffect.getKeyframes();
        this.#keyframeToTimes.clear();
        this.startTime = Math.max(Number.parseFloat(this.timeline.currentTime.toString()), this.startTime)
        let startTime, endTime;
        for (let i = 0; i < keyframes.length - 1; i++) {
            if (keyframes[i].offset) {
                startTime = this.startTime + keyframes[i].offset * duration;
            } else {
                startTime = this.startTime + (i / (keyframes.length - 1)) * duration;
            }
            if (keyframes[i + 1].offset) {
                endTime = this.startTime + keyframes[i + 1].offset * duration;
            } else {
                endTime = this.startTime + ((i + 1) / (keyframes.length - 1)) * duration;
            }
            this.#keyframeToTimes.set(keyframes[i], {startTime, endTime});
        }
        this.#keyframeToTimes.set(keyframes[keyframes.length - 1], {
            startTime: endTime,
            endTime: endTime
        });

        if (Debugger.keyFrameCalculatedTime) {
            this.#keyframeToTimes.forEach((value, key, map) => {
                console.log(key, value);
            });
        }


        if (this.#isFirstRun) {
            //调整好动画方向后调整动画时间
            let iterationStartTime = this.keyframeEffect.options.iterationStart -
                Math.floor(this.keyframeEffect.options.iterationStart)
            let during = this.startTime +
                this.keyframeEffect.options.duration -
                this.currentTime;
            this.currentTime += iterationStartTime * during;
            this.#isFirstRun = false;
        } else {
            this.currentTime = this.#keyframeToTimes.get(keyframes[0]).startTime;
        }
        this.#lastTime = this.currentTime;
        this.play();
    }

    public play(): void {
        if (this.playState !== "running") {
            const ev = new AnimationRunningEvent("running", {
                bubbles: true,
                cancelable: true
            });
            this.dispatchEvent(ev);
        }
        this.finished = false;
        this.pending = false;
        this.playState = "running";
        this.ready = true;
        if (!this.#timer)
            requestAnimationFrame(this.#run.bind(this));
    }

    public cancel(): void {
        const ev = new AnimationCancelEvent("cancel", {
            bubbles: true,
            cancelable: true
        });
        this.dispatchEvent(ev);

        this.finished = false;
        this.pending = true;
        this.playState = "paused";
        this.ready = true;
        cancelAnimationFrame(this.#timer);
        this.#reclocking = true;
        this.#timer = undefined;
    }

    public finish(): void {
        let keyframes = this.keyframeEffect.getKeyframes();

        this.currentTime =
            this.#keyframeToTimes.get(
                keyframes[keyframes.length - 1]
            ).endTime
        this.#leftIterations = 1;

    }

    public updatePlaybackRate(playbackRate: number): void {
        this.playbackRate = playbackRate;
    }

    #keyFrameReverse() {
        this.keyframeEffect.getKeyframes().reverse();
        this.keyframeEffect.getKeyframes().forEach(v => {
            if (v.offset) {
                v.offset = 1 - v.offset;
            }
        })
    }

    constructor(keyframeEffect: GraphicKeyframeEffect, timeline: AnimationTimeline) {
        super();
        /*
         * public currentTime: number = 0;
         * public readonly finished: boolean;
         * public id: number;
         * public readonly pending: boolean;
         * public playbackRate: number;
         * public readonly playState: "idle" | "running" | "paused" | "finished";
         * public readonly ready: boolean;
         * public startTime: number;
         * public timeline: AnimationTimeline;
         * public keyframeEffect: KeyframeEffect;
         * */

        if (!keyframeEffect.options?.duration)
            throw new AnimationInvalidDuration("时长必须设定");

        keyframeEffect.options.delay = keyframeEffect.options.delay ?? 0;
        keyframeEffect.options.direction = keyframeEffect.options.direction ?? "normal";
        keyframeEffect.options.fill = keyframeEffect.options.fill ?? "auto";
        keyframeEffect.options.iterations = keyframeEffect.options.iterations ?? 1;
        keyframeEffect.options.endDelay = keyframeEffect.options.endDelay ?? 0;
        keyframeEffect.options.playbackRate = keyframeEffect.options.playbackRate ?? 1;
        keyframeEffect.options.iterationStart = keyframeEffect.options.iterationStart ?? 0;
        keyframeEffect.options.easing = keyframeEffect.options.easing ?? linear();
        if (!keyframeEffect.options?.easing(.5)?.x || !keyframeEffect.options?.easing(.5)?.y)
            throw new AnimationInvalidTimingFunction("easing时间函数有问题")


        this.timeline = timeline;
        this.keyframeEffect = keyframeEffect;
        this.finished = false;
        this.id = ++Animation.animationIdCounter;
        this.pending = true;
        this.playbackRate = keyframeEffect.options.playbackRate;
        this.playState = "idle";
        this.ready = true;
        this.#leftIterations = keyframeEffect.options.iterations - Math.floor(keyframeEffect.options.iterationStart);

        if (typeof timeline.currentTime === "number") {
            this.currentTime = timeline.currentTime
            this.startTime = timeline.currentTime + this.keyframeEffect.options.delay;
        } else if (timeline.currentTime instanceof CSSNumericValue) {
            this.currentTime = Number.parseFloat(timeline.currentTime.toString())
            this.startTime = Number.parseFloat(timeline.currentTime.toString()) + this.keyframeEffect.options.delay;
        }
        if (keyframeEffect.options.direction === "reverse" ||
            keyframeEffect.options.direction === "alternate-reverse") {
            // keyframeEffect.getKeyframes().reverse();
            this.#keyFrameReverse();
        }


        for (let i = 0; i < Math.floor(keyframeEffect.options.iterationStart); i++) {
            //需要就按照跳过次数吧方向调整好
            //如果动画方向为alternate和alternate-reverse这种交替动画的话每一次循环完需要更换方向
            // "normal", "reverse", "alternate", "alternate-reverse"
            if (this.keyframeEffect.options.direction === "alternate-reverse" ||
                this.keyframeEffect.options.direction === "alternate") {
                // this.keyframeEffect.getKeyframes().reverse();
                this.#keyFrameReverse();
            }
        }
    }
}

export {Animation}