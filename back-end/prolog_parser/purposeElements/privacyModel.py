from aux_func import get_head_prolog, get_desc_prolog
from prolog_parser.purposeElements.nameOfData import get_name_of_data_list
from prolog_parser.purposeElements.pmAttr import get_privacy_model_attribute_list


def get_pm_item(item, pmId, nOdId, pmAId, allNameOfDataList):
    name = item['name']
    head = item['head']
    desc = item['desc']

    header = get_head_prolog(head)
    description = get_desc_prolog(desc)

    nameOfDataList = item['nameOfDataList']
    privacyModelAttributeList = item['privacyModelAttributeList']

    nOdResult = get_name_of_data_list(allNameOfDataList, nameOfDataList, nOdId)
    nOd = nOdResult[0]
    nOdId = nOdResult[1]
    allNameOfDataList = nOdResult[2]
    nOds = nOdResult[3]

    pmAResult = get_privacy_model_attribute_list(privacyModelAttributeList, pmAId)
    pmA = pmAResult[0]
    pmAId = pmAResult[1]
    pMa = pmAResult[2]

    item = 'privacyModel(pm' + str(pmId) + ',("' + \
           name + '",' + \
           nOd + ',' + \
           pmA + ',' + \
           header + ',' + description + ')).\n'

    res = item
    return (res, nOd, pmA, nOdId, pmAId, allNameOfDataList)