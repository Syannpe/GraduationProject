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
var _Canvas_counter, _Canvas_FPS, _Canvas_fpsCounter, _Canvas_CBClearOpts, _Canvas___contextChangeDefaultCallBack__;
import { RGBA } from "../Fillable/ColorFormat/RGBA.js";
import { RenderEvent } from "../Event/RenderEvent.js";
import { AfterRenderEvent } from "../Event/AfterRenderEvent.js";
import { BeforeRenderEvent } from "../Event/BeforeRenderEvent.js";
import { Debugger } from "./DebugOptions.js";
import { Group } from "../Graphic/Shapes/Group.js";
class Canvas extends HTMLElement {
    /*
    * @param option: "both" | "static" | "dynamic" = "both" 需要清空的项
    * */
    clear(option = "both") {
        var _a;
        if (option === "both" || option === "static") {
            let canvas = this.staticCanvas.canvas;
            canvas.width = this.canvasOptions.width;
            this.staticCanvas = canvas.getContext("2d");
        }
        if (option === "both" || option === "dynamic") {
            let canvas = this.dynamicsCanvas.canvas;
            canvas.width = this.canvasOptions.width;
            this.dynamicsCanvas = canvas.getContext("2d");
        }
        this.dynamicsCanvas.beginPath();
        this.dynamicsCanvas.rect(0, 0, this.canvasOptions.width, this.canvasOptions.height);
        this.dynamicsCanvas.fillStyle = ((_a = this.canvasOptions.clearColor) === null || _a === void 0 ? void 0 : _a.toString()) ||
            (new RGBA(255, 255, 255, 255)).toString();
        this.dynamicsCanvas.fill();
        this.dynamicsCanvas.closePath();
    }
    getFPS() {
        return __classPrivateFieldGet(this, _Canvas_FPS, "f");
    }
    render(renderTime = 0, clearOption = "both") {
        var _a, _b;
        if (clearOption !== __classPrivateFieldGet(this, _Canvas_CBClearOpts, "f"))
            clearOption = __classPrivateFieldGet(this, _Canvas_CBClearOpts, "f");
        if (Debugger.render)
            console.log(__classPrivateFieldSet(this, _Canvas_counter, (_a = __classPrivateFieldGet(this, _Canvas_counter, "f"), ++_a), "f"));
        if (this.canvasOptions.enableFPS) {
            __classPrivateFieldSet(this, _Canvas_fpsCounter, (_b = __classPrivateFieldGet(this, _Canvas_fpsCounter, "f"), _b++, _b), "f");
        }
        let ev = new RenderEvent("render", {
            bubbles: true,
            cancelable: true,
        });
        this.dispatchEvent(ev);
        this.clear(clearOption);
        //为了防止一些组件内部添加导致无限渲染
        this.removeEventListener("contextchange", __classPrivateFieldGet(this, _Canvas___contextChangeDefaultCallBack__, "f"));
        let that = this;
        Array.from(this.mano.graphic.children).forEach(element => {
            let graphic = element;
            if (!(graphic instanceof Group) && graphic.getContext(that) === that.dynamicsCanvas && clearOption === "static") {
                return;
            }
            else if (!(graphic instanceof Group) && graphic.getContext(that) === that.staticCanvas && clearOption === "dynamic") {
                return;
            }
            graphic.updateBoundingRect();
            const boundingRect = graphic.getBoundingClientRect();
            if (boundingRect.x + boundingRect.width < 0 ||
                boundingRect.x > this.canvasOptions.width ||
                boundingRect.y + boundingRect.height < 0 ||
                boundingRect.y > this.canvasOptions.height) {
                return;
            }
            if (graphic instanceof Group) {
                graphic.render(that, clearOption);
            }
            else {
                graphic.render(that);
            }
            let ev = new AfterRenderEvent("afterrender", {
                bubbles: true,
                cancelable: true,
            });
            graphic.dispatchEvent(ev);
        });
        // console.log("end", performance.now())
        this.addEventListener("contextchange", __classPrivateFieldGet(this, _Canvas___contextChangeDefaultCallBack__, "f"));
        this.rendering = false;
        ev = new AfterRenderEvent("afterrender", {
            bubbles: true,
            cancelable: true,
        });
        this.dispatchEvent(ev);
    }
    constructor(options) {
        super();
        //渲染任务已经预备，准备渲染中
        //通常在触发beforerender事件之后和render事件触发之前，此值为true
        this.rendering = false;
        _Canvas_counter.set(this, 0);
        _Canvas_FPS.set(this, 0);
        _Canvas_fpsCounter.set(this, 0);
        _Canvas_CBClearOpts.set(this, void 0);
        _Canvas___contextChangeDefaultCallBack__.set(this, (function (e) {
            let ev = new BeforeRenderEvent("beforerender", {
                bubbles: true,
                cancelable: true,
            });
            this.dispatchEvent(ev);
            e.clearOptions = e.clearOptions || "both";
            if (e.clearOptions === "both") {
                __classPrivateFieldSet(this, _Canvas_CBClearOpts, "both", "f");
            }
            else if (e.clearOptions === "static") {
                if (__classPrivateFieldGet(this, _Canvas_CBClearOpts, "f") === "dynamic" || __classPrivateFieldGet(this, _Canvas_CBClearOpts, "f") === "both") {
                    __classPrivateFieldSet(this, _Canvas_CBClearOpts, "both", "f");
                }
                else if (__classPrivateFieldGet(this, _Canvas_CBClearOpts, "f") === "static" || !__classPrivateFieldGet(this, _Canvas_CBClearOpts, "f")) {
                    __classPrivateFieldSet(this, _Canvas_CBClearOpts, "static", "f");
                }
            }
            else if (e.clearOptions === "dynamic") {
                if (__classPrivateFieldGet(this, _Canvas_CBClearOpts, "f") === "static" || __classPrivateFieldGet(this, _Canvas_CBClearOpts, "f") === "both") {
                    __classPrivateFieldSet(this, _Canvas_CBClearOpts, "both", "f");
                }
                else if (__classPrivateFieldGet(this, _Canvas_CBClearOpts, "f") === "dynamic" || !__classPrivateFieldGet(this, _Canvas_CBClearOpts, "f")) {
                    __classPrivateFieldSet(this, _Canvas_CBClearOpts, "dynamic", "f");
                }
            }
            if (this.rendering)
                return;
            if (Debugger.render)
                console.log(e.source);
            this.rendering = true;
            requestAnimationFrame(this.render.bind(this, 0, __classPrivateFieldGet(this, _Canvas_CBClearOpts, "f")));
            __classPrivateFieldSet(this, _Canvas_CBClearOpts, undefined, "f");
        }).bind(this));
        if (!options) {
            options = {
                height: 150,
                width: 300,
                enableFPS: false
            };
            Array.from(this.attributes).forEach(attr => {
                options[attr.name] = attr.value;
            });
        }
        if (options.enableFPS) {
            setInterval(function (that) {
                __classPrivateFieldSet(that, _Canvas_FPS, __classPrivateFieldGet(that, _Canvas_fpsCounter, "f"), "f");
                __classPrivateFieldSet(that, _Canvas_fpsCounter, 0, "f");
            }, 1000, this);
        }
        this.style.position = "absolute";
        this.canvasId = ++Canvas.CanvasId;
        this.canvasOptions = options;
        const dynamicsCanvasEle = document.createElement("canvas");
        const staticCanvasEle = document.createElement("canvas");
        options.width = options.width || 300;
        options.height = options.height || 150;
        let { width, height } = options;
        dynamicsCanvasEle.width = staticCanvasEle.width = width;
        dynamicsCanvasEle.height = staticCanvasEle.height = height;
        this.style.width = width + "px";
        this.style.height = height + "px";
        this.style.display = "block";
        dynamicsCanvasEle.id = "mano-dynamics-canvas" + this.canvasId;
        staticCanvasEle.id = "mano-static-canvas" + this.canvasId;
        this.dynamicsCanvas = dynamicsCanvasEle.getContext("2d");
        this.staticCanvas = staticCanvasEle.getContext("2d");
        let shadowRoot = this.attachShadow({ mode: "open" });
        dynamicsCanvasEle.style.position = "absolute";
        staticCanvasEle.style.position = "absolute";
        shadowRoot.appendChild(dynamicsCanvasEle);
        shadowRoot.appendChild(staticCanvasEle);
        this.addEventListener("contextchange", __classPrivateFieldGet(this, _Canvas___contextChangeDefaultCallBack__, "f"));
    }
}
_Canvas_counter = new WeakMap(), _Canvas_FPS = new WeakMap(), _Canvas_fpsCounter = new WeakMap(), _Canvas_CBClearOpts = new WeakMap(), _Canvas___contextChangeDefaultCallBack__ = new WeakMap();
Canvas.CanvasId = 0;
customElements.define("mano-canvas", Canvas);
export { Canvas };
