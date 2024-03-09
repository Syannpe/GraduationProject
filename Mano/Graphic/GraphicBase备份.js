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
var _GraphicBase_instances, _GraphicBase___content__, _GraphicBase_redraw, _GraphicBase___textFormat__, _GraphicBase___boxShadow__, _GraphicBase___textShadow__, _GraphicBase___border__, _GraphicBase___font__, _GraphicBase___boxTransform__, _GraphicBase___textTransform__, _GraphicBase___fillType__, _GraphicBase___fillRule__, _GraphicBase___backgroundColor__, _GraphicBase___color__, _GraphicBase___animation__;
import { TextFormat } from "./TextFormat.js";
import { FILL_TYPE } from "./FILL_TYPE.js";
import { RGBA } from "../Fillable/ColorFormat/RGBA.js";
import { RenderEvent } from "../Event/RenderEvent.js";
import { AfterRenderEvent } from "../Event/AfterRenderEvent.js";
import { ContextChangeEvent } from "../Event/ContextChangeEvent.js";
import { FILL_RULE } from "./FILL_RULE.js";
class GraphicBase extends HTMLElement {
    get content() {
        return __classPrivateFieldGet(this, _GraphicBase___content__, "f");
    }
    set content(content) {
        __classPrivateFieldSet(this, _GraphicBase___content__, content, "f");
        this.children[0] ? this.removeChild(this.children[0]) : null;
        __classPrivateFieldGet(this, _GraphicBase_instances, "m", _GraphicBase_redraw).call(this);
    }
    get textFormat() {
        return __classPrivateFieldGet(this, _GraphicBase___textFormat__, "f");
    }
    set textFormat(v) {
        let that = this;
        if (v && typeof v === "object") {
            __classPrivateFieldSet(this, _GraphicBase___textFormat__, new Proxy(v, {
                set(target, p, newValue) {
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
        if (v && typeof v === "object")
            __classPrivateFieldSet(this, _GraphicBase___boxShadow__, new Proxy(v, {
                set(target, p, newValue) {
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
        if (v && typeof v === "object") {
            __classPrivateFieldSet(this, _GraphicBase___textShadow__, new Proxy(v, {
                set(target, p, newValue) {
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
        if (v && typeof v === "object")
            __classPrivateFieldSet(this, _GraphicBase___border__, new Proxy(v, {
                set(target, p, newValue) {
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
        if (v && typeof v === "object") {
            __classPrivateFieldSet(this, _GraphicBase___font__, new Proxy(v, {
                set(target, p, newValue) {
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
        __classPrivateFieldSet(this, _GraphicBase___boxTransform__, v, "f");
        __classPrivateFieldGet(this, _GraphicBase_instances, "m", _GraphicBase_redraw).call(this);
    }
    get textTransform() {
        return __classPrivateFieldGet(this, _GraphicBase___textTransform__, "f").multiply(__classPrivateFieldGet(this, _GraphicBase___boxTransform__, "f"));
    }
    set textTransform(v) {
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
    get fillRule() {
        return __classPrivateFieldGet(this, _GraphicBase___fillRule__, "f");
    }
    set fillRule(v) {
        __classPrivateFieldSet(this, _GraphicBase___fillRule__, v, "f");
        __classPrivateFieldGet(this, _GraphicBase_instances, "m", _GraphicBase_redraw).call(this);
    }
    get backgroundColor() {
        return __classPrivateFieldGet(this, _GraphicBase___backgroundColor__, "f");
    }
    set backgroundColor(v) {
        let that = this;
        if (v && typeof v === "object")
            __classPrivateFieldSet(this, _GraphicBase___backgroundColor__, new Proxy(v, {
                set(target, p, newValue) {
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
        if (v && typeof v === "object") {
            __classPrivateFieldSet(this, _GraphicBase___color__, new Proxy(v, {
                set(target, p, newValue) {
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
    addEventListener(type, listener, options) {
        //特殊处理的事件，例如自定义事件，运行时事件
        if ((options === null || options === void 0 ? void 0 : options.eventType) === "runtime") {
            super.addEventListener(type, listener, options);
        }
        else if ((options === null || options === void 0 ? void 0 : options.eventType) === "other") {
            super.addEventListener(type, listener, options);
        }
        else {
            this.mouseEvents.push({ type, listener, options });
        }
    }
    removeEventListener(type, listener, options) {
        //特殊处理的事件，例如自定义事件，运行时事件
        if ((options === null || options === void 0 ? void 0 : options.eventType) === "runtime") {
            super.removeEventListener(type, listener, options);
        }
        else if ((options === null || options === void 0 ? void 0 : options.eventType) === "other") {
            super.removeEventListener(type, listener, options);
        }
        else {
            let targetIndex = -1;
            for (let i = 0; i < this.mouseEvents.length; i++) {
                if (this.mouseEvents[i].type === type &&
                    this.mouseEvents[i].listener === listener &&
                    this.mouseEvents[i].options === options) {
                    targetIndex = i;
                }
            }
            if (targetIndex !== -1)
                this.mouseEvents.splice(targetIndex, 1);
            super.removeEventListener(type, listener, options);
        }
    }
    get animation() {
        return __classPrivateFieldGet(this, _GraphicBase___animation__, "f");
    }
    set animation(v) {
        __classPrivateFieldSet(this, _GraphicBase___animation__, v, "f");
        if (!v) {
            __classPrivateFieldGet(this, _GraphicBase_instances, "m", _GraphicBase_redraw).call(this, "both");
            return;
        }
        else {
            __classPrivateFieldGet(this, _GraphicBase_instances, "m", _GraphicBase_redraw).call(this, "dynamic");
        }
        //@ts-ignore
        __classPrivateFieldGet(this, _GraphicBase___animation__, "f").target.push(this);
        __classPrivateFieldGet(this, _GraphicBase___animation__, "f").replay();
    }
    getContext(canvas) {
        //返回绘制位置
        for (let i = this; i !== document.body; i = i.parentElement) {
            let graphic = i;
            if (graphic.animation) {
                return canvas.dynamicsCanvas;
            }
        }
        return canvas.staticCanvas;
    }
    render(canvas, clearOption) {
        let ev = new RenderEvent("render");
        this.dispatchEvent(ev);
        this.mano = this.parentElement.mano;
        return this.getContext(canvas);
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
        _GraphicBase___fillRule__.set(this, FILL_RULE.NONZERO);
        _GraphicBase___backgroundColor__.set(this, new RGBA(0, 0, 0));
        _GraphicBase___color__.set(this, new RGBA(0, 0, 0));
        this.path = null;
        this.mouseEvents = [];
        _GraphicBase___animation__.set(this, void 0);
        let that = this;
        let registEvOnParent = super.addEventListener.bind(this);
        let removeEvOnParent = super.removeEventListener.bind(this);
        let coveredEles = []; //考虑到所有和当前坐标相重合的元素，就是被当前元素覆盖的元素
        //因为会有多个元素同时触发事件，所以需要把每一个元素以及是否已经注册的标识储存起来
        //这个属性就是元素和是否已经注册事件的布尔值的键值对
        let registed = new Map();
        //@param flag:判断是不是其他对象衍生的调用，防止无限循环
        function checkCB(mousemoveEv, flag) {
            let c = this.mano.canvas.staticCanvas;
            let boundingbox = c.canvas.getBoundingClientRect();
            let res;
            if (this.fillType === FILL_TYPE.GRAPHIC_FILL) {
                res = c.isPointInPath(this.path, mousemoveEv.x - boundingbox.x, mousemoveEv.y - boundingbox.y, this.fillRule);
            }
            else if (this.fillType === FILL_TYPE.GRAPHIC_STROKE) {
                res = c.isPointInStroke(this.path, mousemoveEv.x - boundingbox.x, mousemoveEv.y - boundingbox.y);
            }
            coveredEles = document.elementsFromPoint(mousemoveEv.x, mousemoveEv.y).filter(value => value instanceof GraphicBase);
            if (res && !registed.get(this)) {
                registed.set(this, true);
                this.mouseEvents.forEach(({ type, listener, options }, i, a) => {
                    //有类似于划入划出的立即触发事件
                    if (["mouseover", "mouseenter", "pointerenter", "pointerover"].indexOf(type) !== -1) {
                        listener.call(this, mousemoveEv);
                    }
                    registEvOnParent(type, listener, options);
                });
            }
            else if (!res && registed.get(this)) {
                registed.set(this, false);
                this.mouseEvents.forEach(({ type, listener, options }, i, a) => {
                    //有类似于划入划出的立即触发事件
                    if (["mouseleave", "mouseout", "pointerleave", "pointerout"].indexOf(type) !== -1) {
                        listener.call(this, mousemoveEv);
                    }
                    removeEvOnParent(type, listener, options);
                });
            }
            if (coveredEles.length !== 0 && !flag) {
                //为每一个被覆盖的元素同样声明事件
                coveredEles.forEach(ele => {
                    if (ele === this)
                        return;
                    checkCB.call(ele, mousemoveEv, true);
                });
            }
        }
        registEvOnParent("mouseover", function (mouseoverEv) {
            registEvOnParent("mousemove", checkCB.bind(that));
        });
        registEvOnParent("mouseout", function (mouseoutEv) {
            removeEvOnParent("mousemove", checkCB.bind(that));
        });
    }
}
_GraphicBase___content__ = new WeakMap(), _GraphicBase___textFormat__ = new WeakMap(), _GraphicBase___boxShadow__ = new WeakMap(), _GraphicBase___textShadow__ = new WeakMap(), _GraphicBase___border__ = new WeakMap(), _GraphicBase___font__ = new WeakMap(), _GraphicBase___boxTransform__ = new WeakMap(), _GraphicBase___textTransform__ = new WeakMap(), _GraphicBase___fillType__ = new WeakMap(), _GraphicBase___fillRule__ = new WeakMap(), _GraphicBase___backgroundColor__ = new WeakMap(), _GraphicBase___color__ = new WeakMap(), _GraphicBase___animation__ = new WeakMap(), _GraphicBase_instances = new WeakSet(), _GraphicBase_redraw = function _GraphicBase_redraw(options) {
    var _a, _b;
    //触发预备程序，在下一次屏幕刷新的时候更新
    let ev = new ContextChangeEvent("contextchange", {
        bubbles: true,
        cancelable: true,
    });
    ev.source = "graphic base";
    if (__classPrivateFieldGet(this, _GraphicBase___animation__, "f"))
        ev.clearOptions = "dynamic";
    else
        ev.clearOptions = "both";
    if (options)
        ev.clearOptions = options;
    (_b = (_a = this.mano) === null || _a === void 0 ? void 0 : _a.canvas) === null || _b === void 0 ? void 0 : _b.dispatchEvent(ev);
};
export { GraphicBase };
