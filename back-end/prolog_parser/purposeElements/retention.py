from aux_func import get_head_prolog, get_desc_prolog

def get_retention_item(retention, retentionId):
    type = retention['type']
    pointInTime = retention['pointInTime']
    head = retention['head']
    desc = retention['desc']

    header = get_head_prolog(head)
    description = get_desc_prolog(desc)

    if type == "":
        type = 'indefinite'
    item = 'retention(r' + str(retentionId) + ',(' + \
           type + ',' + \
            '"' + pointInTime + '",' + \
           header + ',' + description + ')).\n'

    return item
