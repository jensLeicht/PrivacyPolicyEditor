from aux_func import get_Desc
from aux_func import get_Headers

def create_lodge_complaint_obj(lodgeComplaintXML):
    name = lodgeComplaintXML.find('name').getText()
    authInfo = lodgeComplaintXML.find('authInfo').getText()
    classification = lodgeComplaintXML.find('classification').getText()
    type = lodgeComplaintXML.find('type').getText()
    header = lodgeComplaintXML.find('head')
    head = get_Headers(header)
    description = lodgeComplaintXML.find('desc')
    desc = get_Desc(description)
    firstName = lodgeComplaintXML.find('firstName').getText()
    lastName = lodgeComplaintXML.find('lastName').getText()
    address = lodgeComplaintXML.find('address').getText()
    phoneNumber = lodgeComplaintXML.find('phoneNumber').getText()
    email = lodgeComplaintXML.find('email').getText()

    lcItem = {
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
    return lcItem