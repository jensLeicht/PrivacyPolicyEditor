from aux_func import get_Desc
from aux_func import get_Headers

def create_retention_obj(retentionXML):
    type = retentionXML.find('type').getText()
    pointInTime = retentionXML.find('pointInTime').getText()
    header = retentionXML.find('head')
    head = get_Headers(header)
    description = retentionXML.find('desc')
    desc = get_Desc(description)

    if type == "indefinite" and head == "":
        type = ''

    retentionObj = {
        'type': type,
        'pointInTime': pointInTime,
        'head': head,
        'desc': desc
    }
    return retentionObj