from aux_func import get_Desc
from aux_func import get_Headers

def create_data_protection_officer_list(dataProtectionOfficerListXML):
    officers = dataProtectionOfficerListXML.findAll('item', recursive=False)
    officersList = []
    for officer in officers:
        address = officer.find('address').getText()

        name = officer.find('name').getText()
        authInfo = officer.find('authInfo').getText()
        classification = officer.find('classification').getText()
        type = officer.find('type').getText()

        header = officer.find('head')
        head = get_Headers(header)
        description = officer.find('desc')
        desc = get_Desc(description)

        firstName = officer.find('firstName').getText()
        lastName = officer.find('lastName').getText()
        phoneNumber = officer.find('phoneNumber').getText()
        email = officer.find('email').getText()
        officerItem = {
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
        officersList.append(officerItem)
    return officersList