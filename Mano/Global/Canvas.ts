import {GraphicBase} from "../Graphic/GraphicBase.js"
import {CanvasOptions} from "./CanvasOptions.js";
import {Mano} from "../Mano.js";
import {RGBA} from "../Fillable/ColorFormat/RGBA.js";
import {RenderEvent} from "../Event/RenderEvent.js";
import {AfterRenderEvent} from "../Event/AfterRenderEvent.js";
import {BeforeRenderEvent} from "../Event/BeforeRenderEvent.js";
import {Debugger} from "./DebugOptions.js";
import {ContextChangeEvent} from "../Event/ContextChangeEvent.js";
import {Group} from "../Graphic/Shapes/Group.js";

class Canvas extends HTMLElement {
    public mano: Mano;
    public static CanvasId: number = 0;

    public canvasId: number;
    public dynamicsCanvas: CanvasRenderingContext2D;
    public staticCanvas: CanvasRenderingContext2D;
    public canvasOptions: CanvasOptions;

    //这两个属性属于绘制图片的时候用的，地方错了
    public imageSmoothingEnabled: boolean;
    public imageSmoothingQuality: "low" | "medium" | "high";

    //渲染任务已经预备，准备渲染中
    //通常在触发beforerender事件之后和render事件触发之前，此值为true
    public rendering: boolean = false;

    /*
    * @param option: "both" | "static" | "dynamic" = "both" 需要清空的项
    * */
    public clear(option: "both" | "static" | "dynamic" = "both"): void {
        // console.log(option)
        if (option === "both" || option === "static") {
            let canvas = this.staticCanvas.canvas;
            canvas.width = this.canvasOptions.width;
            this.staticCanvas = canvas.getContext("2d");
        }

        if (option === "both" || option === "dynamic") {
            // console.log(123);
            let canvas = this.dynamicsCanvas.canvas;
            canvas.width = this.canvasOptions.width;
            this.dynamicsCanvas = canvas.getContext("2d");
        }

        this.dynamicsCanvas.beginPath();
        this.dynamicsCanvas.rect(0, 0, this.canvasOptions.width, this.canvasOptions.height);
        this.dynamicsCanvas.fillStyle = this.canvasOptions.clearColor?.toString() ||
            (new RGBA(255, 255, 255, 255)).toString();
        this.dynamicsCanvas.fill();
        this.dynamicsCanvas.closePath();
    }

    #counter = 0;
    #FPS = 0;
    #fpsCounter = 0;

    getFPS() {
        return this.#FPS;
    }

    public render(renderTime = 0, clearOption: "both" | "static" | "dynamic" = "both"): void {
        if (clearOption !== this.#CBClearOpts)
            clearOption = this.#CBClearOpts;

        if (Debugger.render)
            console.log(++this.#counter);

        if (this.canvasOptions.enableFPS) {
            this.#fpsCounter++;
        }

        let ev = new RenderEvent("render", {
            bubbles: true,
            cancelable: true,
        });
        this.dispatchEvent(ev);

        this.clear(clearOption);

        //为了防止一些组件内部添加导致无限渲染
        this.removeEventListener("contextchange", this.#__contextChangeDefaultCallBack__)
        let that = this;
        Array.from(this.mano.graphic.children).forEach(element => {
            let graphic = element as GraphicBase;
            if (!(graphic instanceof Group) && graphic.getContext(that) === that.dynamicsCanvas && clearOption === "static") {
                return;
            } else if (!(graphic instanceof Group) && graphic.getContext(that) === that.staticCanvas && clearOption === "dynamic") {
                return;
            }

            if (graphic instanceof Group) {
                graphic.render(that,clearOption);
            } else {
                graphic.render(that);
            }

            let ev = new AfterRenderEvent("afterrender", {
                bubbles: true,
                cancelable: true,
            });
            graphic.dispatchEvent(ev);
        });
        this.addEventListener("contextchange", this.#__contextChangeDefaultCallBack__)

        this.rendering = false;

        ev = new AfterRenderEvent("afterrender", {
            bubbles: true,
            cancelable: true,
        });
        this.dispatchEvent(ev);
    }

    #CBClearOpts: "both" | "static" | "dynamic" | undefined;
    #__contextChangeDefaultCallBack__ = (function (e: ContextChangeEvent) {
        let ev = new BeforeRenderEvent("beforerender", {
            bubbles: true,
            cancelable: true,
        });
        this.dispatchEvent(ev);

        e.clearOptions = e.clearOptions || "both";
        if (e.clearOptions === "both") {
            this.#CBClearOpts = "both"
        } else if (e.clearOptions === "static") {
            if (this.#CBClearOpts === "dynamic" || this.#CBClearOpts === "both") {
                this.#CBClearOpts = "both"
            } else if (this.#CBClearOpts === "static" || !this.#CBClearOpts) {
                this.#CBClearOpts = "static"
            }
        } else if (e.clearOptions === "dynamic") {
            if (this.#CBClearOpts === "static" || this.#CBClearOpts === "both") {
                this.#CBClearOpts = "both"
            } else if (this.#CBClearOpts === "dynamic" || !this.#CBClearOpts) {
                this.#CBClearOpts = "dynamic"
            }
        }
        if (this.rendering) return;

        if (Debugger.render)
            console.log(e.source);

        this.rendering = true;

        requestAnimationFrame(this.render.bind(this, 0, this.#CBClearOpts));
        this.#CBClearOpts = undefined;
    }).bind(this);

    constructor(options?: CanvasOptions) {
        super();

        if (!options) {
            options = {
                height: 150,
                width: 300,
                enableFPS: false
            };
            Array.from(this.attributes).forEach(attr => {
                options[attr.name] = attr.value
            });
        }

        if (options.enableFPS) {
            setInterval(function (that: Canvas) {
                that.#FPS = that.#fpsCounter;
                that.#fpsCounter = 0;
            }, 1000, this);
        }

        this.style.position = "absolute";

        this.canvasId = ++Canvas.CanvasId;
        this.canvasOptions = options;

        const dynamicsCanvasEle = document.createElement("canvas");
        const staticCanvasEle = document.createElement("canvas");

        options.width = options.width || 300;
        options.height = options.height || 150;

        let {width, height} = options;
        dynamicsCanvasEle.width = staticCanvasEle.width = width;
        dynamicsCanvasEle.height = staticCanvasEle.height = height;
        this.style.width = width + "px";
        this.style.height = height + "px";
        this.style.display = "block";


        dynamicsCanvasEle.id = "mano-dynamics-canvas" + this.canvasId;
        staticCanvasEle.id = "mano-static-canvas" + this.canvasId;

        this.dynamicsCanvas = dynamicsCanvasEle.getContext("2d");
        this.staticCanvas = staticCanvasEle.getContext("2d");

        let shadowRoot = this.attachShadow({mode: "open"});

        dynamicsCanvasEle.style.position = "absolute";
        staticCanvasEle.style.position = "absolute";

        shadowRoot.appendChild(dynamicsCanvasEle);
        shadowRoot.appendChild(staticCanvasEle);

        this.addEventListener("contextchange", this.#__contextChangeDefaultCallBack__)
    }

}

customElements.define("mano-canvas", Canvas);

export {Canvas}
