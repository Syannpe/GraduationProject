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
var _Animation_instances, _Animation_timer, _Animation_t, _Animation_run;
import { LinearInterpolation } from "./LinearInterpolation.js";
class Animation extends LinearInterpolation {
    constructor() {
        super(...arguments);
        _Animation_instances.add(this);
        _Animation_timer.set(this, void 0); //requestAnimationFrame返回标识
        _Animation_t.set(this, void 0); //本动画时间轴
    }
    play() {
        __classPrivateFieldGet(this, _Animation_instances, "m", _Animation_run).call(this);
    }
    cancel() {
        cancelAnimationFrame(__classPrivateFieldGet(this, _Animation_timer, "f"));
    }
    finish() {
        __classPrivateFieldSet(this, _Animation_t, , "f");
    }
    reverse() {
    }
    updatePlaybackRate(playbackRate) {
    }
    commitStyles() {
    }
}
_Animation_timer = new WeakMap(), _Animation_t = new WeakMap(), _Animation_instances = new WeakSet(), _Animation_run = function _Animation_run() {
    __classPrivateFieldSet(this, _Animation_timer, requestAnimationFrame(__classPrivateFieldGet(this, _Animation_instances, "m", _Animation_run)), "f");
};
export { Animation };
