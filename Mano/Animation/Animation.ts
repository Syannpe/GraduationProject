import {LinearInterpolation} from "./LinearInterpolation.js";
import {GraphicBase} from "../Graphic/GraphicBase.js";

class Animation extends LinearInterpolation {

    public currentTime: number;
    public finished: boolean;
    public id: number;
    public pending: boolean;
    public playbackRate: number;
    public playState: "idle" | "running" | "paused" | "finished";
    public ready: boolean;
    public startTime: number;
    public timeline: AnimationTimeline;


    public target: GraphicBase;     //被注册的图元
    #timer: number;     //requestAnimationFrame返回标识
    #t: number;     //本动画时间轴

    #run() {
        this.#timer = requestAnimationFrame(this.#run);
    }

    public play(): void {
        this.#run();
    }

    public cancel(): void {
        cancelAnimationFrame(this.#timer);
    }

    public finish(): void {
        this.#t =

    }

    public reverse(): void {
    }

    public updatePlaybackRate(playbackRate: number): void {
    }

    public commitStyles(): void {
    }
}

export {Animation}