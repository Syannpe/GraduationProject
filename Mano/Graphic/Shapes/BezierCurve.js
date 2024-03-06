var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BezierCurve_instances, _BezierCurve_setStyles;
import { GraphicBase } from "../GraphicBase.js";
import { FILL_TYPE } from "../FILL_TYPE.js";
import { Text } from "./Text.js";
import { Debugger } from "../../Global/DebugOptions.js";
class BezierCurve extends GraphicBase {
    set content(content) {
        super.content = content;
        let text = new Text(content, this.startX, this.startY, this.endX - this.startX);
        text.textFormat = this.textFormat;
        text.textShadow = this.textShadow;
        text.textTransform = this.textTransform;
        text.font = this.font;
        text.color = this.color;
        this.appendChild(text);
    }
    get content() {
        return super.content;
    }
    render(canvas) {
        let crc = super.render(canvas);
        crc.beginPath();
        __classPrivateFieldGet(this, _BezierCurve_instances, "m", _BezierCurve_setStyles).call(this, crc);
        this.path = new Path2D();
        this.path.moveTo(this.startX, this.startY);
        this.path.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.endX, this.endY);
        crc.fillStyle = this.backgroundColor.toString();
        crc.strokeStyle = this.backgroundColor.toString();
        this.fillType === FILL_TYPE.GRAPHIC_FILL ?
            crc.fill(this.path) :
            crc.stroke(this.path);
        crc.closePath();
        this.renderChildren(canvas);
        return null;
    }
    constructor(startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY) {
        super();
        _BezierCurve_instances.add(this);
        this.startX = startX;
        this.startY = startY;
        this.cp1x = cp1x;
        this.cp1y = cp1y;
        this.cp2x = cp2x;
        this.cp2y = cp2y;
        this.endX = endX;
        this.endY = endY;
    }
}
_BezierCurve_instances = new WeakSet(), _BezierCurve_setStyles = function _BezierCurve_setStyles(crc) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    let x = Math.min(this.startX, this.cp1x, this.cp2x, this.endX);
    let y = Math.min(this.startY, this.cp1y, this.cp2y, this.endY);
    let width = Math.max(this.startX, this.cp1x, this.cp2x, this.endX) - x;
    let height = Math.max(this.startY, this.cp1y, this.cp2y, this.endY) - y;
    this.style.display = "block";
    this.style.position = "absolute";
    this.style.transform = "translate(" + x + "px," + y + "px)";
    this.style.width = width + "px";
    this.style.height = height + "px";
    if (Debugger.graphicEdges)
        this.style.border = "green solid 1px";
    crc.shadowBlur = ((_a = this === null || this === void 0 ? void 0 : this.boxShadow) === null || _a === void 0 ? void 0 : _a.blur) || 0;
    crc.shadowColor = ((_c = (_b = this === null || this === void 0 ? void 0 : this.boxShadow) === null || _b === void 0 ? void 0 : _b.color) === null || _c === void 0 ? void 0 : _c.toString()) || "rgb(255,255,255)";
    crc.shadowOffsetX = ((_d = this === null || this === void 0 ? void 0 : this.boxShadow) === null || _d === void 0 ? void 0 : _d.offsetX) || 0;
    crc.shadowOffsetY = ((_e = this === null || this === void 0 ? void 0 : this.boxShadow) === null || _e === void 0 ? void 0 : _e.offsetY) || 0;
    crc.lineCap = ((_f = this === null || this === void 0 ? void 0 : this.border) === null || _f === void 0 ? void 0 : _f.lineCap) || "square";
    crc.lineDashOffset = ((_g = this === null || this === void 0 ? void 0 : this.border) === null || _g === void 0 ? void 0 : _g.lineDash) || 10;
    crc.lineJoin = ((_h = this === null || this === void 0 ? void 0 : this.border) === null || _h === void 0 ? void 0 : _h.lineJoin) || "bevel";
    crc.lineWidth = ((_j = this === null || this === void 0 ? void 0 : this.border) === null || _j === void 0 ? void 0 : _j.lineWidth) || 1;
    crc.setTransform(this.boxTransform || new DOMMatrix([1, 0, 0, 1, 0, 0]));
    crc.fillStyle = this.backgroundColor.toString();
    crc.strokeStyle = this.backgroundColor.toString();
};
customElements.define("mano-bezier-curve", BezierCurve);
export { BezierCurve };
