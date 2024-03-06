import { GraphicBase } from "../GraphicBase.js";
import { AfterRenderEvent } from "../../Event/AftereRenderEvent.js";
class Group extends GraphicBase {
    render(canvas) {
        let crc = super.render(canvas);
        this.path = new Path2D();
        const that = this;
        Array.from(this.children).forEach(element => {
            let graphic = element;
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
            graphic.render(canvas);
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
export { Group };
