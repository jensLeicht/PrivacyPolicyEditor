from aux_func import get_head_prolog, get_desc_prolog

def get_sfg(sfgList):
    res = ''
    for sfgItem in sfgList:
        name = sfgItem['name']
        head = sfgItem['head']
        desc = sfgItem['desc']

        header = get_head_prolog(head)
        description = get_desc_prolog(desc)

        item = '(' + \
               '"' + name + '",' + \
               header + ',' + description + '),'

        res = res + item
    res = res[:-1]
    return res