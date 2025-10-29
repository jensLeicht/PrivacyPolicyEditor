from aux_func import get_head_prolog, get_desc_prolog

def get_am(amItem, amId, heId, amAttributeId):
    name = amItem['name']
    head = amItem['head']
    desc = amItem['desc']

    hierarchyEntityList = amItem['hierarchyEntityList']
    allHierarchyEntity = '['
    hierarchyEntityIds = '['

    for item in hierarchyEntityList:
        value = item['value']
        item = '("' + \
               value + '"),'
        hierarchyEntityIds = hierarchyEntityIds + 'he' + str(heId) + ','
        allHierarchyEntity = allHierarchyEntity + item
        heId = heId + 1
    if allHierarchyEntity != '[':
        allHierarchyEntity = allHierarchyEntity[:-1] + ']'
    else:
        allHierarchyEntity = allHierarchyEntity + ']'

    anonymizationMethodAttributeList = amItem['anonymizationMethodAttributeList']
    allAMAtribute = '['
    allAMAtributeIds = '['

    for item in anonymizationMethodAttributeList:
        value = item['value']
        key = item['key']
        AMAitem = '("' + \
               key + '","' + value + '"),'
        allAMAtributeIds = allAMAtributeIds + 'amAttribute' + str(amAttributeId) + ','
        allAMAtribute = allAMAtribute + AMAitem
        amAttributeId = amAttributeId + 1
    if allAMAtribute != '[':
        allAMAtribute = allAMAtribute[:-1] + ']'
    else:
        allAMAtribute = allAMAtribute + ']'

    header = get_head_prolog(head)
    description = get_desc_prolog(desc)

    item = 'anonymizationMethod(am' + str(amId) + ',(' + \
           '"' + name + '",' + \
           allAMAtribute + ',' + \
           allHierarchyEntity + ',' + \
           header + ',' + description + ')).\n'

    res = item

    if name == "":
        res = ""
    return (res, allHierarchyEntity, heId, allAMAtribute, amAttributeId)