import { AnonymizationMethodAttribute, AutomatedDecisionMaking, Controller, Data, DataCategory, DataProtectionOfficer, DataRecipient, DataSubjectRight, HierarchyEntity, Icon, LegalBasis, NameOfData, PrivacyModel, PrivacyModelAttribute, PseudonymizationMethod, PseudonymizationMethodAttribute, Purpose, Safeguard } from "./objects";

export class IconList {
    icon = new Array<Icon>();
}

export class PurposesList {
    purpose = new Array<Purpose>();
}

export class PseudonymizationMethodList {
    pseudonymizationMethod = new Array<PseudonymizationMethod>();
}

export class NameOfDataList {
    nameOfData = new Array<NameOfData>();
}

export class PseudonymizationMethodAttributeList {
    pseudonymizationMethodAttribute = new Array<PseudonymizationMethodAttribute>();
}

export class AutomatedDecisionMakingList {
    automatedDecisionMaking = new Array<AutomatedDecisionMaking>();
}

export class PrivacyModelList {
    privacyModel = new Array<PrivacyModel>();
}

export class DataList {
    data = new Array<Data>();
}

export class DataSubjectRightList {
    dataSubjectRight = new Array<DataSubjectRight>();
}

export class DataRecipientList {
    dataRecipient = new Array<DataRecipient>();
}

export class SafeguardList {
    safeguard = new Array<Safeguard>();
}

export class ControllerList {
    controller = new Array<Controller>();
}

export class LegalBasisList {
    legalBasis = new Array<LegalBasis>();
}

export class DataProtectionOfficerList {
    dataProtectionOfficer = new Array<DataProtectionOfficer>();
}

export class DataCategoryList {
    dataCategory = new Array<DataCategory>();
}

export class AnonymizationMethodAttributeList {
    anonymizationMethodAttribute = new AnonymizationMethodAttribute();
}

export class HierarchyEntityList {
    hierarchyEntity = new Array<HierarchyEntity>()
}

export class PrivacyModelAttributeList {
    privacyModelAttribute = new Array<PrivacyModelAttribute>();
}