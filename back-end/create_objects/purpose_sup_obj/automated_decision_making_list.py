from aux_func import get_Desc
from aux_func import get_Headers

def create_automated_decision_making_list(automatedDecisionMakingListXML):
    automatedDecisionMaking = automatedDecisionMakingListXML.findAll('item', recursive=False)
    automatedDecisionMakingList = []
    for item in automatedDecisionMaking:
        name = item.find('name').getText()
        header = item.find('head')
        head = get_Headers(header)
        description = item.find('desc')
        desc = get_Desc(description)
        automatedDecisionMakingItem = {
            'name': name,
            'head': head,
            'desc': desc
        }
        automatedDecisionMakingList.append(automatedDecisionMakingItem)
    return automatedDecisionMakingList