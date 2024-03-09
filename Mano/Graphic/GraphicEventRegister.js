import { FILL_TYPE } from "./FILL_TYPE.js";
import { GraphicBase } from "./GraphicBase.js";
class GraphicEventRegister extends HTMLElement {
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
    constructor() {
        super();
        this.mouseEvents = [];
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
export { GraphicEventRegister };
