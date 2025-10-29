def get_pn_attribute_list(privacyModelAttributeList, pmAId):

    res = '['
    pMa = '['

    for attr in privacyModelAttributeList:
        value = attr['value']
        key = attr['key']

        item = '(' + \
               '"' + key + '","' + value + '"),'

        pMa = pMa + 'pnMethodAttr' + str(pmAId) + ','

        res = res + item
        pmAId = pmAId + 1
    if res != '[':
        res = res[:-1] + ']'
    else:
        res = res + ']'

    return (res, pmAId, pMa)