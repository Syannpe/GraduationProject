import {GraphicBase} from "../GraphicBase.js";
import {Canvas} from "../../Global/Canvas.js";
import {FILL_TYPE} from "../FILL_TYPE.js";
import {Text} from "./Text.js";
import {Debugger} from "../../Global/DebugOptions.js";

class CustomGraphic extends GraphicBase {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    set content(content: string) {
        super.content = content;

        let text = new Text(content, this.x, this.y, this.width);
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
        let x = this.x;
        let y = this.y;
        let width = this.width;
        let height = this.height;

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
        this.drawPath(this.path);

        crc.fillStyle = this.backgroundColor.toString();
        crc.strokeStyle = this.backgroundColor.toString();
        this.fillType === FILL_TYPE.GRAPHIC_FILL ?
            crc.fill(this.path) :
            crc.stroke(this.path);

        crc.closePath();
        this.renderChildren(canvas);
        return null;
    }

    public drawPath(path: Path2D) {

    }

    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    static defineTagName(tagName: string) {
        customElements.define(tagName, this);
    }
}

customElements.define("mano-custom", CustomGraphic);
export {CustomGraphic}