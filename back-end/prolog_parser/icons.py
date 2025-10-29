from aux_func import get_head_prolog, get_desc_prolog

def createIconsPart(obj, iconId):
    icons = 'ics(' + '\n'
    res = ''
    for ic in obj:
        i = ic['icon']
        name = i['name']
        head = i['head']
        desc = i['desc']

        header = get_head_prolog(head)
        description = get_desc_prolog(desc)

        item = '\n' + '\t' + '\t' + '("' + name + '",' + \
               header + ',' + description + '),'

        res = res + item

    res = res[:-1] + '],'

    icons = icons + '\t' + 'ic' + str(iconId) + ',[' + res
    icons = icons[:-2] + '\n' + ']).'

    return icons