from aux_func import get_Desc
from aux_func import get_Headers

def create_safeguard_list(safeguardListXML):
    safeguards = safeguardListXML.findAll('item', recursive=False)
    safeguardList = []
    for safeguard in safeguards:
        name = safeguard.find('name').getText()
        header = safeguard.find('head')
        head = get_Headers(header)
        description = safeguard.find('desc')
        desc = get_Desc(description)
        safeguardItem = {
            'name': name,
            'head': head,
            'desc': desc
        }
        safeguardList.append(safeguardItem)
    return safeguardList