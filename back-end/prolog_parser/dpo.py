from aux_func import get_head_prolog, get_desc_prolog

def createDPOPart(obj, dId):
    dpoIdMapping = []
    res = ''
    for d in obj:
        name = d['name']
        classification = d['classification']
        authInfo = d['authInfo']
        type = d['type']
        firstName = d['firstName']
        lastName = d['lastName']
        address = d['address']
        phoneNumber = d['phoneNumber']
        email = d['email']
        head = d['head']
        desc = d['desc']

        header = get_head_prolog(head)
        description = get_desc_prolog(desc)

        delimiter = '","'
        item = 'dpo(dpo' + str(dId) + ',("' + \
               name + delimiter + \
               classification + delimiter + \
               authInfo + delimiter + \
               type + delimiter + \
               firstName + delimiter + \
               lastName + delimiter + \
               address + delimiter + \
               phoneNumber + delimiter + \
               email + '",' + header + ',' + description + ')).\n'

        res = res + item

        dpoIdMapping.append((authInfo, dId))

        dId = dId + 1

    return (res, dpoIdMapping, dId)