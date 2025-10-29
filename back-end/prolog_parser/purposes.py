from aux_func import get_head_prolog, get_desc_prolog
from prolog_parser.purposeElements.adm import get_adm_item
from prolog_parser.purposeElements.data_recipient import get_dr
from prolog_parser.purposeElements.legalBasis import get_legal_basis
from prolog_parser.purposeElements.pnMethod import get_pn_Method
from prolog_parser.purposeElements.privacyModel import get_pm_item
from prolog_parser.purposeElements.retention import get_retention_item
from prolog_parser.purposeElements.dataGroup import get_dataGroup
from prolog_parser.purposeElements.dataCategory import get_dataCategory
from prolog_parser.purposeElements.am import get_am
from prolog_parser.purposeElements.safeguard import get_sfg

def createPurposesData(obj, dataObj, purposeId, retentionId, legalBasisId, admId, drId, sfgId, pmId, nOdPrivacyModelId, attributePrivacyModelId, attributePNId, pnId, allNameOfDataList):
    res = ''

    allRetention = '\n'
    allLegalBasis = '\n'
    allADM = ''
    allDR = '\n'
    allSafeguard = ""
    allPM = '\n'
    allPN = '\n'
    allNameOfData = '\n'
    allPMAttribute = ''
    allPNAttribute = ''
    puproseIdMapping = []

    for p in obj:
        name = p['name']
        head = p['head']
        desc = p['desc']

        optOut = str(p['optOut']).lower()
        required = str(p['required']).lower()

        admIdList = '['

        dataRecipientList = p['dataRecipientList']
        drIdList = '['
        if len(dataRecipientList) == 0:
            drIdList = drIdList + ']'
        else:
            for drItem in dataRecipientList:
                drObj = get_dr(drItem, drId, sfgId)
                allSafeguard = allSafeguard + drObj[1]
                sfgId = sfgId + 1
                allDR = allDR + drObj[0] + '\n'
                drIdList = drIdList + 'dr' + str(drId) + ','
                drId = drId + 1
            drIdList = drIdList[:-1] + ']'

        dataList = p['dataList']
        dataIds = '['
        if len(dataList) == 0:
            dataIds = dataIds + ']'
        else:
            for data in dataList:
                for d in dataObj:
                    if data['name'] == d[2]:
                        dataIds = dataIds + d[1] + ','
            dataIds = dataIds[:-1] + ']'

        retention = p['retention']
        retentionItem = get_retention_item(retention, retentionId)
        allRetention = allRetention + retentionItem + '\n'
        rId = 'r' + str(retentionId)
        retentionId = retentionId + 1

        legalBasisList = p['legalBasisList']
        lbId = '['
        if len(legalBasisList) == 0:
            lbId = lbId + ']'
        else:
            for lbEl in legalBasisList:
                lbItem = get_legal_basis(lbEl, legalBasisId)
                allLegalBasis = allLegalBasis + lbItem + '\n'
                lbId = lbId + 'lb' + str(legalBasisId) + ','
                legalBasisId = legalBasisId + 1
            lbId = lbId[:-1] + ']'

        automatedDecisionMakingList = p['automatedDecisionMakingList']
        if len(automatedDecisionMakingList) == 0:
            allADM = '[]'
        else:
            allADM = "["
            for item in automatedDecisionMakingList:
                admItem = get_adm_item(item, admId)
                allADM = allADM + admItem
                admIdList = admIdList + 'adm' + str(admId) + ','
                admId = admId + 1
            allADM = allADM[:-1] + "]"

        pmIdList = '['
        privacyModelList = p['privacyModelList']

        if len(privacyModelList) == 0:
            pmIdList = pmIdList + ']'
        else:
            for item in privacyModelList:
                pmRes = get_pm_item(item, pmId, nOdPrivacyModelId, attributePrivacyModelId, allNameOfDataList)
                pmItem = pmRes[0]
                allPM = allPM + pmItem + '\n'
                pmIdList = pmIdList + 'pm' + str(pmId) + ','
                pmId = pmId + 1
                allNameOfData = allNameOfData + pmRes[1]
                allPMAttribute = allPMAttribute + pmRes[2]
                nOdPrivacyModelId = pmRes[3]
                attributePrivacyModelId = pmRes[4]
                allNameOfDataList = pmRes[5]

            pmIdList = pmIdList[:-1] + ']'

        pseudonymizationMethodList = p['pseudonymizationMethodList']
        pnIdList = '['

        if len(pseudonymizationMethodList) == 0:
            pnIdList = pnIdList + ']'
        else:
            for item in pseudonymizationMethodList:
                pnRes = get_pn_Method(item, pnId, allNameOfDataList, nOdPrivacyModelId, attributePNId)
                pnItem = pnRes[0]
                allPN = allPN + pnItem + '\n'
                pnIdList = pnIdList + 'pn' + str(pnId) + ','
                pnId = pnId + 1
                allNameOfData = allNameOfData + pnRes[1]
                allPNAttribute = allPNAttribute + pnRes[2]
                nOdPrivacyModelId = pnRes[3]
                attributePNId = pnRes[4]
                allNameOfDataList = pnRes[5]

            pnIdList = pnIdList[:-1] + ']'

        header = get_head_prolog(head)
        description = get_desc_prolog(desc)

        item = 'purpose(p' + str(purposeId) + ',("' + \
               name + '",' + \
               optOut + ',' + \
               required + ',' + \
               '[],' + \
               header + ',' + description + \
               ',' + dataIds + \
               ',' + pmIdList + \
               ',' + pnIdList + \
               ',' + drIdList + \
               ',' + lbId + \
               ',' + allADM + \
               ',' + rId + \
               ')).'

        res = res + '\n' + item

        puproseIdMapping.append((name, purposeId))

        purposeId = purposeId + 1

    return (res, allRetention, allLegalBasis, allADM, allDR, allSafeguard, allPM, allNameOfData, allPMAttribute, allPNAttribute, allPN, puproseIdMapping, (purposeId, retentionId, legalBasisId, admId, drId, sfgId, pmId, nOdPrivacyModelId, attributePrivacyModelId, attributePNId, pnId), allNameOfDataList)

def createPurposesData_compatibility(obj, purposeId, retentionId, legalBasisId, admId, drId, sfgId, pmId, nOdPrivacyModelId, attributePrivacyModelId, attributePNId, pnId, allNameOfDataList):
    res = ''

    allRetention = ''
    allLegalBasis = ''
    allADM = ''
    allSafeguard = ""
    allPM = ''
    allPSM = ''
    allNameOfData = '\n'
    allPMAttribute = ''
    allPNAttribute = ''
    puproseIdMapping = []

    # data stuff
    dataId = 1

    dataCategoryId = 1
    dataGroupId = 1
    amId = 1

    dataCategoryIdList = '['
    dataGroupIdList = '['
    amIdList = ''

    dataCategoryList = '\n'
    dataGroupList = ''
    amList = ''
    heList = ''
    amAttributeList = '\n'

    dataCategoryName = []
    dataCategoryIds = []

    dataGroupName = []
    dataGroupIds = []

    amName = []
    dataName = []
    drName = []

    heId = 1
    amAttributeId = 1

    resData = []
    resDR = []
    resADM = []
    # end of data stuff

    for p in obj:
        name = p['name']
        head = p['head']
        desc = p['desc']

        pointOfAcceptance = p['pointOfAcceptance']
        if(pointOfAcceptance == ""):
            pointOfAcceptance = "[]"

        optOut = str(p['optOut']).lower()
        required = str(p['required']).lower()

        admIdList = '['

        dataRecipientList = p['dataRecipientList']
        drIdList = '['
        if len(dataRecipientList) == 0:
            drIdList = drIdList + ']'
        else:
            for drItem in dataRecipientList:
                # updating dataRecipient list
                dRName = drItem['name']

                if not dRName in drName:
                    drName.append(dRName)

                    authInfoDR = drItem['authInfo']
                    classificationDR = drItem['classification']
                    typeDR = drItem['type']

                    requiredDR = str(drItem['required']).lower()
                    pointOfAcceptanceDR = drItem['pointOfAcceptance']
                    if(pointOfAcceptanceDR == ""):
                        pointOfAcceptanceDR = "[]"
                    thirdCountryTransferDR = str(drItem['thirdCountryTransfer']).lower()
                    countryDR = drItem['country']
                    adequacyDecisionDR = str(drItem['adequacyDecision']).lower()

                    headDR = drItem['head']
                    descDR = drItem['desc']

                    headerDR = get_head_prolog(headDR)
                    descriptionDR = get_desc_prolog(descDR)

                    sfgListDR = '['
                    safeguardListDR = drItem['safeguardList']
                    sfgListDR = sfgListDR + get_sfg(safeguardListDR) + ']'

                    item = ('dataRecipient(dr' + str(drId) + ',("' + \
                        dRName + '","' + \
                        classificationDR + '","' + \
                        authInfoDR + '","' + \
                        typeDR + '",' + \
                        requiredDR + ',' + \
                        pointOfAcceptanceDR + ',' + \
                        thirdCountryTransferDR + ',"' + \
                        countryDR + '",' + \
                        adequacyDecisionDR + ',' + \
                        headerDR + ',' + descriptionDR + ',' + \
                        sfgListDR + ')).\n','dr' + str(drId), dRName)
                    drId = drId + 1
                    allSafeguard = allSafeguard + sfgListDR

                    resDR.append(item)
                # end of updating dataRecipient list
                for dr in resDR:
                    if drItem['name'] == dr[2]:
                        drIdList = drIdList + dr[1] + ','
            drIdList = drIdList[:-1] + ']'

        dataList = p['dataList']

        dataIds = '['
        if len(dataList) == 0:
            dataIds = dataIds + ']'
        else:
            for data in dataList:
                
                # updating data list
                dName = data['name']

                if not dName in dataName:
                    dataName.append(dName)

                    dRequired = str(data['required']).lower()
                    pointOfAcceptanceD = data['pointOfAcceptance']
                    if(pointOfAcceptanceD == ""):
                        pointOfAcceptanceD = "[]"
                    dataType = data['dataType']
                    privacyGroup = data['privacyGroup']
                    dHead = data['head']
                    dDesc = data['desc']

                    dHeader = get_head_prolog(dHead)
                    dDescription = get_desc_prolog(dDesc)

                    dataGroupPList = data['dataGroupList']
                    if len(dataGroupPList) == 0:
                        dataGroupIdList = dataGroupIdList + ']'
                    else:
                        for dgItem in dataGroupPList:
                            newList = ''
                            dgObj = get_dataGroup(dgItem, dataGroupId)

                            if not dgItem['name'] in dataGroupName:
                                dataGroupName.append(dgItem['name'])
                                dataGroupIds.append(dataGroupId)
                                newList = newList + 'dg' + str(dataGroupId) + ','
                                dataGroupIdList = dataGroupIdList + newList
                                dataGroupList = dataGroupList + dgObj
                                dataGroupId = dataGroupId + 1
                            else:
                                index = dataGroupName.index(dgItem['name'])
                                newList = newList + 'dg' + str(dataGroupIds[index]) + ','
                                dataGroupIdList = dataGroupIdList + newList

                        dataGroupIdList = dataGroupIdList[:-1] + ']'

                    dataCategoryPList = data['dataCategoryList']
                    if len(dataCategoryPList) == 0:
                        dataCategoryIdList = dataCategoryIdList + ']'
                    else:
                        for dgItem in dataCategoryPList:
                            newList = ''
                            dgObj = get_dataCategory(dgItem, dataCategoryId)[0]
                            catName = get_dataCategory(dgItem, dataCategoryId)[1]

                            if not dgItem['name'] in dataCategoryName:
                                dataCategoryName.append(dgItem['name'])
                                dataCategoryIds.append(dataCategoryId)
                                dataCategoryIdList = dataCategoryIdList + catName + ','
                                dataCategoryList = dataCategoryList + dgObj
                                dataCategoryId = dataCategoryId + 1
                            else:
                                dataCategoryIdList = dataCategoryIdList + catName + ','

                        dataCategoryIdList = dataCategoryIdList[:-1] + ']'

                    amItem = data['anonymizationMethod']
                    amObj = get_am(amItem, amId, heId, amAttributeId)
                    amList = amList + amObj[0]
                    if amObj[0] == "":
                        amIdList = '[]'
                    else:
                        amIdList = amIdList + 'am' + str(amId)
                        amId = amId + 1
                        heList = heList + amObj[1]
                        amAttributeList = amAttributeList + amObj[3]
                        heId = amObj[2]
                        amAttributeId = amObj[4]

                    item = ('datum(dt' + str(dataId) + ',(' + \
                            '"' + dName + '",' + \
                            '"' + dataType + '",' + \
                            dRequired + ',' + \
                            pointOfAcceptanceD + ',' + \
                            '"' + privacyGroup + '",' + \
                            dataCategoryIdList + ',' + \
                            dataGroupIdList + ',' + \
                            amIdList + ',' + \
                        dHeader + ',' + dDescription + ')).\n', 'dt' + str(dataId), dName)
                    dataId = dataId + 1

                    resData.append(item)
                    dataCategoryIdList = '['
                    dataGroupIdList = '['
                    amIdList = ''
                # end of updating data list

                for d in resData:
                    if data['name'] == d[2]:
                        dataIds = dataIds + d[1] + ','
            dataIds = dataIds[:-1] + ']'

        retention = p['retention']
        retentionItem = get_retention_item(retention, retentionId)
        allRetention = allRetention + retentionItem
        rId = 'r' + str(retentionId)
        retentionId = retentionId + 1

        legalBasisList = p['legalBasisList']
        lbId = '['
        if len(legalBasisList) == 0:
            lbId = lbId + ']'
        else:
            for lbEl in legalBasisList:
                lbItem = get_legal_basis(lbEl, legalBasisId)
                allLegalBasis = allLegalBasis + lbItem
                lbId = lbId + 'lb' + str(legalBasisId) + ','
                legalBasisId = legalBasisId + 1
            lbId = lbId[:-1] + ']'

        automatedDecisionMakingList = p['automatedDecisionMakingList']
        if len(automatedDecisionMakingList) == 0:
            admIdList = "[]"
        else:
            for item in automatedDecisionMakingList:
                admItem = get_adm_item(item, admId)
                resADM.append(admItem)
                admIdList = admIdList + 'adm' + str(admId) + ','
                admId = admId + 1
            admIdList = admIdList[:-1] + "]"

        pmIdList = '['
        privacyModelList = p['privacyModelList']

        if len(privacyModelList) == 0:
            pmIdList = pmIdList + ']'
        else:
            for item in privacyModelList:
                pmRes = get_pm_item(item, pmId, nOdPrivacyModelId, attributePrivacyModelId, allNameOfDataList)
                pmItem = pmRes[0]
                allPM = allPM + pmItem
                pmIdList = pmIdList + 'pm' + str(pmId) + ','
                pmId = pmId + 1
                allNameOfData = allNameOfData + pmRes[1]
                allPMAttribute = allPMAttribute + pmRes[2]
                nOdPrivacyModelId = pmRes[3]
                attributePrivacyModelId = pmRes[4]
                allNameOfDataList = pmRes[5]

            pmIdList = pmIdList[:-1] + ']'

        pseudonymizationMethodList = p['pseudonymizationMethodList']
        pnIdList = '['

        if len(pseudonymizationMethodList) == 0:
            pnIdList = pnIdList + ']'
        else:
            for item in pseudonymizationMethodList:
                pnRes = get_pn_Method(item, pnId, allNameOfDataList, nOdPrivacyModelId, attributePNId)
                pnItem = pnRes[0]
                allPSM = allPSM + pnItem
                pnIdList = pnIdList + 'pn' + str(pnId) + ','
                pnId = pnId + 1
                allNameOfData = allNameOfData + pnRes[1]
                allPNAttribute = allPNAttribute + pnRes[2]
                nOdPrivacyModelId = pnRes[3]
                attributePNId = pnRes[4]
                allNameOfDataList = pnRes[5]

            pnIdList = pnIdList[:-1] + ']'

        header = get_head_prolog(head)
        description = get_desc_prolog(desc)

        item = 'purpose(p' + str(purposeId) + ',("' + \
               name + '",' + \
               optOut + ',' + \
               required + ',' + \
               pointOfAcceptance + ',' + \
               header + ',' + description + \
               ',' + dataIds + \
               ',' + pmIdList + \
               ',' + pnIdList + \
               ',' + drIdList + \
               ',' + lbId + \
               ',' + admIdList + \
               ',' + rId + \
               ')).\n'

        res = res + item

        puproseIdMapping.append((name, purposeId))

        purposeId = purposeId + 1
    allDR = ''
    for dr in resDR:
        allDR = allDR + dr[0]
    allData = ''
    for d in resData:
        allData = allData + d[0]
    for a in resADM:
        allADM = allADM + a
    return (res, allRetention, allLegalBasis, allADM, allDR, allSafeguard, allPM, allNameOfData, allPMAttribute, allPNAttribute, allPSM, puproseIdMapping, (purposeId, retentionId, legalBasisId, admId, drId, sfgId, pmId, nOdPrivacyModelId, attributePrivacyModelId, attributePNId, pnId), allNameOfDataList, allData, dataGroupList, amList)