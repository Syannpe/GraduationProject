import {GraphicBase} from "../GraphicBase.js";
import {Canvas} from "../../Global/Canvas.js";
import {AfterRenderEvent} from "../../Event/AfterRenderEvent.js";

class Group extends GraphicBase {

    public render(canvas: Canvas, clearOption?: "both" | "static" | "dynamic"): CanvasRenderingContext2D {
        let crc = super.render(canvas);

        this.path = new Path2D();

        const that = this;
        Array.from(this.children).forEach(element => {
            let graphic = element as GraphicBase;
            graphic.textFormat = graphic.textFormat || that.textFormat;
            graphic.boxShadow = graphic.boxShadow || that.boxShadow;
            graphic.textShadow = graphic.textShadow || that.textShadow;
            graphic.border = graphic.border || that.border;
            graphic.font = graphic.font || that.font;
            graphic.boxTransform = graphic.boxTransform || that.boxTransform;
            graphic.textTransform = graphic.textTransform || that.textTransform;
            graphic.fillType = graphic.fillType || that.fillType;
            graphic.fillRule = graphic.fillRule || that.fillRule;
            graphic.backgroundColor = graphic.backgroundColor || that.backgroundColor;
            graphic.color = graphic.color || that.color;

            if (!(graphic instanceof Group) && graphic.getContext(canvas) === canvas.dynamicsCanvas && clearOption === "static") {
                return;
            } else if (!(graphic instanceof Group) && graphic.getContext(canvas) === canvas.staticCanvas && clearOption === "dynamic") {
                return;
            }

            if (graphic instanceof Group) {
                graphic.render(canvas,clearOption);
            } else {
                graphic.render(canvas);
            }
            this.path.addPath(graphic.path);

            let ev = new AfterRenderEvent("afterrender", {
                bubbles: true,
                cancelable: true,
            });
            graphic.dispatchEvent(ev);
        });
        return null;
    }

    constructor() {
        super();
    }
}

customElements.define("mano-group", Group);
export {Group}