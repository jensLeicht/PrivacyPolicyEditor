from aux_func import get_head_prolog, get_desc_prolog

def get_adm_item(adm, admId):
    name = adm['name']
    head = adm['head']
    desc = adm['desc']

    header = get_head_prolog(head)
    description = get_desc_prolog(desc)

    item = 'adm(adm' + str(admId) + ',' + \
              '("' + \
              name + '",' + \
              header + ',' + description + ')).\n'

    res = item
    return res