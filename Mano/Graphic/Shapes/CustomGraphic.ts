import {GraphicBase} from "../GraphicBase.js";
import {Canvas} from "../../Global/Canvas.js";
import {FILL_TYPE} from "../FILL_TYPE.js";
import {Text} from "./Text.js";
import {Debugger} from "../../Global/DebugOptions.js";
import {ColorBase} from "../../Fillable/ColorBase.js";
import {Parttern} from "../../Fillable/Parttern.js";
import {GradientBase} from "../../Fillable/GradientBase.js";
import {LinearGradient} from "../../Fillable/LinearGradient.js";
import {RadialGradient} from "../../Fillable/RadialGradient.js";
import {ConicGradient} from "../../Fillable/ConicGradient.js";
import {FillableGradientError} from "../../Exception/Fillable.GradientError.js";

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

    updateBoundingRect(){
        let {a, b, c, d, e, f} = this.boxTransform;

        let x = this.x;
        let y = this.y;
        let width = this.width;
        let height = this.height;

        this.style.display = "block";
        this.style.position = "absolute";
        this.style.left = x + "px";
        this.style.top = y + "px";
        this.style.transform = `matrix(${a},${b},${c},${d},${e},${f})`
        this.style.transformOrigin = `-${x}px -${y}px`
        this.style.width = width + "px";
        this.style.height = height + "px";
        this.style.zIndex = "1";
        if (Debugger.graphicEdges) this.style.border = "green solid 1px";
    }

    #setStyles(crc: CanvasRenderingContext2D) {
        crc.shadowBlur = this?.boxShadow?.blur || 0;
        crc.shadowColor = this?.boxShadow?.color?.toString() || "rgb(255,255,255)";
        crc.shadowOffsetX = this?.boxShadow?.offsetX || 0;
        crc.shadowOffsetY = this?.boxShadow?.offsetY || 0;

        crc.lineCap = this?.border?.lineCap || "square";
        crc.lineDashOffset = this?.border?.lineDash || 10;
        crc.lineJoin = this?.border?.lineJoin || "bevel";
        crc.lineWidth = this?.border?.lineWidth || 1;

        crc.setTransform(this.boxTransform || new DOMMatrix([1, 0, 0, 1, 0, 0]));

        if (this.backgroundColor instanceof ColorBase) {
            crc.fillStyle = this.backgroundColor.toString();
            crc.strokeStyle = this.backgroundColor.toString();
        } else if (this.backgroundColor instanceof Parttern) {
            if (!this.backgroundColor.image) {
                crc.fillStyle = "rgb(0,0,0)"
                crc.strokeStyle = "rgb(0,0,0)";
            }
            crc.fillStyle = crc.createPattern(this.backgroundColor.image, this.backgroundColor.repetition);
            crc.strokeStyle = crc.createPattern(this.backgroundColor.image, this.backgroundColor.repetition);
        } else if (this.backgroundColor instanceof GradientBase) {
            let gradient = null;
            if (this.backgroundColor instanceof LinearGradient) {
                gradient = crc.createLinearGradient(this.backgroundColor.startX, this.backgroundColor.startY, this.backgroundColor.endX, this.backgroundColor.endY);
            } else if (this.backgroundColor instanceof RadialGradient) {
                gradient = crc.createRadialGradient(this.backgroundColor.cx0, this.backgroundColor.cy0, this.backgroundColor.cr0, this.backgroundColor.cx1, this.backgroundColor.cy1, this.backgroundColor.cr1);
            } else if (this.backgroundColor instanceof ConicGradient) {
                gradient = crc.createConicGradient(this.backgroundColor.startAngle, this.backgroundColor.x, this.backgroundColor.y);
            }
            if (!gradient) {
                throw new FillableGradientError("渐变怎么能没有呢？");
            }

            this.backgroundColor.colorStops.forEach(({offset, color}, i, a) => {
                gradient.addColorStop(offset, color.toString());
            });

            crc.fillStyle = gradient;
            crc.strokeStyle = gradient;
        }
    }

    public render(canvas: Canvas): CanvasRenderingContext2D {
        let crc = super.render(canvas);

        crc.beginPath();
        this.#setStyles(crc);
        this.content = this.content || "";

        this.path = new Path2D();
        this.drawPath(this.path);

        this.fillType === FILL_TYPE.GRAPHIC_FILL ?
            crc.fill(this.path) :
            crc.stroke(this.path);

        crc.closePath();
        this.renderChildren(canvas);
        return null;
    }

    public drawPath(path: Path2D) {

    }

    constructor(x: number, y: number, width: number, height: number) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public static defineTagName(tagName: string) {
        customElements.define(tagName, this);
    }
}

customElements.define("mano-custom", CustomGraphic);
export {CustomGraphic}