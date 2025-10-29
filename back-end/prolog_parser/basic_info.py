from aux_func import get_head_prolog, get_desc_prolog


def createBasicPart(json_obj, puproseIdMapping, purposeHierarchy, controllerIdMapping, dpoIdMapping, lodgeComplaintIdMapping, lppId, lppParentIds, dsrMapping, iconIdMapping):

    puproseIdMapping = dict(puproseIdMapping)
    controllerIdMapping = dict(controllerIdMapping)
    dpoIdMapping = dict(dpoIdMapping)
    lodgeComplaintIdMapping = dict(lodgeComplaintIdMapping)
    iconIdMapping = dict(iconIdMapping)

    # dsrMapping = dict(dsrMapping)

    version = json_obj['version']
    name = json_obj['name']
    lang = json_obj['lang']
    uri = json_obj['privacyPolicyUri']

    head = json_obj['head']
    desc = json_obj['desc']

    header = get_head_prolog(head)
    description = get_desc_prolog(desc)

    purposeIds = '['
    purposeList = json_obj['purposeList']

    if len(purposeList) == 0:
        purposeIds = purposeIds + ']'
    else:
        for purpose in purposeList:
            pName = purpose['name']
            purposeIds = purposeIds + 'p' + str(puproseIdMapping[pName]) + ','
        purposeIds = purposeIds[:-1] + ']'

    controllerIds = '['
    controllerList = json_obj['controllerList']

    if len(controllerList) == 0:
        controllerIds = controllerIds + ']'
    else:
        for controller in controllerList:
            cAuthInfo = controller['authInfo']
            controllerIds = controllerIds + 'c' + str(controllerIdMapping[cAuthInfo]) + ','
        controllerIds = controllerIds[:-1] + ']'

    dpoIds = '['
    dpoList = json_obj['dataProtectionOfficerList']

    if len(dpoList) == 0:
        dpoIds = dpoIds + ']'
    else:
        for dpo in dpoList:
            dpoAuthInfo = dpo['authInfo']
            dpoIds = dpoIds + 'dpo' + str(dpoIdMapping[dpoAuthInfo]) + ','
        dpoIds = dpoIds[:-1] + ']'
    
    dsrIds = '['
    
    if len(dsrMapping) == 0:
        dsrIds = dsrIds + ']'
    else:
        for dsr in dsrMapping:
            dsrIds = dsrIds + 'dsr' + str(dsr) + ','
        dsrIds = dsrIds[:-1] + ']'

    # icId = iconIdMapping[json_obj['id']]
    # ics = 'ics(ic' + str(icId) + ',IC)'

    lcId = lodgeComplaintIdMapping[0]
    lcs = 'sa' + str(lcId)

    lpp = 'lpp((' + \
        version + ',"' + \
        name + '","' + \
        lang + '",' + \
        'URI,LPP_HEAD,LPP_DESC,[],ds,P,PH,C,DPO,DSR,' + \
        lcs + ',' + \
        lppParentIds + ')).'

    res = 'main:-\n' + \
          '\t' + 'URI = "' + uri + '",\n' + \
          '\t' + 'LPP_HEAD = ' + header + ',\n' + \
          '\t' + 'LPP_DESC = ' + description + ',\n' + \
          '\t' + 'P = ' + purposeIds + ',\n' + \
          '\t' + 'PH = ' + purposeHierarchy + ',\n' + \
          '\t' + 'C = ' + controllerIds + ',\n' + \
          '\t' + 'DPO = ' + dpoIds + ',\n' + \
          '\t' + 'DSR = ' + dsrIds + ',\n' + \
          '\t' + lpp

    return res