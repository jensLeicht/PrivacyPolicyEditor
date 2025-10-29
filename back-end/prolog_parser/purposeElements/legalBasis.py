from aux_func import get_head_prolog, get_desc_prolog

def get_legal_basis(lbItem, lbId):
    lbCategory = lbItem['lbCategory']
    head = lbItem['head']
    desc = lbItem['desc']

    header = get_head_prolog(head)
    description = get_desc_prolog(desc)

    item = 'legalBasis(lb' + str(lbId) + ',(' + \
           lbCategory + ',' + \
           header + ',' + description + ')).\n'

    res = item
    return res