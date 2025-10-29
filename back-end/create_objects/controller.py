from aux_func import get_Desc
from aux_func import get_Headers

def create_controller_list(controllerListXML):
    controllers = controllerListXML.findAll('item', recursive=False)
    controllersList = []
    for controller in controllers:
        address = controller.find('address').getText()

        name = controller.find('name').getText()
        authInfo = controller.find('authInfo').getText()
        classification = controller.find('classification').getText()
        type = controller.find('type').getText()

        header = controller.find('head')
        head = get_Headers(header)
        description = controller.find('desc')
        desc = get_Desc(description)

        firstName = controller.find('firstName').getText()
        lastName = controller.find('lastName').getText()
        phoneNumber = controller.find('phoneNumber').getText()
        email = controller.find('email').getText()
        controllerItem = {
            'name': name,
            'authInfo': authInfo,
            'classification': classification,
            'type': type,
            'head': head,
            'desc': desc,
            'firstName': firstName,
            'lastName': lastName,
            'address': address,
            'phoneNumber': phoneNumber,
            'email': email
        }
        controllersList.append(controllerItem)
    return controllersList