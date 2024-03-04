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
import {AfterRenderEvent} from "../Event/AftereRenderEvent.js";
import {Text} from "./Shapes/Text.js";
import {Graphic} from "./Graphic.js";
import {Mano} from "../Mano.js";
import {ContextChangeEvent} from "../Event/ContextChangeEvent.js";

class GraphicBase extends HTMLElement {
    #__content__: string;

    get content(): string {
        return this.#__content__;
    }

    set content(content: string) {
        this.#__content__ = content;

        this.children[0] && this.removeChild(this.children[0]);

        this.#redraw();
    }

    #redraw() {
        //触发预备程序，在下一次屏幕刷新的时候更新
        let ev = new ContextChangeEvent("contextchange", {
            bubbles: true,
            cancelable: true,
        });
        ev.source = "graphic base"
        this.mano?.canvas?.dispatchEvent(ev);
    }

    public mano: Mano;
    #__textFormat__: TextFormat = new TextFormat({textBaseline: "hanging"});

    get textFormat() {
        return this.#__textFormat__;
    }

    set textFormat(v: TextFormat) {
        let that = this;

        if (typeof v === "object") {
            this.#__textFormat__ = new Proxy(v, {
                set(target: TextFormat, p: string | symbol, newValue: any, receiver: any): boolean {
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

        if (typeof v === "object")
            this.#__boxShadow__ = new Proxy(v, {
                set(target: Shadow, p: string | symbol, newValue: any, receiver: any): boolean {
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

        if (typeof v === "object") {
            this.#__textShadow__ = new Proxy(v, {
                set(target: Shadow, p: string | symbol, newValue: any, receiver: any): boolean {
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

        if (typeof v === "object")
            this.#__border__ = new Proxy(v, {
                set(target: Border, p: string | symbol, newValue: any, receiver: any): boolean {
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

        if (typeof v === "object") {
            this.#__font__ = new Proxy(v, {
                set(target: Font, p: string | symbol, newValue: any, receiver: any): boolean {
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

    #__boxTransform__: DOMMatrixReadOnly = new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]);

    get boxTransform() {
        return this.#__boxTransform__;
    }

    set boxTransform(v: DOMMatrixReadOnly) {
        let that = this;
        this.#__boxTransform__ = v

        this.#redraw();
    }

    #__textTransform__: DOMMatrixReadOnly = new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]);

    get textTransform() {
        return this.#__textTransform__;
    }

    set textTransform(v: DOMMatrixReadOnly) {
        let that = this;
        this.#__textTransform__ = v
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


    #__backgroundColor__: Fillable = new RGBA(0, 0, 0);

    get backgroundColor() {
        return this.#__backgroundColor__;
    }

    set backgroundColor(v: Fillable) {
        let that = this;

        if (typeof v === "object")
            this.#__backgroundColor__ = new Proxy(v, {
                set(target: Fillable, p: string | symbol, newValue: any, receiver: any): boolean {
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

        if (typeof v === "object") {
            this.#__color__ = new Proxy(v, {
                set(target: Fillable, p: string | symbol, newValue: any, receiver: any): boolean {
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

    public animation: Animation;

    public render(canvas: Canvas): CanvasRenderingContext2D {
        let ev = new RenderEvent("render");
        this.dispatchEvent(ev);

        this.mano = (this.parentElement as HTMLElement & { mano: Mano }).mano

        //返回绘制位置
        return this.animation ? canvas.dynamicsCanvas : canvas.staticCanvas;
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

