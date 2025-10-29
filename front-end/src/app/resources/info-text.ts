export class InfoText {
    info = 
        ["<b>The following information should be entered:</b>", 
        "<i> Policy Information:</i>",
        "- the default language used in the privacy policy",
        "- the name of the service for which the privacy policy is created",
        "- policy URI (optional): a link to a full-text privacy policy",
        "<i>UI-Representation:</i>",
        "- at least one title and its corresponding language",
        "- at least one description and its corresponding language"];

    // policyIcons  = 
    //     ["Icons representing the privacy policy should be selected"];   

    controllerList =
        ["A data controller is the person, company or other legal entity that is in charge of how personal data is used.",
        "Several data controllers may share their responsibility in the context of a single privacy policy.",
        "Here you are required to enter the following information:",
        "<i>Controller Information:</i>",
        "- (first) name of the controller",
        "- lastname (when the controller is a person)",
        "- phone number",
        "- email address",
        "- address",
        "<i>Internal Information:</i>",
        "- a unique name (used internally to reference this controller)",
        "- authentication data (optional, reserved for future PriPoCoG features)",
        "- classification of the controller (person, legal entity or public authority)",
        "<i>UI-Representation:</i>",
        "- at least one title and its corresponding language",
        "- at least one description and its corresponding language",
        "You can add new controllers using the \"+\"-button at the bottom of the page."];  
 
    // desc = 
    //     ["A readable description of the privacy policy created should be provided. The language used for the description should be selected."];    
    
    dataProtectionOfficer =
        ["In some cases you are required to specify a data protection officer (DPO) that is responsible for the cooperation with supervisory authorities.",
        "The DPO is also responsible for responding to requests by the data subjects, as well as ensuring compliance with data protection legislation.",
        "Several DPOs may share their responsibility in the context of a single privacy policy.",
        "Here you are required to enter the following information:",
        "<i>Data Protection Officer Information:</i>",
        "- (first) name of the DPO",
        "- lastname (when the DPO is a person)",
        "- phone number",
        "- email address",
        "- address",
        "<i>Internal Information:</i>",
        "- a unique name (used internally to reference this DPO)",
        "- authentication data (optional, reserved for future PriPoCoG features)",
        "- classification of the DPO (person, legal entity or public authority)",
        "<i>UI-Representation:</i>",
        "- at least one title and its corresponding language",
        "- at least one description and its corresponding language",
        "You can add new DPOs using the \"+\"-button at the bottom of the page."];      
    
    dataSubjectRight =
        ["Select the rights that you grant to your data subjects.",
        "You can also edit the given titles and descriptions off the given rights, as well as add additional titles and descriptions in further languages."];
    
    lodgeComplaint =
        ["Specidy the competent supervisory authority to which the data subjects may lodge a complaint.",
        "You have to provide:",
        "- name of the supervisory authority",
        "<i>UI-Representation:</i>",
        "- at least one title and its corresponding language",
        "- at least one description and its corresponding language"]; 

    dataList =
        ["Here you specify which kinds of data the service collects/stores/processes.",
        "<b>Data</b>",
        "You have to provide the following information:",
        "<i>Basic Information:</i>",
        "- a unique name (used internally to reference this data element)",
        "- at least one data category that fits the data best",
        "- the data type",
        "- the data sensitivity (explicit, quasi-identifier (QID), sensitive, non-sensitive)",
        "- whether the data subject is required to provide this data (no opt-out allowed)",
        "- an anonymization method (optional)",
        "<i>UI-Representation:</i>",
        "- at least one title and its corresponding language",
        "- at least one description and its corresponding language",
        "- optionally, one or more data groups clustering the data",
        "You can add further data elements using the \"+\"-button at the bottom of the page."];

    anonymizationMethod = [
        "<b>Anonymization Method (optional)</b>",
        "TODO"
    ];

    dataGroups = [
        "<b>Data Groups (optional)</b>",
        "TODO"
    ];

    purpose =
        ["Define purposes for which you are collecting/storing/processing data.",
        "You have to provide:",
        "<i>Baisc Information:</i>",
        "- a unique name for each purpose",
        "- whether the purpose must be accepted by the user (<b>required</b>)",
        "- whether the purpose is accepted by default, but can be opted out of (<b>optOut</b>)",
        "<i>UI-Representation:</i>",
        "- at least one title and its corresponding language",
        "- at least one description and its corresponding language",
        "You can add new purposes using the \"+\"-button at the bottom of the page.",
        "After the entered information is saved, you may further edit the purposes in the purposes tab on the main page."];

    purposeHierarchy =
        ["Using Drag-and-Drop move the purposes you defined into one of the existing categories.",
        "You can also arrange the purposes you have defined hierarchically among each other.",
        "You may not move the purposes to the top level of the hierarchy (between the given purposes)."];

    datum =
        ["Select the data that are collected/stored/processed for this purpose.",
        "The data shown are defined in the \"Main-Information\"-tab."];

    dataRecipient =
        ["Select the data recipients that are collecting/storing/processing data for this purpose.",
        "The data recipients shown are defined in the \"Main-Information\"-tab."];

    dataRecipientList =
        ["Define data recipients that may collect/store/process some data.",
        "You have to provide:",
        "<i>Recipient Information:</i>",
        "- whether the data recipient must be accepted by the user (<b>required</b>)",
        "- whether the data recipient resides outside the European Union (<b>third country transfer</b>)",
        "<i>when a third country transfer takes place:</i>",
        "<i>&nbsp;&nbsp;&nbsp;&nbsp;- the country in which the data recipient resides</i>",
        "<i>&nbsp;&nbsp;&nbsp;&nbsp;- whether this country falls under an adequacy decision of the European Comission (<b>adequacy decision</b>)</i>",
        "- safeguard(s) (optional) see below for further details",
        "<i>Internal Information:</i>",
        "- a unique name (used internally to reference this DPO)",
        "- authentication data (optional, reserved for future PriPoCoG features)",
        "- classification of the DPO (person, legal entity or public authority)",
        "<i>UI-Representation:</i>",
        "- at least one title and its corresponding language",
        "- at least one description and its corresponding language",
        "You can add new data recipients using the \"+\"-button at the bottom of the page."
    ];

    safeguards =
        ["<b>Safeguards (optional)</b>",
        "TODO"
    ];

    retention =
        ["Describes when the data of this purpose will be deleted.",
        "The following information has to be provided:",
        "- type (after purpose, fixed date, indefinite)",
        "<i>UI-Representation:</i>",
        "- at least one title and its corresponding language",
        "- at least one description and its corresponding language",
        "",
        "<b>Additionally:</b>",
        "For type <i>after purpose</i>:",
        "- the duration in years, months, and days for which the data will be stored after the purpose has ended",
        "For type <i>fixed date</i>:",
        "- the date on which the data will be deleted",
    ];

    privacyModelList = 
        ["Here you can describe which privacy models (e.g., k-anonymity) you apply in the context of this purpose.",
        "You can select a subset of the data collected/stored/processed in this purpose.",
        "The following information has to be specified:",
        "<i>Model Information:</i>",
        "- name of the privacy model",
        "- at least one datum, which is used in the privacy model",
        "- privacy model attributes can be specified (e.g., a value for k in k-anonymity",
        "<i>UI-Representation:</i>",
        "- at least one title and its corresponding language",
        "- at least one description and its corresponding language",
        "You can add multiple privacy models using the \"+\"-button at the bottom of the page."];

    automatedDecisionMakingList = 
        ["Describe any form of automated decision-making in the context of this purpose.",
        "You should provide the following information:",
        "- name",
        "<i>UI-Representation:</i>",
        "- at least one title and its corresponding language",
        "- at least one description and its corresponding language",
        "You can add more automated decision-making by using the \"+\"-button at the bottom of the page."];

    pseudonymizationMethodList =
        ["Describes the pseudonymization method(s) applied to a subset of the data of this purpose.",
        "You have to provide the following information:",
        "<i>Pseudonymization Information:</i>",
        "- name",
        "- the resulting attribute",
        "- at least one datum, which is used to generate the resulting attribute",
        "- pseudonymization method attribute(s) can be specified as key and value pairs",
        "Pseudonymization method attributes contain information about the configuration of the pseudonymization method.",
        "<i>UI-Representation:</i>",
        "- at least one title and its corresponding language",
        "- at least one description and its corresponding language",
        "You can add multiple pseudonymization methods using the \"+\"-button at the bottom of the page."];

    legalBasisList = 
        ["Select on which legal bases the collection/storing/processing of data for this purpose is based.",
        "Select one or more legal bases and add at least one title and description for each selected legal basis."];    
    
        getText(label: string): string[] {
        var res: string[] = [];
        switch (label) {
            case "info":
                res = this.info;
                break;
            case "policyIcons":
                // res = this.policyIcons;
                console.debug("Error: policyIcons Info deleted");
                break;
            case "controllerList":
                res = this.controllerList;
                break;    
            case "desc":
                // res = this.desc;
                console.debug("Error: desc Info deleted");
                break;
            case "dataProtectionOfficer":
                res = this.dataProtectionOfficer;
                break; 
            case "dataSubjectRight":
                res = this.dataSubjectRight;
                break;   
            case "lodgeComplaint":
                res = this.lodgeComplaint;
                break;
            case "purpose":
                res = this.purpose;
                break;  
            case "purposeHierarchy":
                res = this.purposeHierarchy;
                break;
            case "dataList":
                res = this.dataList.concat([""]).concat(this.anonymizationMethod).concat([""]).concat(this.dataGroups);
                break; 
            case "anonymizationMethod":
                res = this.anonymizationMethod;
                break;
            case "dataGroups":
                res = this.dataGroups;
                break;
            case "datum":
                res = this.datum;
                break;  
            case "dataRecipient":
                    res = this.dataRecipient;
                    break;
            case "safeguards":
                    res = this.safeguards;
                    break;
            case "dataRecipientList":
                res = this.dataRecipientList.concat([""]).concat(this.safeguards);
                break;
            case "legalBasisList":
                res = this.legalBasisList;
                break;
            case "pseudonymizationMethodList":
                res = this.pseudonymizationMethodList;
                break;  
            case "retention":
                res = this.retention;
                break; 
            case "automatedDecisionMakingList":
                res = this.automatedDecisionMakingList;
                break;  
            case "privacyModelList":
                res = this.privacyModelList;
                break;
            default:
                break;
        }
        return res;
    }
}