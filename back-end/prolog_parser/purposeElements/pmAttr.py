def get_privacy_model_attribute_list(privacyModelAttributeList, pmAId):

    res = '['
    pMa = '['

    if len(privacyModelAttributeList) == 0:
        res = res + ']'
    else:
        for attr in privacyModelAttributeList:
            value = attr['value']
            key = attr['key']

            item = '(' + \
                '"' + key + '","' + value + '"),'

            pMa = pMa + 'pmAttr' + str(pmAId) + ','

            res = res + item
            pmAId = pmAId + 1

        res = res[:-1] + ']'

    return (res, pmAId, pMa)