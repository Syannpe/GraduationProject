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
var _GraphicBase_instances, _GraphicBase___content__, _GraphicBase_redraw, _GraphicBase___textFormat__, _GraphicBase___boxShadow__, _GraphicBase___textShadow__, _GraphicBase___border__, _GraphicBase___font__, _GraphicBase___boxTransform__, _GraphicBase___textTransform__, _GraphicBase___fillType__, _GraphicBase___backgroundColor__, _GraphicBase___color__;
import { TextFormat } from "./TextFormat.js";
import { FILL_TYPE } from "./FILL_TYPE.js";
import { RGBA } from "../Fillable/ColorFormat/RGBA.js";
import { RenderEvent } from "../Event/RenderEvent.js";
import { AfterRenderEvent } from "../Event/AftereRenderEvent.js";
import { ContextChangeEvent } from "../Event/ContextChangeEvent.js";
class GraphicBase extends HTMLElement {
    get content() {
        return __classPrivateFieldGet(this, _GraphicBase___content__, "f");
    }
    set content(content) {
        __classPrivateFieldSet(this, _GraphicBase___content__, content, "f");
        this.children[0] && this.removeChild(this.children[0]);
        __classPrivateFieldGet(this, _GraphicBase_instances, "m", _GraphicBase_redraw).call(this);
    }
    get textFormat() {
        return __classPrivateFieldGet(this, _GraphicBase___textFormat__, "f");
    }
    set textFormat(v) {
        let that = this;
        if (typeof v === "object") {
            __classPrivateFieldSet(this, _GraphicBase___textFormat__, new Proxy(v, {
                set(target, p, newValue, receiver) {
                    __classPrivateFieldGet(that, _GraphicBase_instances, "m", _GraphicBase_redraw).call(that);
                    return target[p] = newValue;
                }
            }), "f");
        }
        else if (!v) {
            __classPrivateFieldSet(this, _GraphicBase___textShadow__, null, "f");
        }
        //重新设置内容样式并重新绘制
        //与that.#redraw()的区别在于redraw不会设置子元素<text>的样式直接重新渲染
        // 此写法会触发衍生类的set content方法，会重新创建一个text
        //删除已有的text之后插入
        this.content = this.content;
    }
    get boxShadow() {
        return __classPrivateFieldGet(this, _GraphicBase___boxShadow__, "f");
    }
    set boxShadow(v) {
        let that = this;
        if (typeof v === "object")
            __classPrivateFieldSet(this, _GraphicBase___boxShadow__, new Proxy(v, {
                set(target, p, newValue, receiver) {
                    __classPrivateFieldGet(that, _GraphicBase_instances, "m", _GraphicBase_redraw).call(that);
                    return target[p] = newValue;
                }
            }), "f");
        else if (!v) {
            __classPrivateFieldSet(this, _GraphicBase___boxShadow__, null, "f");
            __classPrivateFieldGet(that, _GraphicBase_instances, "m", _GraphicBase_redraw).call(that);
        }
        __classPrivateFieldGet(this, _GraphicBase_instances, "m", _GraphicBase_redraw).call(this);
    }
    get textShadow() {
        return __classPrivateFieldGet(this, _GraphicBase___textShadow__, "f");
    }
    set textShadow(v) {
        let that = this;
        if (typeof v === "object") {
            __classPrivateFieldSet(this, _GraphicBase___textShadow__, new Proxy(v, {
                set(target, p, newValue, receiver) {
                    __classPrivateFieldGet(that, _GraphicBase_instances, "m", _GraphicBase_redraw).call(that);
                    return target[p] = newValue;
                }
            }), "f");
        }
        else if (!v) {
            __classPrivateFieldSet(this, _GraphicBase___textShadow__, null, "f");
        }
        //重新设置内容样式并重新绘制
        //与that.#redraw()的区别在于redraw不会设置子元素<text>的样式直接重新渲染
        // 此写法会触发衍生类的set content方法，会重新创建一个text
        //删除已有的text之后插入
        this.content = this.content;
    }
    get border() {
        return __classPrivateFieldGet(this, _GraphicBase___border__, "f");
    }
    set border(v) {
        let that = this;
        if (typeof v === "object")
            __classPrivateFieldSet(this, _GraphicBase___border__, new Proxy(v, {
                set(target, p, newValue, receiver) {
                    __classPrivateFieldGet(that, _GraphicBase_instances, "m", _GraphicBase_redraw).call(that);
                    return target[p] = newValue;
                }
            }), "f");
        else if (!v) {
            __classPrivateFieldSet(this, _GraphicBase___border__, null, "f");
        }
        __classPrivateFieldGet(this, _GraphicBase_instances, "m", _GraphicBase_redraw).call(this);
    }
    get font() {
        return __classPrivateFieldGet(this, _GraphicBase___font__, "f");
    }
    set font(v) {
        let that = this;
        if (typeof v === "object") {
            __classPrivateFieldSet(this, _GraphicBase___font__, new Proxy(v, {
                set(target, p, newValue, receiver) {
                    __classPrivateFieldGet(that, _GraphicBase_instances, "m", _GraphicBase_redraw).call(that);
                    return target[p] = newValue;
                }
            }), "f");
        }
        else if (!v) {
            __classPrivateFieldSet(this, _GraphicBase___font__, null, "f");
        }
        //重新设置内容样式并重新绘制
        //与that.#redraw()的区别在于redraw不会设置子元素<text>的样式直接重新渲染
        // 此写法会触发衍生类的set content方法，会重新创建一个text
        //删除已有的text之后插入
        this.content = this.content;
    }
    get boxTransform() {
        return __classPrivateFieldGet(this, _GraphicBase___boxTransform__, "f");
    }
    set boxTransform(v) {
        let that = this;
        __classPrivateFieldSet(this, _GraphicBase___boxTransform__, v, "f");
        __classPrivateFieldGet(this, _GraphicBase_instances, "m", _GraphicBase_redraw).call(this);
    }
    get textTransform() {
        return __classPrivateFieldGet(this, _GraphicBase___textTransform__, "f");
    }
    set textTransform(v) {
        let that = this;
        __classPrivateFieldSet(this, _GraphicBase___textTransform__, v, "f");
        this.content = this.content;
    }
    get fillType() {
        return __classPrivateFieldGet(this, _GraphicBase___fillType__, "f");
    }
    set fillType(v) {
        __classPrivateFieldSet(this, _GraphicBase___fillType__, v, "f");
        __classPrivateFieldGet(this, _GraphicBase_instances, "m", _GraphicBase_redraw).call(this);
    }
    get backgroundColor() {
        return __classPrivateFieldGet(this, _GraphicBase___backgroundColor__, "f");
    }
    set backgroundColor(v) {
        let that = this;
        if (typeof v === "object")
            __classPrivateFieldSet(this, _GraphicBase___backgroundColor__, new Proxy(v, {
                set(target, p, newValue, receiver) {
                    __classPrivateFieldGet(that, _GraphicBase_instances, "m", _GraphicBase_redraw).call(that);
                    return target[p] = newValue;
                }
            }), "f");
        __classPrivateFieldGet(this, _GraphicBase_instances, "m", _GraphicBase_redraw).call(this);
    }
    get color() {
        return __classPrivateFieldGet(this, _GraphicBase___color__, "f");
    }
    set color(v) {
        let that = this;
        if (typeof v === "object") {
            __classPrivateFieldSet(this, _GraphicBase___color__, new Proxy(v, {
                set(target, p, newValue, receiver) {
                    __classPrivateFieldGet(that, _GraphicBase_instances, "m", _GraphicBase_redraw).call(that);
                    return target[p] = newValue;
                }
            }), "f");
        }
        else if (!v) {
            __classPrivateFieldSet(this, _GraphicBase___color__, null, "f");
        }
        //重新设置内容样式并重新绘制
        //与that.#redraw()的区别在于redraw不会设置子元素<text>的样式直接重新渲染
        // 此写法会触发衍生类的set content方法，会重新创建一个text
        //删除已有的text之后插入
        this.content = this.content;
    }
    render(canvas) {
        let ev = new RenderEvent("render");
        this.dispatchEvent(ev);
        this.mano = this.parentElement.mano;
        //返回绘制位置
        return this.animation ? canvas.dynamicsCanvas : canvas.staticCanvas;
    }
    renderChildren(canvas) {
        Array.from(this.children).forEach(element => {
            let graphic = element;
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
        _GraphicBase_instances.add(this);
        _GraphicBase___content__.set(this, void 0);
        _GraphicBase___textFormat__.set(this, new TextFormat({ textBaseline: "hanging" }));
        _GraphicBase___boxShadow__.set(this, void 0);
        _GraphicBase___textShadow__.set(this, void 0);
        _GraphicBase___border__.set(this, void 0);
        _GraphicBase___font__.set(this, void 0);
        _GraphicBase___boxTransform__.set(this, new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]));
        _GraphicBase___textTransform__.set(this, new DOMMatrixReadOnly([1, 0, 0, 1, 0, 0]));
        _GraphicBase___fillType__.set(this, FILL_TYPE.GRAPHIC_FILL);
        _GraphicBase___backgroundColor__.set(this, new RGBA(0, 0, 0));
        _GraphicBase___color__.set(this, new RGBA(0, 0, 0));
    }
}
_GraphicBase___content__ = new WeakMap(), _GraphicBase___textFormat__ = new WeakMap(), _GraphicBase___boxShadow__ = new WeakMap(), _GraphicBase___textShadow__ = new WeakMap(), _GraphicBase___border__ = new WeakMap(), _GraphicBase___font__ = new WeakMap(), _GraphicBase___boxTransform__ = new WeakMap(), _GraphicBase___textTransform__ = new WeakMap(), _GraphicBase___fillType__ = new WeakMap(), _GraphicBase___backgroundColor__ = new WeakMap(), _GraphicBase___color__ = new WeakMap(), _GraphicBase_instances = new WeakSet(), _GraphicBase_redraw = function _GraphicBase_redraw() {
    var _a, _b;
    //触发预备程序，在下一次屏幕刷新的时候更新
    let ev = new ContextChangeEvent("contextchange", {
        bubbles: true,
        cancelable: true,
    });
    ev.source = "graphic base";
    (_b = (_a = this.mano) === null || _a === void 0 ? void 0 : _a.canvas) === null || _b === void 0 ? void 0 : _b.dispatchEvent(ev);
};
export { GraphicBase };
