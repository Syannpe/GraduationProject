var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Animation_instances, _Animation_timer, _Animation_lastTime, _Animation_deltaTime, _Animation_reclocking, _Animation_keyframeToTimes, _Animation_leftIterations, _Animation_isFirstRun, _Animation_run;
import { LinearInterpolation } from "./LinearInterpolation.js";
import { TextFormat } from "../Graphic/TextFormat.js";
import { Shadow } from "../Graphic/Shadow.js";
import { Border } from "../Graphic/Border.js";
import { Font } from "../Graphic/Font.js";
import { AnimationRunningEvent } from "../Event/AnimationRunningEvent.js";
import { AnimationRenderingEvent } from "../Event/AnimationRenderingEvent.js";
import { AnimationCancelEvent } from "../Event/AnimationCancelEvent.js";
import { AnimationFinishEvent } from "../Event/AnimationFinishEvent.js";
import { AnimationRemoveEvent } from "../Event/AnimationRemoveEvent.js";
import { Debugger } from "../Global/DebugOptions.js";
import { linear } from "./timing-function/linear.js";
class Animation extends LinearInterpolation {
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
    replay() {
        let duration = this.keyframeEffect.options.duration;
        let keyframes = this.keyframeEffect.getKeyframes();
        let startTime, endTime;
        for (let i = 0; i < keyframes.length - 1; i++) {
            if (keyframes[i].offset) {
                startTime = this.startTime + keyframes[i].offset * duration;
            }
            else {
                startTime = this.startTime + (i / (keyframes.length - 1)) * duration;
            }
            if (keyframes[i + 1].offset) {
                endTime = this.startTime + keyframes[i + 1].offset * duration;
            }
            else {
                endTime = this.startTime + ((i + 1) / (keyframes.length - 1)) * duration;
            }
            __classPrivateFieldGet(this, _Animation_keyframeToTimes, "f").set(keyframes[i], { startTime, endTime });
        }
        __classPrivateFieldGet(this, _Animation_keyframeToTimes, "f").set(keyframes[keyframes.length - 1], {
            startTime: endTime,
            endTime: endTime
        });
        if (Debugger.keyFrameCalculatedTime) {
            __classPrivateFieldGet(this, _Animation_keyframeToTimes, "f").forEach((value, key, map) => {
                console.log(key, value);
            });
        }
        if (__classPrivateFieldGet(this, _Animation_isFirstRun, "f")) {
            //调整好动画方向后调整动画时间
            let iterationStartTime = this.keyframeEffect.options.iterationStart -
                Math.floor(this.keyframeEffect.options.iterationStart);
            let during = this.startTime +
                this.keyframeEffect.options.duration -
                this.currentTime;
            this.currentTime += iterationStartTime * during;
            __classPrivateFieldSet(this, _Animation_isFirstRun, false, "f");
        }
        else {
            this.currentTime = __classPrivateFieldGet(this, _Animation_keyframeToTimes, "f").get(keyframes[0]).startTime;
        }
        this.play();
    }
    play() {
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
        if (!__classPrivateFieldGet(this, _Animation_timer, "f"))
            requestAnimationFrame(__classPrivateFieldGet(this, _Animation_instances, "m", _Animation_run).bind(this));
    }
    cancel() {
        const ev = new AnimationCancelEvent("cancel", {
            bubbles: true,
            cancelable: true
        });
        this.dispatchEvent(ev);
        this.finished = false;
        this.pending = true;
        this.playState = "paused";
        this.ready = true;
        cancelAnimationFrame(__classPrivateFieldGet(this, _Animation_timer, "f"));
        __classPrivateFieldSet(this, _Animation_reclocking, true, "f");
        __classPrivateFieldSet(this, _Animation_timer, undefined, "f");
    }
    finish() {
        let keyframes = this.keyframeEffect.getKeyframes();
        this.currentTime =
            __classPrivateFieldGet(this, _Animation_keyframeToTimes, "f").get(keyframes[keyframes.length - 1]).endTime;
        __classPrivateFieldSet(this, _Animation_leftIterations, 1, "f");
    }
    updatePlaybackRate(playbackRate) {
        this.playbackRate = playbackRate;
    }
    constructor(keyframeEffect, timeline) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        super();
        _Animation_instances.add(this);
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
        this.currentTime = 0;
        this.target = []; //被注册的图元
        _Animation_timer.set(this, void 0); //requestAnimationFrame返回标识
        _Animation_lastTime.set(this, 0); //用于计算每一帧时间差
        _Animation_deltaTime.set(this, 0);
        _Animation_reclocking.set(this, false);
        _Animation_keyframeToTimes.set(this, new Map());
        _Animation_leftIterations.set(this, 0);
        _Animation_isFirstRun.set(this, true);
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
        if (!keyframeEffect.options.duration)
            throw "时长必须指定";
        keyframeEffect.options.delay = (_a = keyframeEffect.options.delay) !== null && _a !== void 0 ? _a : 0;
        keyframeEffect.options.direction = (_b = keyframeEffect.options.direction) !== null && _b !== void 0 ? _b : "normal";
        keyframeEffect.options.fill = (_c = keyframeEffect.options.fill) !== null && _c !== void 0 ? _c : "auto";
        keyframeEffect.options.iterations = (_d = keyframeEffect.options.iterations) !== null && _d !== void 0 ? _d : 1;
        keyframeEffect.options.endDelay = (_e = keyframeEffect.options.endDelay) !== null && _e !== void 0 ? _e : 0;
        keyframeEffect.options.playbackRate = (_f = keyframeEffect.options.playbackRate) !== null && _f !== void 0 ? _f : 1;
        keyframeEffect.options.iterationStart = (_g = keyframeEffect.options.iterationStart) !== null && _g !== void 0 ? _g : 0;
        keyframeEffect.options.easing = (_h = keyframeEffect.options.easing) !== null && _h !== void 0 ? _h : linear();
        if (!((_k = (_j = keyframeEffect.options) === null || _j === void 0 ? void 0 : _j.easing(.5)) === null || _k === void 0 ? void 0 : _k.x) || !((_m = (_l = keyframeEffect.options) === null || _l === void 0 ? void 0 : _l.easing(.5)) === null || _m === void 0 ? void 0 : _m.y))
            throw "easing时间函数有问题";
        this.timeline = timeline;
        this.keyframeEffect = keyframeEffect;
        this.finished = false;
        this.id = ++Animation.animationIdCounter;
        this.pending = true;
        this.playbackRate = keyframeEffect.options.playbackRate;
        this.playState = "idle";
        this.ready = true;
        __classPrivateFieldSet(this, _Animation_leftIterations, keyframeEffect.options.iterations - Math.floor(keyframeEffect.options.iterationStart), "f");
        if (typeof timeline.currentTime === "number") {
            this.currentTime = timeline.currentTime;
            this.startTime = timeline.currentTime + this.keyframeEffect.options.delay;
        }
        else if (timeline.currentTime instanceof CSSNumericValue) {
            this.currentTime = Number.parseFloat(timeline.currentTime.toString());
            this.startTime = Number.parseFloat(timeline.currentTime.toString()) + this.keyframeEffect.options.delay;
        }
        if (keyframeEffect.options.direction === "reverse" ||
            keyframeEffect.options.direction === "alternate-reverse") {
            keyframeEffect.getKeyframes().reverse();
        }
        for (let i = 0; i < Math.floor(keyframeEffect.options.iterationStart); i++) {
            //需要就按照跳过次数吧方向调整好
            //如果动画方向为alternate和alternate-reverse这种交替动画的话每一次循环完需要更换方向
            // "normal", "reverse", "alternate", "alternate-reverse"
            if (this.keyframeEffect.options.direction === "alternate-reverse" ||
                this.keyframeEffect.options.direction === "alternate") {
                this.keyframeEffect.getKeyframes().reverse();
            }
        }
    }
}
_Animation_timer = new WeakMap(), _Animation_lastTime = new WeakMap(), _Animation_deltaTime = new WeakMap(), _Animation_reclocking = new WeakMap(), _Animation_keyframeToTimes = new WeakMap(), _Animation_leftIterations = new WeakMap(), _Animation_isFirstRun = new WeakMap(), _Animation_instances = new WeakSet(), _Animation_run = function _Animation_run(renderTime) {
    var _a, _b, _c, _d, _e;
    var _f;
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
    let startTime = (_a = __classPrivateFieldGet(this, _Animation_keyframeToTimes, "f").get(keyframes[0])) === null || _a === void 0 ? void 0 : _a.startTime;
    let duration = ((_b = __classPrivateFieldGet(this, _Animation_keyframeToTimes, "f").get(keyframes[keyframes.length - 1])) === null || _b === void 0 ? void 0 : _b.endTime) -
        ((_c = __classPrivateFieldGet(this, _Animation_keyframeToTimes, "f").get(keyframes[0])) === null || _c === void 0 ? void 0 : _c.startTime);
    const that = this;
    //cancel再play的bug出在这里，时间差不会变
    this.currentTime += __classPrivateFieldGet(this, _Animation_deltaTime, "f") * this.playbackRate;
    let timeAfterFunc = this.keyframeEffect.options.easing((this.currentTime - startTime) / duration).y
        * duration + startTime;
    // console.log(this.currentTime, timeAfterFunc);
    //每一个关键帧都有一个对应的运行时间区间，
    //倘若在这一区间内，那么当前帧就是开始帧，下一个关键帧即为结束帧
    keyframes.forEach((value, i, a) => {
        if (!a[i + 1])
            return;
        if (timeAfterFunc > __classPrivateFieldGet(that, _Animation_keyframeToTimes, "f").get(value).startTime &&
            timeAfterFunc < __classPrivateFieldGet(that, _Animation_keyframeToTimes, "f").get(value).endTime) {
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
            if (name === "offset")
                continue;
            if (!kf1[name])
                kf1[name] = this.target[i][name] || kf2[name];
            let currentAnimeStart = __classPrivateFieldGet(that, _Animation_keyframeToTimes, "f").get(kf1).startTime;
            let currentAnimeDur = __classPrivateFieldGet(that, _Animation_keyframeToTimes, "f").get(kf1).endTime - currentAnimeStart;
            if (kf1[name] instanceof TextFormat)
                this.target[i][name] = this.getTextFormatAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
            else if (kf1[name] instanceof Shadow)
                this.target[i][name] = this.getShadowAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
            else if (kf1[name] instanceof Border)
                this.target[i][name] = this.getBorderAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
            else if (kf1[name] instanceof Font)
                this.target[i][name] = this.getFontAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
            else if (kf1[name] instanceof DOMMatrixReadOnly)
                this.target[i][name] = this.getDOMMatrixAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
            else if (name === "fillType")
                this.target[i].fillType = this.getFillTypeAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
            else if (name === "fillRule")
                this.target[i].fillRule = this.getFillRuleAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
            else if (name === "backgroundColor") {
                this.target[i].backgroundColor = this.getFillableAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
            }
            else if (name === "color")
                this.target[i].color = this.getFillableAtTime(kf1[name], kf2[name], timeAfterFunc, currentAnimeStart, currentAnimeDur);
        }
    }
    /*
    * 根据渲染时间差对当前时间进行修改
    * */
    if (__classPrivateFieldGet(this, _Animation_reclocking, "f")) {
        __classPrivateFieldSet(this, _Animation_reclocking, false, "f");
        __classPrivateFieldSet(this, _Animation_lastTime, renderTime, "f");
    }
    else {
        __classPrivateFieldSet(this, _Animation_deltaTime, renderTime - __classPrivateFieldGet(this, _Animation_lastTime, "f"), "f");
        __classPrivateFieldSet(this, _Animation_lastTime, renderTime, "f");
    }
    /*刷新动画并且触发刷新事件*/
    __classPrivateFieldSet(this, _Animation_timer, requestAnimationFrame(__classPrivateFieldGet(this, _Animation_instances, "m", _Animation_run).bind(this)), "f");
    const ev = new AnimationRenderingEvent("rendering", {
        bubbles: true,
        cancelable: true
    });
    this.dispatchEvent(ev);
    /*
    * 如果动画结束的话就触发这个判断
    * */
    if (this.currentTime > ((_d = __classPrivateFieldGet(that, _Animation_keyframeToTimes, "f").get(keyframes[keyframes.length - 1])) === null || _d === void 0 ? void 0 : _d.endTime)) {
        //结束之后，先删除默认的计时器，
        //再注册一个计时器用于将时间改为终点时间
        //之后设置finished，再运行此函数时
        //会直接运行finished中的语句，结束计时器
        cancelAnimationFrame(__classPrivateFieldGet(this, _Animation_timer, "f"));
        __classPrivateFieldSet(this, _Animation_timer, undefined, "f");
        //结束本轮循环，循环次数减一，如果小于等于0次则循环结束
        __classPrivateFieldSet(this, _Animation_leftIterations, (_f = __classPrivateFieldGet(this, _Animation_leftIterations, "f"), _f--, _f), "f");
        if (__classPrivateFieldGet(this, _Animation_leftIterations, "f") <= 0) {
            this.finished = true;
        }
        else if (__classPrivateFieldGet(this, _Animation_leftIterations, "f") > 0) {
            //如果动画方向为alternate和alternate-reverse这种交替动画的话每一次循环完需要更换方向
            // "normal", "reverse", "alternate", "alternate-reverse"
            if (this.keyframeEffect.options.direction === "alternate-reverse" ||
                this.keyframeEffect.options.direction === "alternate") {
                this.keyframeEffect.getKeyframes().reverse();
            }
            this.replay();
            return;
        }
        if (!this.finished)
            return;
        if (this.keyframeEffect.options.endDelay &&
            this.currentTime < ((_e = __classPrivateFieldGet(that, _Animation_keyframeToTimes, "f").get(keyframes[keyframes.length - 1])) === null || _e === void 0 ? void 0 : _e.endTime) +
                this.keyframeEffect.options.endDelay) {
            __classPrivateFieldSet(this, _Animation_timer, requestAnimationFrame(__classPrivateFieldGet(this, _Animation_instances, "m", _Animation_run).bind(this)), "f");
            return;
        }
        cancelAnimationFrame(__classPrivateFieldGet(this, _Animation_timer, "f"));
        __classPrivateFieldSet(this, _Animation_timer, undefined, "f");
        //处理填充方式属性，有以下几种取值：
        //"auto" | "backwards" | "both" | "forwards" | "none"
        if (this.keyframeEffect.options.fill === "forwards") {
            for (let keyframeKey in keyframes[0]) {
                this.target.forEach(gra => {
                    gra[keyframeKey] = keyframes[0][keyframeKey];
                });
            }
        }
        else if (this.keyframeEffect.options.fill === "backwards") {
            for (let keyframeKey in keyframes[keyframes.length - 1]) {
                this.target.forEach(gra => {
                    gra[keyframeKey] = keyframes[keyframes.length - 1][keyframeKey];
                });
            }
        }
        else if (this.keyframeEffect.options.fill === "both") {
            for (let keyframeKey in keyframes[0]) {
                this.target.forEach(gra => {
                    gra[keyframeKey] = keyframes[0][keyframeKey];
                });
            }
            for (let keyframeKey in keyframes[keyframes.length - 1]) {
                this.target.forEach(gra => {
                    gra[keyframeKey] = keyframes[keyframes.length - 1][keyframeKey];
                });
            }
        }
        else if (this.keyframeEffect.options.fill === "none" ||
            this.keyframeEffect.options.fill === "auto") {
            for (let keyframeKey in keyframes[keyframes.length - 1]) {
                this.target.forEach(gra => {
                    gra[keyframeKey] = keyframes[keyframes.length - 1][keyframeKey];
                });
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
};
Animation.animationIdCounter = -1;
export { Animation };
