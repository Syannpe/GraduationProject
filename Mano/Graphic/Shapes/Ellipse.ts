import {GraphicBase} from "../GraphicBase.js";
import {NonNegativeNumber} from "../../Unit/NonNegativeNumber.js";
import {Canvas} from "../../Global/Canvas.js";
import {FILL_TYPE} from "../FILL_TYPE.js";
import {Debugger} from "../../Global/DebugOptions.js";
import {Text} from "./Text.js";

class Ellipse extends GraphicBase {
    public x: number
    public y: number
    @NonNegativeNumber
    public radiusX: number
    @NonNegativeNumber
    public radiusY: number
    public rotation: number
    public startAngle: number
    public endAngle: number
    public counterclockwise?: boolean

    set content(content: string) {
        super.content = content;

        let text = new Text(content, this.x, this.y, this.radiusX);
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
        let maxR = Math.max(this.radiusX, this.radiusY);
        let x = this.x - maxR;
        let y = this.y - maxR;
        let width = 2 * maxR;
        let height = 2 * maxR;

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
        this.path.ellipse(this.x, this.y,
            this.radiusX, this.radiusY,
            this.rotation, this.startAngle,
            this.endAngle, this.counterclockwise);

        crc.fillStyle = this.backgroundColor.toString();
        crc.strokeStyle = this.backgroundColor.toString();
        this.fillType === FILL_TYPE.GRAPHIC_FILL ?
            crc.fill(this.path) :
            crc.stroke(this.path);

        crc.closePath();
        this.renderChildren(canvas);
        return null;
    }

    constructor(x: number,
                y: number,
                radiusX: number,
                radiusY: number,
                rotation: number,
                startAngle: number,
                endAngle: number,
                counterclockwise?: boolean) {
        super();
        this.x = x;
        this.y = y;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.rotation = rotation;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.counterclockwise = counterclockwise;

    }
}

customElements.define("mano-ellipse", Ellipse);
export {Ellipse}