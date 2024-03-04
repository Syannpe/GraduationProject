///<reference path="./Color.ts" />
///<reference path="./Gradient.ts" />
///<reference path="./Parttern.ts" />
import {ColorBase} from "./ColorBase.js";
import {Gradient} from "./Gradient.js";
import {Parttern} from "./Parttern.js";

type Fillable = ColorBase | Gradient | Parttern;

export {Fillable}
