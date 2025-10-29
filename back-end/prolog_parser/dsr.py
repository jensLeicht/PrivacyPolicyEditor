from aux_func import get_head_prolog, get_desc_prolog

def createDSRPart(obj, dscId):
    dsrMapping = []
    res = ''
    for d in obj:
        name = d['name']
        head = d['head']
        desc = d['desc']

        header = get_head_prolog(head)
        description = get_desc_prolog(desc)

        item = 'dsr(dsr' + str(dscId) + ",(" + \
            name + ',' + \
            header + ',' + description + ')).\n'

        res = res + item
        dsrMapping.append(dscId)
        dscId = dscId + 1

    return (res, dsrMapping)