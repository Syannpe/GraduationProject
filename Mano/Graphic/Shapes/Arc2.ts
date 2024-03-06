import {GraphicBase} from "../GraphicBase.js";
import {NonNegativeNumber} from "../../Unit/NonNegativeNumber.js";
import {Canvas} from "../../Global/Canvas.js";
import {FILL_TYPE} from "../FILL_TYPE.js";
import {Text} from "./Text.js";
import {Debugger} from "../../Global/DebugOptions.js";

class Arc2 extends GraphicBase {
    public startX: number;
    public startY: number;
    public x1: number;
    public y1: number;
    public x2: number;
    public y2: number;
    @NonNegativeNumber
    public radius: number;

    set content(content: string) {
        super.content = content;

        let text = new Text(content, this.startX, this.startY, this.radius);
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
        let x = Math.min(this.x1, this.x2, this.startX);
        let y = Math.min(this.y1, this.y2, this.startY);
        let width = Math.max(this.x1, this.x2, this.startX) - x;
        let height = Math.max(this.y1, this.y2, this.startY) - y;

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
        this.path.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius);

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
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                radius: number) {
        super();
        this.startX = startX;
        this.startY = startY;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.radius = radius;

    }
}

customElements.define("mano-arc2", Arc2);
export {Arc2}