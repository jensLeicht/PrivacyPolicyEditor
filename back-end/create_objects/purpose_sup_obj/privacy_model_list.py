from aux_func import get_Desc
from aux_func import get_Headers

def create_privacy_model_list(privacyModelListXML):
    privacyModels = privacyModelListXML.findAll('item', recursive=False)
    privacyModelList = []
    for model in privacyModels:
        name = model.find('name').getText()
        header = model.find('head')
        head = get_Headers(header)
        description = model.find('desc')
        desc = get_Desc(description)

        nameOfDateListXML = model.find('nameOfDataList')
        names = nameOfDateListXML.findAll('item', recursive=False)
        nameOfDataList = []
        for n in names:
            datesName = n.find('name').getText()
            nameOfData = {
                "name": datesName
            }
            nameOfDataList.append(nameOfData)

        privacyModelAttributeListXML = model.find('privacyModelAttributeList')
        attributes = privacyModelAttributeListXML.findAll('item', recursive=False)
        privacyModelAttributeList = []
        for attr in attributes:
            value = attr.find('value').getText()
            key = attr.find('key').getText()
            attributeItem = {
                'value': value,
                'key': key
            }
            privacyModelAttributeList.append(attributeItem)

        privacyModelItem = {
            'name': name,
            'nameOfDataList': nameOfDataList,
            'privacyModelAttributeList': privacyModelAttributeList,
            'head': head,
            'desc': desc
        }
        privacyModelList.append(privacyModelItem)
    return privacyModelList