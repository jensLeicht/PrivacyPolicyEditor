from aux_func import get_head_prolog, get_desc_prolog

def get_dataCategory(dgItem, dataCategoryId):

    name = dgItem['name']
    head = dgItem['head']
    desc = dgItem['desc']

    header = get_head_prolog(head)
    description = get_desc_prolog(desc)

    item = 'dataCategory(' + name + ',(' + \
           header + ',' + description + ')).'

    res = item + '\n'
    return (res, name)