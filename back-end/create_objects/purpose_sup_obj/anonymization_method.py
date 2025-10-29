from aux_func import get_Desc
from aux_func import get_Headers

def create_anonymization_method_obj(anonymizationMethodXML):
    name = anonymizationMethodXML.find('name').getText()

    header = anonymizationMethodXML.find('head')
    head = get_Headers(header)
    description = anonymizationMethodXML.find('desc')
    desc = get_Desc(description)

    hierarchyEntityListXML = anonymizationMethodXML.find('hierarchyEntityList')
    hierarchyEntities = hierarchyEntityListXML.findAll('item')
    hierarchyEntityList = []
    for entity in hierarchyEntities:
        value = entity.find('value').getText()
        entityItem = {
            'value': value
        }
        hierarchyEntityList.append(entityItem)

    anonymizationMethodAttributeListXML = anonymizationMethodXML.find('anonymizationMethodAttributeList')
    anonymizationMethodAttributes = anonymizationMethodAttributeListXML.findAll('item')
    anonymizationMethodAttributeList = []
    for anonymizationMethodAttribute in anonymizationMethodAttributes:
        key = anonymizationMethodAttribute.find('key').getText()
        value = anonymizationMethodAttribute.find('value').getText()
        attributeItem = {
            'key': key,
            'value': value
        }
        anonymizationMethodAttributeList.append(attributeItem)

    anonymizationMethod = {
        'name': name,
        'hierarchyEntityList': hierarchyEntityList,
        'anonymizationMethodAttributeList': anonymizationMethodAttributeList,
        'head': head,
        'desc': desc
    }

    return anonymizationMethod