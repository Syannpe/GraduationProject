import {GraphicBase} from "../GraphicBase.js";
import {Canvas} from "../../Global/Canvas.js";
import {FILL_TYPE} from "../FILL_TYPE.js";
import {Text} from "./Text.js";
import {Debugger} from "../../Global/DebugOptions.js";

class BezierCurve extends GraphicBase {
    public startX: number;
    public startY: number;
    public cp1x: number;
    public cp1y: number;
    public cp2x: number;
    public cp2y: number;
    public endX: number;
    public endY: number;

    set content(content: string) {
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

    #setStyles(crc: CanvasRenderingContext2D) {
        let x = Math.min(this.startX, this.cp1x, this.cp2x, this.endX);
        let y = Math.min(this.startY, this.cp1y, this.cp2y, this.endY);
        let width = Math.max(this.startX, this.cp1x, this.cp2x, this.endX) - x;
        let height = Math.max(this.startY, this.cp1y, this.cp2y, this.endY) - y;

        this.style.display = "block";
        this.style.position = "absolute";
        this.style.transform = "translate(" + x + "px," + y + "px)"
        this.style.width = width + "px";
        this.style.height = height + "px";

        if (Debugger.graphicEdges) this.style.border = "green solid 1px";

        crc.shadowBlur = this?.boxShadow?.blur || 0;
        crc.shadowColor = this?.boxShadow?.color?.toString() || "rgb(255,255,255)";
        crc.shadowOffsetX = this?.boxShadow?.offsetX || 0;
        crc.shadowOffsetY = this?.boxShadow?.offsetY || 0;

        crc.lineCap = this?.border?.lineCap || "square";
        crc.lineDashOffset = this?.border?.lineDash || 10;
        crc.lineJoin = this?.border?.lineJoin || "bevel";
        crc.lineWidth = this?.border?.lineWidth || 1;

        crc.setTransform(this.boxTransform || new DOMMatrix([1, 0, 0, 1, 0, 0]));

        crc.fillStyle = this.backgroundColor.toString();
        crc.strokeStyle = this.backgroundColor.toString();
    }

    public render(canvas: Canvas): CanvasRenderingContext2D {
        let crc = super.render(canvas);

        crc.beginPath();
        this.#setStyles(crc);

        this.path = new Path2D();
        this.path.moveTo(this.startX, this.startY)
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

    constructor(startX: number,
                startY: number,
                cp1x: number,
                cp1y: number,
                cp2x: number,
                cp2y: number,
                endX: number,
                endY: number
    ) {
        super();
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

customElements.define("mano-bezier-curve", BezierCurve);
export {BezierCurve}