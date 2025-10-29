from aux_func import get_head_prolog, get_desc_prolog

def createControllerPart(obj, cId):
    controllerIdMapping = []
    res = ''
    for c in obj:
        name = c['name']
        classification = c['classification']
        authInfo = c['authInfo']
        type = c['type']
        firstName = c['firstName']
        lastName = c['lastName']
        address = c['address']
        phoneNumber = c['phoneNumber']
        email = c['email']
        head = c['head']
        desc = c['desc']

        header = get_head_prolog(head)
        description = get_desc_prolog(desc)

        delimiter = '","'
        item = 'controller(c' + str(cId) + ',("' + \
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

        controllerIdMapping.append((authInfo, cId))
        cId = cId + 1
    return (res, controllerIdMapping, cId)