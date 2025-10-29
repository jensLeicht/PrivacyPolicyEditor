import { ValidatorService } from "src/app/service/validator.service";

export interface LPLDataElement {
    isEmpty(): boolean
    isComplete(): boolean
    isEqual(input: any): boolean
}

export class UIElement implements LPLDataElement{
    head = new Array<Header>();
    desc = new Array<Description>();
isEmpty(): boolean {
    var res = true;
    if (this.head.length > 0) {
        res = res && this.head.every(h => h.isEmpty());
    }
    if (this.desc.length > 0) {
        res = res && this.desc.every(d => d.isEmpty());
    }
    return res;
}
isComplete(): boolean {
    var headers = true;
    var descriptions = true;
    this.head.forEach(h => {
        headers = headers && h.isComplete();
    });
    this.desc.forEach(d => {
        descriptions = descriptions && d.isComplete();
    });
    return this.head.length > 0 && this.desc.length > 0
    && headers
    && descriptions;
}
isEqual(input: UIElement): boolean {
    var equal = true;
    if (this.head.length == input.head.length) {
        this.head.forEach(h => {
            equal = equal && input.head.some(ch => ch.lang === h.lang && ch.value === h.value);
        });
    } else {
        if (!(this.head.every(e => e.isEmpty()) && input.head.every(e => e.isEmpty()))) {
            equal = false;
        }
    }
    
    if (this.desc.length == input.desc.length) {
        this.desc.forEach(h => {
            equal = equal && input.desc.some(ch => ch.lang === h.lang && ch.value === h.value);
        });
    } else {
        if (!(this.desc.every(e => e.isEmpty()) && input.desc.every(e => e.isEmpty()))) {
            equal = false;
        }
    }
    return equal;
}
}

export class Header implements LPLDataElement{
    lang = "en";
    value = "";
constructor (head? : Header) {
    if (head) {
        this.lang = head.lang;
        this.value = head.value;
    }
}
isEmpty(): boolean {
    return this.value == "";
}
isComplete(): boolean {
    return this.lang !== "" && (/\S/.test(this.value));
}
isEqual(input: Header): boolean {
    return this.lang == input.lang && this.value == input.value;
}
}

export class Description implements LPLDataElement{
    lang = "en";
    value = "";
constructor (desc? : Description) {
    if (desc) {
        this.lang = desc.lang;
        this.value = desc.value;
    }
}
isEmpty(): boolean {
    return this.value == "";
}
isComplete(): boolean {
    return this.lang !== "" && (/\S/.test(this.value));
}
isEqual(input: Description): boolean {
    return this.lang == input.lang && this.value == input.value;
}
}