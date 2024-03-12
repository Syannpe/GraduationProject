import {TextFormat} from "./TextFormat.js"
import {Shadow} from "./Shadow.js"
import {Border} from "./Border.js"
import {Font} from "./Font"
import {FILL_TYPE} from "./FILL_TYPE.js"
import {Fillable} from "../Fillable/Fillable.js"
import {Canvas} from "../Global/Canvas.js";
import {Animation} from "../Animation/Animation.js";
import {RGBA} from "../Fillable/ColorFormat/RGBA.js";
import {RenderEvent} from "../Event/RenderEvent.js";
import {AfterRenderEvent} from "../Event/AfterRenderEvent.js";
import {Mano} from "../Mano.js";
import {ContextChangeEvent} from "../Event/ContextChangeEvent.js";
import {FILL_RULE} from "./FILL_RULE.js";
import {GraphicEventRegister} from "./GraphicEventRegister.js";

class GraphicBase extends GraphicEventRegister {
    public path: Path2D = null;
    public mano: Mano;

    public updateBoundingRect() {
    }

    #redraw(options?: "both" | "static" | "dynamic") {
        //触发预备程序，在下一次屏幕刷新的时候更新
        let ev = new ContextChangeEvent("contextchange", {
            bubbles: true,
            cancelable: true,
        });
        ev.source = "graphic base"
        if (this.#__animation__) ev.clearOptions = "dynamic";
        else ev.clearOptions = "both";
        if (options) ev.clearOptions = options;
        this.mano?.canvas?.dispatchEvent(ev);
    }

    #__content__: string;

    get content(): string {
        return this.#__content__;
    }

    set content(content: string) {
        this.#__content__ = content;

        this.children[0] ? this.removeChild(this.children[0]) : null;
        this.#redraw();
    }

    #__textFormat__: TextFormat = new TextFormat({textBaseline: "hanging"});

    get textFormat() {
        return this.#__textFormat__;
    }

    set textFormat(v: TextFormat) {
        let that = this;

        if (v && typeof v === "object") {
            this.#__textFormat__ = new Proxy(v, {
                set(target: TextFormat, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });
        } else if (!v) {
            this.#__textShadow__ = null;
        }

        //重新设置内容样式并重新绘制
        //与that.#redraw()的区别在于redraw不会设置子元素<text>的样式直接重新渲染
        // 此写法会触发衍生类的set content方法，会重新创建一个text
        //删除已有的text之后插入
        this.content = this.content;
    }

    #__boxShadow__: Shadow;

    get boxShadow() {
        return this.#__boxShadow__;
    }

    set boxShadow(v: Shadow) {
        let that = this;

        if (v && typeof v === "object")
            this.#__boxShadow__ = new Proxy(v, {
                set(target: Shadow, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });
        else if (!v) {
            this.#__boxShadow__ = null;
            that.#redraw();
        }
        this.#redraw();
    }

    #__textShadow__: Shadow;

    get textShadow() {
        return this.#__textShadow__;
    }

    set textShadow(v: Shadow) {
        let that = this;

        if (v && typeof v === "object") {
            this.#__textShadow__ = new Proxy(v, {
                set(target: Shadow, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });
        } else if (!v) {
            this.#__textShadow__ = null;
        }

        //重新设置内容样式并重新绘制
        //与that.#redraw()的区别在于redraw不会设置子元素<text>的样式直接重新渲染
        // 此写法会触发衍生类的set content方法，会重新创建一个text
        //删除已有的text之后插入
        this.content = this.content;
    }

    #__border__: Border;

    get border() {
        return this.#__border__;
    }

    set border(v: Border) {
        let that = this;

        if (v && typeof v === "object")
            this.#__border__ = new Proxy(v, {
                set(target: Border, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });
        else if (!v) {
            this.#__border__ = null;
        }

        this.#redraw();
    }

    #__font__: Font;

    get font() {
        return this.#__font__;
    }

    set font(v: Font) {
        let that = this;

        if (v && typeof v === "object") {
            this.#__font__ = new Proxy(v, {
                set(target: Font, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });
        } else if (!v) {
            this.#__font__ = null;
        }

        //重新设置内容样式并重新绘制
        //与that.#redraw()的区别在于redraw不会设置子元素<text>的样式直接重新渲染
        // 此写法会触发衍生类的set content方法，会重新创建一个text
        //删除已有的text之后插入
        this.content = this.content;
    }

    public currentBoxTransform: DOMMatrixReadOnly = new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]);
    public inheritBoxTransform: DOMMatrixReadOnly = new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]);
    get boxTransform() {
        return this.inheritBoxTransform.multiply(this.currentBoxTransform);
    }

    set boxTransform(v: DOMMatrixReadOnly) {
        // console.log(v);
        this.currentBoxTransform = v
        this.#redraw();
    }

    public currentTextTransform: DOMMatrixReadOnly = new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]);
    public inheritTextTransform: DOMMatrixReadOnly = new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]);
    get textTransform() {
        return this.inheritTextTransform.multiply(this.currentTextTransform.multiply(this.currentBoxTransform));
    }

    set textTransform(v: DOMMatrixReadOnly) {
        this.currentTextTransform = v
        this.content = this.content;
    }

    #__fillType__: FILL_TYPE = FILL_TYPE.GRAPHIC_FILL;

    get fillType() {
        return this.#__fillType__;
    }

    set fillType(v: FILL_TYPE) {
        this.#__fillType__ = v;
        this.#redraw();
    }

    #__fillRule__: FILL_RULE = FILL_RULE.NONZERO;

    get fillRule() {
        return this.#__fillRule__;
    }

    set fillRule(v: FILL_RULE) {
        this.#__fillRule__ = v;
        this.#redraw();
    }

    #__backgroundColor__: Fillable = new RGBA(0, 0, 0);

    get backgroundColor() {
        return this.#__backgroundColor__;
    }

    set backgroundColor(v: Fillable) {
        let that = this;

        if (v && typeof v === "object")
            this.#__backgroundColor__ = new Proxy(v, {
                set(target: Fillable, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });

        this.#redraw();
    }

    #__color__: Fillable = new RGBA(0, 0, 0);

    get color() {
        return this.#__color__;
    }

    set color(v: Fillable) {
        let that = this;

        if (v && typeof v === "object") {
            this.#__color__ = new Proxy(v, {
                set(target: Fillable, p: string | symbol, newValue: any): boolean {
                    that.#redraw();
                    return target[p] = newValue;
                }
            });
        } else if (!v) {
            this.#__color__ = null;
        }

        //重新设置内容样式并重新绘制
        //与that.#redraw()的区别在于redraw不会设置子元素<text>的样式直接重新渲染
        // 此写法会触发衍生类的set content方法，会重新创建一个text
        //删除已有的text之后插入
        this.content = this.content;
    }

    #__animation__: Animation;

    get animation() {
        return this.#__animation__;
    }

    set animation(v: Animation) {
        this.#__animation__ = v;
        if (!v) {
            this.#redraw("both");
            return;
        } else {
            this.#redraw("dynamic");
        }
        this.#__animation__.target.push(this);
        this.#__animation__.replay();
    }

    public getContext(canvas: Canvas):CanvasRenderingContext2D {
        //返回绘制位置
        for (let i: HTMLElement = this; i !== document.body && i; i = i.parentElement) {
            let graphic: GraphicBase = i as GraphicBase;

            if (graphic.animation) {
                return canvas.dynamicsCanvas;
            }
        }
        return canvas.staticCanvas;
    }

    public render(this: GraphicBase, canvas: Canvas): CanvasRenderingContext2D
    public render(this: GraphicBase, canvas: Canvas, clearOption?: "both" | "static" | "dynamic"): CanvasRenderingContext2D {
        let ev = new RenderEvent("render");
        this.dispatchEvent(ev);

        this.mano = (this.parentElement as HTMLElement & { mano: Mano }).mano
        return this.getContext(canvas);
    }

    public renderChildren(canvas: Canvas) {
        Array.from(this.children).forEach(element => {
            let graphic = element as GraphicBase;
            graphic.render(canvas);

            let ev = new AfterRenderEvent("afterrender", {
                bubbles: true,
                cancelable: true,
            });
            graphic.dispatchEvent(ev);
        });
    }

    constructor() {
        super();
    }
}

export {GraphicBase}

