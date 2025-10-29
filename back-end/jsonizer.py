def convertPolicyToJSON(policy):
    policy.pop("completeDataList")
    policy.pop("completeDataGroupList")
    policy.pop("completeDataRecipientList")

    purposeCategories = ["accountManagement", "communicationManagement", "customerManagement", "enforceSecurity", "humanResourceManagement", "legalCompliance", "marketing", "organisationGovernance", "personalisation", "recordManagement", "researchAndDevelopment", "serviceProvision", "vendorManagement", "other"]
    completePurposeHierarchy = policy["purposeHierarchy"]
    subPurposeHierarchy = []
    for ph in completePurposeHierarchy:
        if purposeCategories.__contains__(ph["superPurpose"]) == False:
            subPurposeHierarchy.append(ph)
    
    for purpose in policy["purposeList"]:
        # improve ellegance + what about data recipients?
        subPurpose = False
        for ph in subPurposeHierarchy:
            if ph["subPurpose"] == purpose["name"]:
                subPurpose = True
                break
        if subPurpose == False:
            topPurpose = purpose["name"]
        else:
            topPurpose = purpose["name"]
            while subPurpose:
                for ph in subPurposeHierarchy:
                    if ph["subPurpose"] == topPurpose:
                        topPurpose = ph["superPurpose"]
                        subPurpose = True
                        break
                    subPurpose = False 
        for data in purpose["dataList"]:
            data["name"] = data["name"] + "_" + topPurpose
        for dataRecipient in purpose["dataRecipientList"]:
            dataRecipient["name"] = dataRecipient["name"] + "_" + topPurpose
        for privacyModel in purpose["privacyModelList"]:
            for data in privacyModel["nameOfDataList"]:
                data["name"] = data["name"] + "_" + topPurpose
        for pseudo in purpose["pseudonymizationMethodList"]:
            for data in pseudo["nameOfDataList"]:
                data["name"] = data["name"] + "_" + topPurpose
    return policy