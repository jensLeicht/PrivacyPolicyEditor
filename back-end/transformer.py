from create_objects.purpose_sup_obj.data_recipient_list import create_data_recipient_list, create_data_recipient_list_from_dfd
from prolog_parser.purposeHierarchy import createPurposeHierarchy
from create_objects.purpose_hierarchy import create_purpose_hierarchy
from json2xml import json2xml
from bs4 import BeautifulSoup
from aux_func import get_Desc, get_underlying_lpps_list
from aux_func import get_Headers
from create_objects.data_source import create_data_source_obj
from create_objects.lodge_complaint import create_lodge_complaint_obj
from create_objects.icon_list import create_icon_list
from create_objects.purpose_list import create_purpose_list, create_purpose_list_from_dfd
from create_objects.data_subject_rights import create_data_sub_right_list
from create_objects.controller import create_controller_list
from create_objects.data_protection_officer import create_data_protection_officer_list
from prolog_parser.basic_info import createBasicPart
from prolog_parser.controller import createControllerPart
from prolog_parser.dpo import createDPOPart
from prolog_parser.dsr import createDSRPart
from prolog_parser.icons import createIconsPart
from prolog_parser.lodgeComplaint import createLodgeComplaintPart
from prolog_parser.purposeElements.data import get_data
from prolog_parser.purposes import createPurposesData, createPurposesData_compatibility
from create_objects.purpose_sup_obj.data_list import create_data_list, create_data_list_from_dfd
from create_objects.purpose_sup_obj.data_group_list import create_data_group_list, create_data_group_list_from_dfd


def transform_json2xml(json_obj):
    return(json2xml.Json2xml(json_obj, wrapper="root", item_wrap=True, pretty=True, attr_type=False).to_xml())

def transform_dfd2json(xml_obj, pars):
    if not pars:
        xml_parser = BeautifulSoup(xml_obj, 'xml')
    else:
        xml_parser = xml_obj
    
    name = ''
    desc = ''
    
    trustBoundaries = xml_parser.findAll('trustBoundaries')
    for boundary in trustBoundaries:
        if boundary.get('dataController') == 'true':
            name = boundary.get('name')
            desc = boundary.get('description')
    
    lang = 'en'

    head = [{
            'lang': 'en',
            'value': name
    }]
    desc = [{
        'lang': 'en',
        'value': desc
    }]

    dataGroupListXML = xml_parser.findAll('dataFlows')
    dataGroupList = create_data_group_list_from_dfd(dataGroupListXML)

    dataListXML = xml_parser.findAll('data')
    dataList = create_data_list_from_dfd(dataListXML, dataGroupList)

    dataRecipientListXML = xml_parser.findAll('actors')
    dataRecipientList = create_data_recipient_list_from_dfd(dataRecipientListXML)

    purposeListXML = xml_parser.findAll('processes')
    purposeList = create_purpose_list_from_dfd(purposeListXML)

#TODO from here on

    # dataSubjectRightListXML = xml_parser.find('dataSubjectRightList')
    # dataSubjectRightList = create_data_sub_right_list(dataSubjectRightListXML)

    controllerList = []

    # dataProtectionOfficerListXML = xml_parser.find('dataProtectionOfficerList')
    dataProtectionOfficerList = []
    # dataProtectionOfficerList = create_data_protection_officer_list(dataProtectionOfficerListXML)

    underlyingPolicy = []

    root = {
        'version': '',
        'name': name,
        'lang': lang,
        'privacyPolicyUri': '',
        'iconList': '',
        'dataSource': '',
        'completeDataList': dataList,
        'completeDataGroupList': dataGroupList,
        'completeDataRecipientList': dataRecipientList,
        'purposeList': purposeList,
        'purposeHierarchy': [],
        'controllerList': controllerList,
        'dataProtectionOfficerList': dataProtectionOfficerList,
        'dataSubjectRightList': '', #dataSubjectRightList,
        'lodgeComplaint': '', #lodgeComplaint,
        'head': head,
        'desc': desc,
        'underlyingLayeredPrivacyPolicy': underlyingPolicy
    }
    return root

def transform_xml2json(xml_obj, pars):
    if not pars:
        xml_parser = BeautifulSoup(xml_obj, 'xml')
    else:
        xml_parser = xml_obj
    
    xml_parser = xml_parser.find('root')

    version = xml_parser.find('version').getText()
    name = xml_parser.find('name').getText()
    lang = xml_parser.find('lang').getText()
    privacyPolicyUri = xml_parser.find('privacyPolicyUri').getText()

    headers = xml_parser.find('head', recursive=False)
    head = get_Headers(headers)
    descriptions = xml_parser.find('desc', recursive=False)
    desc = get_Desc(descriptions)

    dataSourceXML = xml_parser.find('dataSource')
    dataSource = create_data_source_obj(dataSourceXML)

    lodgeComplaintXML = xml_parser.find('lodgeComplaint')
    lodgeComplaint = create_lodge_complaint_obj(lodgeComplaintXML)

    iconListXML = xml_parser.find('iconList')
    iconList = create_icon_list(iconListXML)

    dataListXML = xml_parser.find('completeDataList')
    dataList = create_data_list(dataListXML)

    dataGroupListXML = xml_parser.find('completeDataGroupList')
    dataGroupList = create_data_group_list(dataGroupListXML)

    dataRecipientListXML = xml_parser.find('completeDataRecipientList')
    dataRecipientList = create_data_recipient_list(dataRecipientListXML)

    purposeListXML = xml_parser.find('purposeList')
    purposeList = create_purpose_list(purposeListXML)

    purposeHierarchyXML = xml_parser.find('purposeHierarchy')
    purposeHierarchy = create_purpose_hierarchy(purposeHierarchyXML)

    dataSubjectRightListXML = xml_parser.find('dataSubjectRightList')
    dataSubjectRightList = create_data_sub_right_list(dataSubjectRightListXML)

    controllerListXML = xml_parser.find('controllerList')
    controllerList = create_controller_list(controllerListXML)

    dataProtectionOfficerListXML = xml_parser.find('dataProtectionOfficerList')
    dataProtectionOfficerList = create_data_protection_officer_list(dataProtectionOfficerListXML)

    layeredPrivacyPolicyListXML = xml_parser.find('underlyingLayeredPrivacyPolicy')
    layeredPrivacyPolicyXML = layeredPrivacyPolicyListXML.findAll('layeredPrivacyPolicy', recursive=False)
    underlyingPolicy = []
    for lpp in layeredPrivacyPolicyXML:
        layeredPrivacyPolicy = transform_xml2json(lpp, True)
        underlyingLppObj = {
            'layeredPrivacyPolicy': layeredPrivacyPolicy
        }
        underlyingPolicy.append(underlyingLppObj)

    root = {
        'version': version,
        'name': name,
        'lang': lang,
        'privacyPolicyUri': privacyPolicyUri,
        'iconList': iconList,
        'dataSource': dataSource,
        'completeDataList': dataList,
        'completeDataGroupList': dataGroupList,
        'completeDataRecipientList': dataRecipientList,
        'purposeList': purposeList,
        'purposeHierarchy': purposeHierarchy,
        'controllerList': controllerList,
        'dataProtectionOfficerList': dataProtectionOfficerList,
        'dataSubjectRightList': dataSubjectRightList,
        'lodgeComplaint': lodgeComplaint,
        'head': head,
        'desc': desc,
        'underlyingLayeredPrivacyPolicy': underlyingPolicy
    }
    return root

def transform_json2prolog(input):
    # json_obj = input['list']

    # allDataRawList = input['allData']
    allDataRawList = input['completeDataList']
    dataObj = get_data(allDataRawList)
    allAM = dataObj[2]
    allDataGroups = dataObj[5]
    allData = '\n'
    for d in dataObj[0]:
        allData = allData + d[0] + '\n'

    res = ''

    # iconIdMapping = []
    # iconId = 1
    # icon = ''
    # i = createIconsPart(input['iconList'], iconId)
    # iconIdMapping.append((0, iconId))
    # iconId = iconId + 1
    # icon = icon + i + '\n' + '\n'

    dsrIdMapping = []
    dscId = 1
    dsr = ""
    i = createDSRPart(input['dataSubjectRightList'], dscId)
    dsrIdMapping.append((0, dscId))
    dscId = dscId + 1
    dsr = dsr + i + '\n' + '\n'

    lodgeComplaintIdMapping = []
    lcId = 1
    lc = ""
    i = createLodgeComplaintPart(input['lodgeComplaint'], lcId)
    lodgeComplaintIdMapping.append((0, lcId))
    lcId = lcId + 1
    lc = lc + i + '\n' + '\n'

    controllerIdMapping = []
    controllers = ''
    cId = 1
    obj = createControllerPart(input['controllerList'], cId)
    c = obj[0]
    controllerIdMapping = controllerIdMapping + obj[1]
    controllers = controllers + c
    cId = obj[2]

    dpoIdMapping = []
    dpo = ''
    dId = 1
    obj = createDPOPart(input['dataProtectionOfficerList'], dId)
    d = obj[0]
    dpoIdMapping = dpoIdMapping + obj[1]
    dpo = dpo + d
    dId = obj[2]

    purposeId = 1
    purposeRes = ''

    retentionRes = ''
    retentionId = 1

    legalBasisRes = ''
    legalBasisId = 1

    ADMres = ''
    admId = 1

    PMres = ''
    pmId = 1

    DRres = ''
    drId = 1

    sfgRes = ''
    sfgId = 1

    dataNames = ''
    dataNameId = 1

    nOdPrivacyModelId = 1

    privacyModelAttribute = ''
    attributePrivacyModelId = 1

    pnAttr = ''
    attributePNId = 1

    pnId = 1
    pnRes = ''

    allNameOfDataList = []
    purposeIdMapping = []

    purposesData = createPurposesData(input['purposeList'], dataObj[0], purposeId, retentionId, legalBasisId, admId, drId, sfgId, pmId, nOdPrivacyModelId, attributePrivacyModelId, attributePNId, pnId, allNameOfDataList)

    purposes = purposesData[0]
    allRetention = purposesData[1]
    allLegalBasis = purposesData[2]
    allADM = purposesData[3]
    allDataRecipient = purposesData[4]
    allSafeguard = purposesData[5]
    allPM = purposesData[6]
    allNoD = purposesData[7]
    allPMAttr = purposesData[8]
    allPNAttr = purposesData[9]
    allPN = purposesData[10]

    purposeIdMapping = purposeIdMapping + purposesData[11]

    purposeId = purposesData[12][0]
    retentionId = purposesData[12][1]
    legalBasisId = purposesData[12][2]
    admId = purposesData[12][3]
    drId = purposesData[12][4]
    sfgId = purposesData[12][5]
    pmId = purposesData[12][6]
    dataNameId = purposesData[12][7]
    nOdPrivacyModelId = purposesData[12][8]
    attributePrivacyModelId = purposesData[12][9]
    pnId = purposesData[12][10]

    allNameOfDataList = purposesData[13]

    purposeRes = purposeRes + purposes
    retentionRes = retentionRes + allRetention
    legalBasisRes = legalBasisRes + allLegalBasis
    ADMres = ADMres + allADM
    DRres = DRres + allDataRecipient
    sfgRes = sfgRes + allSafeguard
    PMres = PMres + allPM
    dataNames = dataNames + allNoD
    privacyModelAttribute = privacyModelAttribute + allPMAttr
    pnAttr = pnAttr + allPNAttr
    pnRes = pnRes + allPN

    lppId = 0
    lppParentIds = get_underlying_lpps_list(input, lppId)
    purposeHierarchy = createPurposeHierarchy(input['purposeHierarchy'], purposeIdMapping)
    basic = createBasicPart(input, purposeIdMapping, purposeHierarchy, controllerIdMapping, dpoIdMapping, lodgeComplaintIdMapping, lppId, lppParentIds, dsrIdMapping, [])

    res = res + \
          basic + '\n' + \
          'dataSource(ds,[]).' + '\n' + \
          purposeRes + '\n' + \
          controllers + \
          dpo + '\n' + \
          dsr + '\n' + \
          lc + '\n' + \
          retentionRes + \
          legalBasisRes + \
          DRres + '\n' + \
          PMres + \
          pnRes + \
          allData + \
          allDataGroups + \
          allAM

    return res

def transform_json2prolog_compatibility(input):
    # json_obj = input['list']

    # allDataRawList = input['allData']
    # allDataRawList = input['completeDataList']
    # dataObj = get_data(allDataRawList)
    # allAM = dataObj[2]
    # allDataGroups = dataObj[5]
    # allData = '\n'
    # for d in dataObj[0]:
    #     allData = allData + d[0] + '\n'

    res = ''

    # iconIdMapping = []
    # iconId = 1
    # icon = ''
    # i = createIconsPart(input['iconList'], iconId)
    # iconIdMapping.append((0, iconId))
    # iconId = iconId + 1
    # icon = icon + i + '\n' + '\n'

    dsrIdMapping = []
    dscId = 1
    dsr = ""
    d = createDSRPart(input['dataSubjectRightList'], dscId)
    dsrIdMapping = d[1]
    dsr = d[0]

    lodgeComplaintIdMapping = []
    lcId = 1
    sa = ""
    sa = createLodgeComplaintPart(input['lodgeComplaint'], lcId)
    lodgeComplaintIdMapping.append((0, lcId))
    lcId = lcId + 1

    controllerIdMapping = []
    controllers = ''
    cId = 1
    c = createControllerPart(input['controllerList'], cId)
    controllerIdMapping = controllerIdMapping + c[1]
    controllers = c[0]
    cId = c[2]

    dpoIdMapping = []
    dpo = ''
    dId = 1
    d = createDPOPart(input['dataProtectionOfficerList'], dId)
    dpoIdMapping = dpoIdMapping + d[1]
    dpo = d[0]
    dId = d[2]

    purposeId = 1
    purposeRes = ''

    retentionRes = ''
    retentionId = 1

    legalBasisRes = ''
    legalBasisId = 1

    ADMres = ''
    admId = 1

    PMres = ''
    pmId = 1

    DRres = ''
    drId = 1

    sfgRes = ''
    sfgId = 1

    dataNames = ''
    dataNameId = 1

    nOdPrivacyModelId = 1

    privacyModelAttribute = ''
    attributePrivacyModelId = 1

    pnAttr = ''
    attributePNId = 1

    pnId = 1
    pnRes = ''

    allNameOfDataList = []
    purposeIdMapping = []

    purposesData = createPurposesData_compatibility(input['purposeList'], purposeId, retentionId, legalBasisId, admId, drId, sfgId, pmId, nOdPrivacyModelId, attributePrivacyModelId, attributePNId, pnId, allNameOfDataList)

    purposes = purposesData[0]
    allRetention = purposesData[1]
    allLegalBasis = purposesData[2]
    allADM = purposesData[3]
    allDataRecipient = purposesData[4]
    allSafeguard = purposesData[5]
    allPM = purposesData[6]
    allNoD = purposesData[7]
    allPMAttr = purposesData[8]
    allPNAttr = purposesData[9]
    allPSM = purposesData[10]

    purposeIdMapping = purposeIdMapping + purposesData[11]

    purposeId = purposesData[12][0]
    retentionId = purposesData[12][1]
    legalBasisId = purposesData[12][2]
    admId = purposesData[12][3]
    drId = purposesData[12][4]
    sfgId = purposesData[12][5]
    pmId = purposesData[12][6]
    dataNameId = purposesData[12][7]
    nOdPrivacyModelId = purposesData[12][8]
    attributePrivacyModelId = purposesData[12][9]
    pnId = purposesData[12][10]

    allNameOfDataList = purposesData[13]
    allData = purposesData[14]
    allDataGroups = purposesData[15]
    allAM = purposesData[16]

    sfgRes = sfgRes + allSafeguard
    dataNames = dataNames + allNoD
    privacyModelAttribute = privacyModelAttribute + allPMAttr
    pnAttr = pnAttr + allPNAttr

    lppId = 0
    u = get_underlying_lpps_list(input, lppId)
    upp = u[0]
    lppParentIds = u[1]
    purposeHierarchy = createPurposeHierarchy(input['purposeHierarchy'], purposeIdMapping)
    basic = createBasicPart(input, purposeIdMapping, purposeHierarchy, controllerIdMapping, dpoIdMapping, lodgeComplaintIdMapping, lppId, lppParentIds, dsrIdMapping, [])

    res = res + \
          basic + '\n\n' + \
          'dataSource(ds,[]).' + '\n\n' + \
          purposes + '\n' + \
          controllers + '\n' + \
          dpo + '\n' + \
          dsr + '\n' + \
          sa + '\n' + \
          allADM + '\n' + \
          allRetention + '\n' + \
          allLegalBasis + '\n' + \
          allDataRecipient + '\n' + \
          allPM + '\n' + \
          allPSM + '\n' + \
          allData + '\n' + \
          allDataGroups + '\n' + \
          allAM + '\n' + \
          upp

    return res
