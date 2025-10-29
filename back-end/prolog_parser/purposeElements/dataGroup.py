from aux_func import get_head_prolog, get_desc_prolog

def get_dataGroup(dgItem, dataCategoryId):
    name = dgItem['name']
    head = dgItem['head']
    desc = dgItem['desc']

    header = get_head_prolog(head)
    description = get_desc_prolog(desc)

    item = 'dataGroup(dg' + str(dataCategoryId) + ',(' + \
           '"' + name + '",' + \
           header + ',' + description + ')).\n'

    res = item
    return res