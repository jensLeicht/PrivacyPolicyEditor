from aux_func import get_head_prolog, get_desc_prolog
from prolog_parser.purposeElements.am import get_am
from prolog_parser.purposeElements.dataCategory import get_dataCategory
from prolog_parser.purposeElements.dataGroup import get_dataGroup


def get_data(allDataRawList):
    dataId = 1

    dataCategoryId = 1
    dataGroupId = 1
    amId = 1

    dataCategoryIdList = '['
    dataGroupIdList = '['
    amIdList = ''

    dataCategoryList = '\n'
    dataGroupList = '\n'
    amList = '\n'
    heList = ''
    amAttributeList = '\n'

    dataCategoryName = []
    dataCategoryIds = []

    dataGroupName = []
    dataGroupIds = []

    amName = []
    dataName = []

    heId = 1
    amAttributeId = 1

    res = []

    for dataItem in allDataRawList:
        # dataItem = dataRaw['data']
        name = dataItem['name']

        if not name in dataName:
            dataName.append(name)

            required = str(dataItem['required']).lower()
            # pointOfAcceptance = dataItem['pointOfAcceptance']
            dataType = dataItem['dataType']
            privacyGroup = dataItem['privacyGroup']
            head = dataItem['head']
            desc = dataItem['desc']

            header = get_head_prolog(head)
            description = get_desc_prolog(desc)

            dataGroupPList = dataItem['dataGroupList']
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

            dataCategoryPList = dataItem['dataCategoryList']
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

            amItem = dataItem['anonymizationMethod']
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
                    '"' + name + '",' + \
                    '"' + dataType + '",' + \
                    required + ',' + \
                    '[],' + \
                    '"' + privacyGroup + '",' + \
                    dataCategoryIdList + ',' + \
                    dataGroupIdList + ',' + \
                    amIdList + ',' + \
                   header + ',' + description + ')).', 'dt' + str(dataId), name)
            dataId = dataId + 1

            res.append(item)
            dataCategoryIdList = '['
            dataGroupIdList = '['
            amIdList = ''
    return (res, dataCategoryList, amList, heList, amAttributeList, dataGroupList)