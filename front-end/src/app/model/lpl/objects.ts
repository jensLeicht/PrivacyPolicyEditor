import { StaticValidatorService } from "src/app/service/static-validator.service";
import { Entity } from "./entity";
import { UIElement, LPLDataElement, Description, Header } from "./ui-element";

export class Icon {
    icon = new IconData();
}

export class IconData extends UIElement{
    name: string = "";
}

export class Purpose extends UIElement implements LPLDataElement {
    name = "";
    optOut = false;
    required = false;
    pointOfAcceptance = "";
    dataRecipientList = new Array<DataRecipient>();
    dataList = new Array<Data>();
    retention = new Retention();
    privacyModelList = new Array<PrivacyModel>();
    legalBasisList = new Array<LegalBasis>();
    automatedDecisionMakingList = new Array<AutomatedDecisionMaking>();
    pseudonymizationMethodList = new Array<PseudonymizationMethod>();
    constructor (purpose? : Purpose) {
        super();
        if (purpose) {
            this.desc = new Array<Description>();
            purpose.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            purpose.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.name = purpose.name;
            this.optOut = purpose.optOut;
            this.required = purpose.required;
            this.pointOfAcceptance = purpose.pointOfAcceptance;
            this.dataRecipientList = new Array<DataRecipient>();
            purpose.dataRecipientList.forEach(d => {
                this.dataRecipientList.push(new DataRecipient(d));
            });
            this.dataList = new Array<Data>();
            purpose.dataList.forEach(d => {
                this.dataList.push(new Data(d));
            });
            this.retention = new Retention(purpose.retention);
            this.privacyModelList = new Array<PrivacyModel>();
            purpose.privacyModelList.forEach(pm => {
                this.privacyModelList.push(new PrivacyModel(pm));
            });
            this.legalBasisList = new Array<LegalBasis>();
            purpose.legalBasisList.forEach(lb => {
                this.legalBasisList.push(new LegalBasis(lb));
            });
            this.automatedDecisionMakingList = new Array<AutomatedDecisionMaking>();
            purpose.automatedDecisionMakingList.forEach(adm => {
                this.automatedDecisionMakingList.push(new AutomatedDecisionMaking(adm));
            });
            this.pseudonymizationMethodList = new Array<PseudonymizationMethod>();
            purpose.pseudonymizationMethodList.forEach(pm => {
                this.pseudonymizationMethodList.push(new PseudonymizationMethod(pm));
            });
    }
}
isEmpty(): boolean {    
    var res = false;
    res = this.dataRecipientList.length == 0;
    if (!res) {
        res = this.dataRecipientList.every(dr => dr.isEmpty());
    }
    var res2 = false;
    res2 = this.dataList.length == 0;
    if (!res2) {
        res2 = this.dataList.every(d => d.isEmpty());
    }
    var res3 = false;
    res3 = this.privacyModelList.length == 0;
    if (!res3) {
        res3 = this.privacyModelList.every(d => d.isEmpty());
    }
    var res4 = false;
    res4 = this.legalBasisList.length == 0;
    if (!res4) {
        res4 = this.legalBasisList.every(d => d.isEmpty());
    }
    var res5 = false;
    res5 = this.automatedDecisionMakingList.length == 0;
    if (!res5) {
        res5 = this.automatedDecisionMakingList.every(d => d.isEmpty());
    }
    var res6 = false;
    res6 = this.pseudonymizationMethodList.length == 0;
    if (!res6) {
        res6 = this.pseudonymizationMethodList.every(d => d.isEmpty());
    }

    return res = super.isEmpty()
    && this.name === ""
    && this.optOut == false
    && this.required == false
    && this.pointOfAcceptance === ""
    && res
    && res2
    && this.retention.isEmpty()
    && res3
    && res4
    && res5
    && res6;   
}
isComponentComplete(): boolean {
    return super.isComplete()
    && StaticValidatorService.stringNotEmpty(this.name);
}
isComplete(): boolean {
    var res = false;
    res = this.dataRecipientList.length > 0;
    if (res) {
        res = this.dataRecipientList.every(dr => dr.isComplete());
    } else {
        res = true;
    }
    var res2 = false;
    res2 = this.dataList.length > 0;
    if (res2) {
        res2 = this.dataList.every(d => d.isComplete());
    }
    var res3 = false;
    res3 = this.legalBasisList.length > 0;
    if (res3) {
        res3 = this.legalBasisList.every(d => d.isComplete());
    }
    return super.isComplete()
    && StaticValidatorService.stringNotEmpty(this.name)
    && res
    && res2
    && this.retention.isComplete()
    && res3;
}
isPurposeCardComplete(): boolean {
//    var res = false;
//    res = this.dataRecipientList.length > 0;
    var res2 = false;
    res2 = this.dataList.length > 0;
    var res3 = false;
    res3 = this.legalBasisList.length > 0;
    if (res3) {
        res3 = this.legalBasisList.every(d => d.isComplete());
    }
    return super.isComplete()
    && StaticValidatorService.stringNotEmpty(this.name)
//    && res
    && res2
    && this.retention.isComplete()
    && res3;
}
isEqual(input: Purpose): boolean {    
    var res = false;
    res = this.dataRecipientList.length == input.dataRecipientList.length;
    if (res) {
        for (let index = 0; index < this.dataRecipientList.length; index++) {
            const element = this.dataRecipientList[index];
            res = res && element.isEqual(input.dataRecipientList[index]);
        }
    }
    res = this.dataList.length == input.dataList.length;
    if (res) {
        for (let index = 0; index < this.dataList.length; index++) {
            const element = this.dataList[index];
            res = res && element.isEqual(input.dataList[index]);
        }
    }
    res = this.privacyModelList.length == input.privacyModelList.length;
    if (res) {
        for (let index = 0; index < this.privacyModelList.length; index++) {
            const element = this.privacyModelList[index];
            res = res && element.isEqual(input.privacyModelList[index]);
        }
    }
    res = this.legalBasisList.length == input.legalBasisList.length;
    if (res) {
        for (let index = 0; index < this.legalBasisList.length; index++) {
            const element = this.legalBasisList[index];
            res = res && element.isEqual(input.legalBasisList[index]);
        }
    }
    res = this.automatedDecisionMakingList.length == input.automatedDecisionMakingList.length;
    if (res) {
        for (let index = 0; index < this.automatedDecisionMakingList.length; index++) {
            const element = this.automatedDecisionMakingList[index];
            res = res && element.isEqual(input.automatedDecisionMakingList[index]);
        }
    }
    res = this.pseudonymizationMethodList.length == input.pseudonymizationMethodList.length;
    if (res) {
        for (let index = 0; index < this.pseudonymizationMethodList.length; index++) {
            const element = this.pseudonymizationMethodList[index];
            res = res && element.isEqual(input.pseudonymizationMethodList[index]);
        }
    }
    return super.isEqual(input)
    && this.name == input.name
    && this.optOut == input.optOut
    && this.required == input.required
    && this.pointOfAcceptance == input.pointOfAcceptance
    && res
    && this.retention.isEqual(input.retention);
}
}

export class DataSubjectRight extends UIElement implements LPLDataElement{
    name = "";
    constructor (dsr? : DataSubjectRight) {
        super();
        if (dsr) {
            this.desc = new Array<Description>();
            dsr.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            dsr.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.name = dsr.name;
        }
    }
isEmpty(): boolean {
    return super.isEmpty() && this.name === "";
}
isComplete(): boolean {
    return super.isComplete()
    && this.name !== "";
}
isEqual(input: DataSubjectRight): boolean {
    return super.isEqual(input)
    && this.name == input.name;
}
}

export class LodgeComplaint extends Entity implements LPLDataElement{
    firstName = "";
    lastName = "";
    address = "";
    phoneNumber = "";
    email = "";
    constructor (lc? : LodgeComplaint) {
        super();
        if (lc) {
            this.desc = new Array<Description>();
            lc.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            lc.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.address = lc.address;
            this.authInfo = lc.authInfo;
            this.classification = lc.classification;
            this.email = lc.email;
            this.firstName = lc.firstName;
            this.lastName = lc.lastName;
            this.name = lc.name;
            this.phoneNumber = lc.phoneNumber;
            this.type = lc.type;
        }
    }
isEmpty(): boolean {
    return super.isEmpty() && this.firstName === "" && this.lastName === "" && this.address === "" && this.phoneNumber === "" && this.email === "";
}
isComplete(): boolean {
    return super.isComplete()
    && StaticValidatorService.stringNotEmpty(this.firstName);
}
isEqual(input: LodgeComplaint): boolean {
    return super.isEqual(input)
    && this.firstName == input.firstName
    && this.lastName == input.lastName
    && this.address == input.address
    && this.phoneNumber == input.phoneNumber
    && this.email == input.email;
}
}

export class Safeguard extends UIElement implements LPLDataElement {
    name = "";
    constructor (sg? : Safeguard) {
        super();
        if (sg) {
            this.desc = new Array<Description>();
            sg.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            sg.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.name = sg.name;
        }
    }
isEmpty(): boolean {    
    return super.isEmpty()
    && this.name === "";
}
isComplete(): boolean {
    return super.isComplete()
    && this.name !== "";
}
isEqual(input: Safeguard): boolean {
    return super.isEqual(input)
    && this.name == input.name;
}
}

export class Data extends UIElement implements LPLDataElement {
    id = 0;
    name = "";
    required = false;
    pointOfAcceptance = "";
    dataType = "";
    privacyGroup = "";
    anonymizationMethod = new AnonymizationMethod();
    dataCategoryList = new Array<DataCategory>();
    dataGroupList = new Array<DataGroup>();
    constructor (data? : Data) {
        super();
        if (data) {
            this.id = data.id;
            this.desc = new Array<Description>();
            data.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            data.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.name = data.name;
            this.required = data.required;
            this.pointOfAcceptance = data.pointOfAcceptance;
            this.dataType = data.dataType;
            this.privacyGroup = data.privacyGroup;
            this.anonymizationMethod = new AnonymizationMethod(data.anonymizationMethod);
            this.dataCategoryList = new Array<DataCategory>();
            data.dataCategoryList.forEach(d => {
                this.dataCategoryList.push(new DataCategory(d));
            });
            this.dataGroupList = new Array<DataGroup>();
            data.dataGroupList.forEach(d => {
                this.dataGroupList.push(new DataGroup(d));
            });
        } else {
            this.desc = new Array<Description>();
            this.desc.push(new Description());
            this.head = new Array<Header>();
            this.head.push(new Header());
        }
    }
isEmpty(): boolean {    
    return super.isEmpty()
    && this.name === ""
    && this.required === false
    && this.dataType === ""
    && this.privacyGroup === ""
    && this.anonymizationMethod.isEmpty()
    && this.dataCategoryList.length == 0
    && this.dataGroupList.length == 0;
}
isComplete(): boolean {
    var res = true;
    if (this.dataCategoryList.length > 0) {
        res = res && this.dataCategoryList.every(elem => elem.isComplete());
    } else {
        res = false;
    }
    var res2 = true;
    if (this.dataGroupList.length > 0) {
        res2 = res2 && this.dataGroupList.every(elem => elem.isComplete());
    }
    return super.isComplete()
    && StaticValidatorService.stringNotEmpty(this.name)
    && this.dataType !== ""
    && this.privacyGroup !== ""
    && (this.anonymizationMethod.isComplete() || this.anonymizationMethod.isEmpty())
    && res
    && res2;
}
isEqual(input: Data): boolean {
    var res = true;    
    if (this.dataCategoryList.length == input.dataCategoryList.length) {
        for (let index = 0; index < this.dataCategoryList.length; index++) {
           res = res && this.dataCategoryList[index].isEqual(input.dataCategoryList[index]);            
        }
    } else {
        res = false;
    }
    var res2 = true;        
    if (this.dataGroupList.length == input.dataGroupList.length) {
        for (let index = 0; index < this.dataGroupList.length; index++) {
           res2 = res2 && this.dataGroupList[index].isEqual(input.dataGroupList[index]);            
        }
    } else {
        res2 = false;
    }
    return super.isEqual(input)
    && this.name == input.name
    && this.required == input.required
    && this.dataType == input.dataType
    && this.privacyGroup == input.privacyGroup
    && this.anonymizationMethod.isEqual(input.anonymizationMethod)
    && res
    && res2;
}
}

export class Retention extends UIElement implements LPLDataElement {
    type = "";
    pointInTime = "";
    constructor (rt? : Retention) {
        super();
        if (rt) {
            this.desc = new Array<Description>();
            rt.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            rt.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.type = rt.type;
            this.pointInTime = rt.pointInTime;
        }
    }
isEmpty(): boolean {
    return super.isEmpty()
    && this.type === ""
    && this.pointInTime === "";
}
isComplete(): boolean {
    var res = false;
    if (this.type == "indefinite") {
        res = true;
    } else {
        res = this.pointInTime !== "" && this.pointInTime !== "NaN";
    }
    
    return super.isComplete()
    && res;
}
isEqual(input: Retention): boolean {
    return super.isEqual(input)
    && this.type == input.type
    && this.pointInTime == input.pointInTime;
}
}

export class DataCategory extends UIElement implements LPLDataElement {
    name = "";
    constructor (dc? : DataCategory) {
        super();
        if (dc) {
            this.desc = new Array<Description>();
            dc.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            dc.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.name = dc.name;
        }
    }
isEmpty(): boolean {
    return super.isEmpty()
    && this.name === "";
}
isComplete(): boolean {
    return super.isComplete()
    && this.name !== "";
}
isEqual(input: DataCategory): boolean {
    return super.isEqual(input)
    && this.name == input.name;
}
}

export class DataGroup extends UIElement implements LPLDataElement {
    name = "";
    constructor (dg? : DataGroup) {
        super();
        if (dg) {
            this.desc = new Array<Description>();
            dg.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            dg.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.name = dg.name;
        }
    }
isEmpty(): boolean {
    return super.isEmpty()
    && this.name === "";
}
isComplete(): boolean {
    return super.isComplete()
    && this.name !== "";
}
isEqual(input: DataGroup): boolean {    
    return super.isEqual(input)
    && this.name == input.name;
}
}

export class PrivacyModel extends UIElement implements LPLDataElement {
    name = "";
    nameOfDataList = new Array<NameOfData>();
    privacyModelAttributeList = new Array<PrivacyModelAttribute>();
    constructor (pm? : PrivacyModel) {
        super();
        if (pm) {
            this.desc = new Array<Description>();
            pm.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            pm.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.name = pm.name;
            this.nameOfDataList = new Array<NameOfData>();
            pm.nameOfDataList.forEach(nod => {
                this.nameOfDataList.push(new NameOfData(nod));
            });
            this.privacyModelAttributeList = new Array<PrivacyModelAttribute>();
            pm.privacyModelAttributeList.forEach(pma => {
                this.privacyModelAttributeList.push(new PrivacyModelAttribute(pma));
            });
        }
    }
isEmpty(): boolean {
    var res = true;
    res = res && this.nameOfDataList.length == 0;
    if (!res) {
        res = this.nameOfDataList.every(nod => nod.isEmpty());
    }
    var res2 = true;
    res2 = res2 && this.privacyModelAttributeList.length == 0;
    if (!res2) {
        res2 = this.privacyModelAttributeList.every(pma => pma.isEmpty());
    }
    return super.isEmpty()
    && this.name === ""
    && res
    && res2;
}
isComplete(): boolean {
    var res = true;
    res = res && this.privacyModelAttributeList.length == 0;
    if (!res) {
        res = this.privacyModelAttributeList.every(pma => pma.isEmpty() || pma.isComplete());
    }
    return super.isComplete()
    && StaticValidatorService.stringNotEmpty(this.name)
    && this.nameOfDataList.length > 0
    && res;
}
isEqual(input: PrivacyModel): boolean {
    var res = true;    
    if (this.nameOfDataList.length == input.nameOfDataList.length) {
        for (let index = 0; index < this.nameOfDataList.length; index++) {
           res = res && this.nameOfDataList[index].isEqual(input.nameOfDataList[index]);            
        }
    } else {
        res = false;
    }
    var res2 = true;        
    if (this.privacyModelAttributeList.length == input.privacyModelAttributeList.length) {
        for (let index = 0; index < this.privacyModelAttributeList.length; index++) {
           res2 = res2 && this.privacyModelAttributeList[index].isEqual(input.privacyModelAttributeList[index]);            
        }
    } else {
        if (!(this.privacyModelAttributeList.every(e => e.isEmpty()) && input.privacyModelAttributeList.every(e => e.isEmpty()))) {
            res = false;
        }
    }
    return super.isEqual(input)
    && this.name == input.name
    && res
    && res2;
}
}

export class LegalBasis extends UIElement implements LPLDataElement{
    lbCategory = "";
    constructor (lb? : LegalBasis) {
        super();
        if (lb) {
            this.desc = new Array<Description>();
            lb.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            lb.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.lbCategory = lb.lbCategory;
        }
    }
isEmpty(): boolean {
    return super.isEmpty()
    && this.lbCategory === "";
}
isComplete(): boolean {
    return super.isComplete()
    && this.lbCategory !== "";
}
isEqual(input: LegalBasis): boolean {
    return super.isEqual(input)
    && this.lbCategory == input.lbCategory;
}
}

export class AutomatedDecisionMaking extends UIElement implements LPLDataElement {
    name = "";
    constructor (adm? : AutomatedDecisionMaking) {
        super();
        if (adm) {
            this.desc = new Array<Description>();
            adm.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            adm.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.name = adm.name;
        }
    }
isEmpty(): boolean {
    return super.isEmpty()
    && this.name === "";
}
isComplete(): boolean {
    return super.isComplete()
    && this.name !== "";
}
isEqual(input: AutomatedDecisionMaking): boolean {
    return super.isEqual(input)
    && this.name == input.name;
}
}

export class PseudonymizationMethod extends UIElement implements LPLDataElement {
    name = "";
    attrName = "";
    pseudonymizationMethodAttributeList = new Array<PseudonymizationMethodAttribute>();
    nameOfDataList = new Array<NameOfData>();
    constructor (pm? : PseudonymizationMethod) {
        super();
        if (pm) {
            this.desc = new Array<Description>();
            pm.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            pm.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.name = pm.name;
            this.attrName = pm.attrName;
            this.pseudonymizationMethodAttributeList = new Array<PseudonymizationMethodAttribute>();
            pm.pseudonymizationMethodAttributeList.forEach(pma => {
                this.pseudonymizationMethodAttributeList.push(new PseudonymizationMethodAttribute(pma));
            });
            this.nameOfDataList = new Array<NameOfData>();
            pm.nameOfDataList.forEach(nod => {
                this.nameOfDataList.push(new NameOfData(nod));
            });
        }
    }
isEmpty(): boolean {
    var res = true;
    if (this.pseudonymizationMethodAttributeList.length > 0) {
        res = res && this.pseudonymizationMethodAttributeList.every(elem => elem.isEmpty());
    }
    if (this.nameOfDataList.length > 0) {
        res = res && this.nameOfDataList.every(elem => elem.isEmpty());
    }
    return super.isEmpty()
    && this.name === ""
    && this.attrName === ""
    && res;
}
isComplete(): boolean {
    var res = true;
    if (this.pseudonymizationMethodAttributeList.length > 0) {
        res = res && this.pseudonymizationMethodAttributeList.every(elem => elem.isComplete());
    }
    var res2 = true;
    if (this.nameOfDataList.length > 0) {
        res2 = res2 && this.nameOfDataList.every(elem => elem.isComplete());
    } else {
        res2 = false;
    }
    return super.isComplete()
    && this.name !== ""
    && this.attrName !== ""
    && res
    && res2;
}
isEqual(input: PseudonymizationMethod): boolean {
    var res = true;
    if (this.pseudonymizationMethodAttributeList.length == input.pseudonymizationMethodAttributeList.length) {
        if (this.pseudonymizationMethodAttributeList.length > 0) {
            for (let index = 0; index < this.pseudonymizationMethodAttributeList.length; index++) {
                res = res && this.pseudonymizationMethodAttributeList[index].isEqual(input.pseudonymizationMethodAttributeList[index]);
            }
        }
    } else {
        if (!(this.pseudonymizationMethodAttributeList.every(e => e.isEmpty()) && input.pseudonymizationMethodAttributeList.every(e => e.isEmpty()))) {
            res = false;
        }
    }
    if (this.nameOfDataList.length == input.nameOfDataList.length) {
        if (this.nameOfDataList.length > 0) {
            for (let index = 0; index < this.nameOfDataList.length; index++) {
                res = res && this.nameOfDataList[index].isEqual(input.nameOfDataList[index]);
            }
        }
    } else {
        if (!(this.nameOfDataList.every(e => e.isEmpty()) && input.nameOfDataList.every(e => e.isEmpty()))) {
            res = false;
        }
    }    
    return super.isEqual(input)
    && this.name == input.name
    && this.attrName == input.attrName
    && res;
}
}

export class AnonymizationMethod extends UIElement implements LPLDataElement {
    name = "";
    hierarchyEntityList = new Array<HierarchyEntity>();
    anonymizationMethodAttributeList = new Array<AnonymizationMethodAttribute>();
    constructor (am? : AnonymizationMethod) {
        super();
        if (am) {
            this.desc = new Array<Description>();
            am.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            am.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.name = am.name;
            this.hierarchyEntityList = new Array<HierarchyEntity>();
            am.hierarchyEntityList.forEach(he => {
                this.hierarchyEntityList.push(new HierarchyEntity(he));
            });
            this.anonymizationMethodAttributeList = new Array<AnonymizationMethodAttribute>();
            am.anonymizationMethodAttributeList.forEach(ama => {
                this.anonymizationMethodAttributeList.push(new AnonymizationMethodAttribute(ama));
            });
        }
    }
isEmpty(): boolean {
    var res = true;
    if (this.hierarchyEntityList.length > 0) {
        res = res && this.hierarchyEntityList.every(elem => elem.isEmpty());
    }
    if (this.anonymizationMethodAttributeList.length > 0) {
        res = res && this.anonymizationMethodAttributeList.every(elem => elem.isEmpty());
    }
    return super.isEmpty()
    && this.name === ""
    && res;
}
isComplete(): boolean {
    var res = true;
    if (this.hierarchyEntityList.length > 0) {
        res = res && this.hierarchyEntityList.every(elem => elem.isComplete());
    }
    var res2 = true;
    if (this.anonymizationMethodAttributeList.length > 0) {
        res2 = res2 && this.anonymizationMethodAttributeList.every(elem => elem.isComplete());
    }
    return super.isComplete()
    && StaticValidatorService.stringNotEmpty(this.name)
    && res
    && res2;
}
isEqual(input: AnonymizationMethod): boolean {
    var res = true;
    if (this.hierarchyEntityList.length == input.hierarchyEntityList.length) {
        if (this.hierarchyEntityList.length > 0) {
            for (let index = 0; index < this.hierarchyEntityList.length; index++) {
                res = res && this.hierarchyEntityList[index].isEqual(input.hierarchyEntityList[index]);
            }
        }
    } else {
        if (!(this.hierarchyEntityList.every(e => e.isEmpty()) && input.hierarchyEntityList.every(e => e.isEmpty()))) {
            res = false;
        }
    }
    if (this.anonymizationMethodAttributeList.length == input.anonymizationMethodAttributeList.length) {
        if (this.anonymizationMethodAttributeList.length > 0) {
            for (let index = 0; index < this.anonymizationMethodAttributeList.length; index++) {
                res = res && this.anonymizationMethodAttributeList[index].isEqual(input.anonymizationMethodAttributeList[index]);
            }
        }
    } else {
        if (!(this.anonymizationMethodAttributeList.every(e => e.isEmpty()) && input.anonymizationMethodAttributeList.every(e => e.isEmpty()))) {
            res = false;
        }
    }    
    return super.isEqual(input)
    && this.name == input.name
    && res;
}
}

export class Controller extends Entity implements LPLDataElement{
    firstName = "";
    lastName = "";
    address = "";
    phoneNumber = "";
    email = "";
    constructor (con? : Controller) {
        super();
        if (con) {
            this.desc = new Array<Description>();
            con.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            con.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.address = con.address;
            this.authInfo = con.authInfo;
            this.classification = con.classification;
            this.email = con.email;
            this.firstName = con.firstName;
            this.lastName = con.lastName;
            this.name = con.name;
            this.phoneNumber = con.phoneNumber;
            this.type = con.type;
        } else {
            this.desc = new Array<Description>();
            this.desc.push(new Description());
            this.head = new Array<Header>();
            this.head.push(new Header());
            this.type = "Controller";
        }
    }
isEmpty(): boolean {
    return super.isEmpty() && this.firstName === "" && this.lastName === "" && this.address === "" && this.phoneNumber === "" && this.email === "";
}
isComplete(): boolean {
    return super.isComplete()
    && StaticValidatorService.stringNotEmpty(this.firstName)
    && ((this.classification === "Person" && StaticValidatorService.stringNotEmpty(this.lastName)) || (this.classification !== "Person"))
    && StaticValidatorService.validateEmail(this.email)
    && StaticValidatorService.validatePhoneNumber(this.phoneNumber)
    && this.address !== "";
}
isEqual(input: Controller): boolean {
    return super.isEqual(input)
    && this.firstName == input.firstName
    && this.lastName == input.lastName
    && this.address == input.address
    && this.phoneNumber == input.phoneNumber
    && this.email == input.email;
}
}

export class DataProtectionOfficer extends Entity implements LPLDataElement {
    firstName = "";
    lastName = "";
    address = "";
    phoneNumber = "";
    email = "";
    constructor (con? : DataProtectionOfficer) {
        super();
        if (con) {
            this.desc = new Array<Description>();
            con.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            con.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.address = con.address;
            this.authInfo = con.authInfo;
            this.classification = con.classification;
            this.email = con.email;
            this.firstName = con.firstName;
            this.lastName = con.lastName;
            this.name = con.name;
            this.phoneNumber = con.phoneNumber;
            this.type = con.type;
        }
    }
isEmpty(): boolean {
    return super.isEmpty() && this.firstName === "" && this.lastName === "" && this.address === "" && this.phoneNumber === "" && this.email === "";
}
isComplete(): boolean {
    return super.isComplete()
    && StaticValidatorService.stringNotEmpty(this.firstName)
    && ((this.classification === "Person" && StaticValidatorService.stringNotEmpty(this.lastName)) || (this.classification !== "Person"))
    && StaticValidatorService.validateEmail(this.email)
    && StaticValidatorService.validatePhoneNumber(this.phoneNumber)
    && this.address !== "";
}
isEqual(input: DataProtectionOfficer): boolean {
    return super.isEqual(input)
    && this.firstName == input.firstName
    && this.lastName == input.lastName
    && this.address == input.address
    && this.phoneNumber == input.phoneNumber
    && this.email == input.email;
}
}

export class DataRecipient extends Entity implements LPLDataElement {
    id = 0;
    required = false;
    pointOfAcceptance = "";
    thirdCountryTransfer = false;
    country = "";
    adequacyDecision = false;
    safeguardList = new Array<Safeguard>();
    constructor (dr? : DataRecipient) {
        super();
        if (dr) {
            this.id = dr.id;
            this.desc = new Array<Description>();
            dr.desc.forEach(d => {
                this.desc.push(new Description(d));
            });
            this.head = new Array<Header>();
            dr.head.forEach(h => {
                this.head.push(new Header(h));
            });
            this.required = dr.required;
            this.pointOfAcceptance = dr.pointOfAcceptance;
            this.authInfo = dr.authInfo;
            this.classification = dr.classification;
            this.thirdCountryTransfer = dr.thirdCountryTransfer;
            this.country = dr.country;
            this.adequacyDecision = dr.adequacyDecision;
            this.name = dr.name;
            this.type = dr.type;
            this.safeguardList = new Array<Safeguard>();
            dr.safeguardList.forEach(sg => {
                this.safeguardList.push(new Safeguard(sg));
            });
        } else {
            this.safeguardList.push(new Safeguard());
        }
    }
isEmpty(): boolean {
    return super.isEmpty() 
    && this.required === false
    && this.thirdCountryTransfer === false
    && this.country === ""
    && this.adequacyDecision === false
    && (this.safeguardList.length == 0 || this.safeguardList.every(sg => sg.isEmpty()));
}
isComplete(): boolean {
    var res = true;
    // if (this.thirdCountryTransfer) {
        if (this.safeguardList.length > 0) {
        //     res = false;
        // } else {
            res = this.safeguardList.every((s: Safeguard) => (s.isComplete() || s.isEmpty()));
        }
    // }
    return super.isComplete()
    && res
    && !(this.thirdCountryTransfer === true && this.country === "");
}
isEqual(input: DataRecipient): boolean {
    var res = true;
    if (this.safeguardList.length == input.safeguardList.length) {
        if (this.safeguardList.length > 0) {
            for (let index = 0; index < this.safeguardList.length; index++) {
                res = res && this.safeguardList[index].isEqual(input.safeguardList[index]);
            }
        }
    } else {
        if (!(this.safeguardList.every(e => e.isEmpty()) && input.safeguardList.every(e => e.isEmpty()))) {
            res = false;
        }
    }
    return super.isEqual(input)
    && this.required == input.required
    && this.thirdCountryTransfer == input.thirdCountryTransfer
    && this.country == input.country
    && this.adequacyDecision == input.adequacyDecision
    && res;
}
}

export class DateSource extends Entity {
    publicAvailable = false; 
}

export class NameOfData implements LPLDataElement {
    name = "";
    constructor (nod? : NameOfData) {
        if (nod) {
            this.name = nod.name;
        }
    }
isEmpty(): boolean {
    return this.name === "";
}
isComplete(): boolean {
    return this.name !== "";
}
isEqual(input: NameOfData): boolean {
    return this.name == input.name;
}
}

export class PseudonymizationMethodAttribute implements LPLDataElement {
    key = "";
    value = "";
    constructor (pma? : PseudonymizationMethodAttribute) {
        if (pma) {
            this.key = pma.key;
            this.value = pma.value;
        }
    }
isEmpty(): boolean {
    return this.key === ""
    && this.value === "";
}
isComplete(): boolean {
    return this.key !== ""
    && this.value !== "";
}
isEqual(input: PseudonymizationMethodAttribute): boolean {
    return this.key == input.key
    && this.value == input.value;
}
}

export class AnonymizationMethodAttribute implements LPLDataElement {
    key = "";
    value = "";
    constructor (ama? : AnonymizationMethodAttribute) {
        if (ama) {
            this.key = ama.key;
            this.value = ama.value;
        }
    }
isEmpty(): boolean {
    return this.key === ""
    && this.value === "";
}
isComplete(): boolean {
    return (StaticValidatorService.stringNotEmpty(this.key)
    && StaticValidatorService.stringNotEmpty(this.value)) || this.isEmpty();
}
isEqual(input: AnonymizationMethodAttribute): boolean {
    return this.key == input.key
    && this.value == input.value;
}
}

export class HierarchyEntity implements LPLDataElement{
    value = "";
    constructor (he? : HierarchyEntity) {
        if (he) {
            this.value = he.value;
        }
    }
isEmpty(): boolean {
    return this.value === "";
}
isComplete(): boolean {
    return StaticValidatorService.stringNotEmpty(this.value) || this.isEmpty();
}
isEqual(input: HierarchyEntity): boolean {
    return this.value == input.value;
}
}

export class PrivacyModelAttribute implements LPLDataElement {
    value = "";
    key = "";
    constructor (pma? : PrivacyModelAttribute) {
        if (pma) {
            this.value = pma.value;
            this.key = pma.key;
        }
    }
isEmpty(): boolean {
    return !StaticValidatorService.stringNotEmpty(this.value)
    && !StaticValidatorService.stringNotEmpty(this.key);
}
isComplete(): boolean {
    return StaticValidatorService.stringNotEmpty(this.value)
    && StaticValidatorService.stringNotEmpty(this.key);
}
isEqual(input: PrivacyModelAttribute): boolean {
    return this.value == input.value
    && this.key == input.key;
}
}

export class PurposeHierarchyElement implements LPLDataElement {
    superPurpose = "";
    subPurpose = "";
    constructor (phe? : PurposeHierarchyElement) {
        if (phe) {
            this.superPurpose = phe.superPurpose;
            this.subPurpose = phe.subPurpose;
        }
    }
    isEmpty(): boolean {
        return this.superPurpose === ""
        && this.subPurpose === "";
    }
    isComplete(): boolean {
        return this.superPurpose !== ""
        && this.subPurpose !== "";
    }
    isEqual(input: PurposeHierarchyElement): boolean {
        return this.superPurpose == input.superPurpose
        && this.subPurpose == input.subPurpose;
    }
}