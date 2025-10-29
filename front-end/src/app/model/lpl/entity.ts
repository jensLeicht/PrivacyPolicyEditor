import { StaticValidatorService } from "src/app/service/static-validator.service";
import { UIElement, LPLDataElement } from "./ui-element";

export class Entity extends UIElement implements LPLDataElement{
    name = "";
    authInfo = "";
    classification = "";
    type = "";
isEmpty(): boolean {
    return super.isEmpty()
    && this.name === ""
    && this.authInfo === ""
    && this.classification === "";
}
isComplete(): boolean {
    return super.isComplete()
    && StaticValidatorService.stringNotEmpty(this.name)
    && this.classification !== ""
    && this.type !== "";
}
isEqual(input: Entity): boolean {
    return super.isEqual(input)
    && this.name == input.name
    && this.authInfo == input.authInfo
    && this.classification == input.classification
    && this.type == input.type;
}
}