import { Controller, Data, DataGroup, DataProtectionOfficer, DataRecipient, DataSubjectRight, DateSource, Icon, LodgeComplaint, Purpose, PurposeHierarchyElement } from "./objects";
import { Description, Header } from "./ui-element";

export class LayeredPrivacyPolicy {
    id?: number;
    parentId?: number | null;
    version = "1.0";
    name = "";
    lang = "en";
    privacyPolicyUri = "";
    iconList = new Array<Icon>();
    dataSource = new DateSource();
    completeDataList = new Array<Data>();
    completeDataGroupList = new Array<DataGroup>();
    completeDataRecipientList = new Array<DataRecipient>();
    purposeList = new Array<Purpose>();
    purposeHierarchy = new Array<PurposeHierarchyElement>();
    controllerList = [] as Controller[];
    dataProtectionOfficerList = new Array<DataProtectionOfficer>();
    dataSubjectRightList = new Array<DataSubjectRight>();
    lodgeComplaint = new LodgeComplaint();
    underlyingLayeredPrivacyPolicy = new Array<UnderlyingLayeredPrivacyPolicy>();
    head = new Array<Header>();
    desc = new Array<Description>();

    constructor (lpp? : LayeredPrivacyPolicy) {
        if (lpp) {
            // this.id = data.id;
            // this.DESC = new Array<Description>();
            // data.DESC.forEach(d => {
            //     this.DESC.push(new Description(d));
            // });
            // this.HEAD = new Array<Header>();
            // data.HEAD.forEach(h => {
            //     this.HEAD.push(new Header(h));
            // });
            // this.name = data.name;
            // this.required = data.required;
            // this.dataType = data.dataType;
            // this.privacyGroup = data.privacyGroup;
            // this.anonymizationMethod = new AnonymizationMethod(data.anonymizationMethod);
            // this.dataCategoryList = new Array<DataCategory>();
            // data.dataCategoryList.forEach(d => {
            //     this.dataCategoryList.push(new DataCategory(d));
            // });
            // this.dataGroupList = new Array<DataGroup>();
            // data.dataGroupList.forEach(d => {
            //     this.dataGroupList.push(new DataGroup(d));
            // });
        } else {
            this.completeDataList.push(new Data());
        }
    }
}

export class UnderlyingLayeredPrivacyPolicy {
    layeredPrivacyPolicy = new LayeredPrivacyPolicy;
}