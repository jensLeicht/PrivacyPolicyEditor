from aux_func import get_Desc
from aux_func import get_Headers

def create_pseudonymization_method_list(pseudonymizationMethodListXML):
    methods = pseudonymizationMethodListXML.findAll('item', recursive=False)
    pseudonymizationMethodList = []
    for method in methods:
        name = method.find('name').getText()
        attrName = method.find('attrName').getText()
        header = method.find('head')
        head = get_Headers(header)
        description = method.find('desc')
        desc = get_Desc(description)

        pseudonymizationMethodAttributeListXML = method.find('pseudonymizationMethodAttributeList')
        pseudonymizationMethodAttributes = pseudonymizationMethodAttributeListXML.findAll('item', recursive=False)
        pseudonymizationMethodAttributeList = []
        for item in pseudonymizationMethodAttributes:
            key = item.find('key').getText()
            value = item.find('value').getText()
            attritute = {
                'key': key,
                'value': value
            }
            pseudonymizationMethodAttributeList.append(attritute)

        nameOfDateListXML = method.find('nameOfDataList')
        names = nameOfDateListXML.findAll('item', recursive=False)
        nameOfDataList = []
        for n in names:
            datesName = n.find('name').getText()
            nameOfData = {
                "name": datesName
            }
            nameOfDataList.append(nameOfData)

        pseudonymizationMethodItem = {
            'name': name,
            'attrName': attrName,
            'pseudonymizationMethodAttributeList': pseudonymizationMethodAttributeList,
            'nameOfDataList': nameOfDataList,
            'head': head,
            'desc': desc
        }
        pseudonymizationMethodList.append(pseudonymizationMethodItem)
    return pseudonymizationMethodList