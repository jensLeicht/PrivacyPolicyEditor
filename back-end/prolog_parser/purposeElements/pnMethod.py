from aux_func import get_head_prolog, get_desc_prolog
from prolog_parser.purposeElements.nameOfData import get_name_of_data_list
from prolog_parser.purposeElements.pnAttrList import get_pn_attribute_list


def get_pn_Method(obj, pnId, allNameOfDataList, nOdId, pnAId):
    name = obj['name']
    attrName = obj['attrName']
    pseudonymizationMethodAttributeList = obj['pseudonymizationMethodAttributeList']
    nameOfDataList = obj['nameOfDataList']

    head = obj['head']
    desc = obj['desc']

    header = get_head_prolog(head)
    description = get_desc_prolog(desc)

    nOdResult = get_name_of_data_list(allNameOfDataList, nameOfDataList, nOdId)
    nOd = nOdResult[0]
    nOdId = nOdResult[1]
    allNameOfDataList = nOdResult[2]
    nOds = nOdResult[3]

    pnAResult = get_pn_attribute_list(pseudonymizationMethodAttributeList, pnAId)
    pmA = pnAResult[0]
    pmAId = pnAResult[1]
    pMa = pnAResult[2]

    item = 'pseudonymizationMethod(pn' + str(pnId) + ',("' + \
           name + '","' + \
           attrName + '",' + \
           nOd + ',' + \
           header + ',' + description + ',' + \
           pmA + ')).\n'

    res = item
    return (res, nOd, pmA, nOdId, pmAId, allNameOfDataList)