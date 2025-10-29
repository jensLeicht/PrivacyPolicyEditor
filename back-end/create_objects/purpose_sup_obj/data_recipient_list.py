from create_objects.purpose_sup_obj.safeguard_list import create_safeguard_list
from aux_func import get_Desc
from aux_func import get_Headers

def create_data_recipient_list(dataRecipientListXML):
    dataRecipients = dataRecipientListXML.findAll('item', recursive=False)
    dataRecipientList = []
    for recipient in dataRecipients:
        id = int(recipient.find('id').getText())
        required = recipient.find('required').getText() == "True"
        if (recipient.find('pointOfAcceptance') != None):
            pointOfAcceptance = recipient.find('pointOfAcceptance').getText()
        else:
            pointOfAcceptance = ""
        thirdCountryTransfer = recipient.find('thirdCountryTransfer').getText() == "True"
        adequacyDecision = recipient.find('adequacyDecision').getText() == "True"
        country = recipient.find('country').getText()

        safeguardListXML = recipient.find('safeguardList')
        safeguardList = create_safeguard_list(safeguardListXML)

        name = recipient.find('name').getText()
        authInfo = recipient.find('authInfo').getText()
        classification = recipient.find('classification').getText()
        type = recipient.find('type').getText()

        header = recipient.find('head')
        head = get_Headers(header)
        description = recipient.find('desc')
        desc = get_Desc(description)

        dataRecipientItem = {
            'id': id,
            'required': required,
            'pointOfAcceptance': pointOfAcceptance,
            'thirdCountryTransfer': thirdCountryTransfer,
            'adequacyDecision': adequacyDecision,
            'country': country,
            'safeguardList': safeguardList,
            'name': name,
            'authInfo': authInfo,
            'classification': classification,
            'type': type,
            'head': head,
            'desc': desc
        }
        dataRecipientList.append(dataRecipientItem)
    return dataRecipientList

def create_data_recipient_list_from_dfd(dataRecipientListXML):
    id = 0
    dataRecipientList = []
    for recipient in dataRecipientListXML:
        if recipient.get('dataSubject') != 'true':
            name = recipient.get('name')

            head = [{
            'lang': 'en',
            'value': name
            }]
            desct = recipient.get('description')
            if desct is None:
                desct = ''
            desc = [{
                'lang': 'en',
                'value': desct
            }]

            dataRecipientItem = {
                'id': id,
                'required': False,
                'thirdCountryTransfer': False,
                'adequacyDecision': False,
                'country': '',
                'safeguardList': [],
                'name': name,
                'authInfo': '',
                'classification': '',
                'type': '',
                'head': head,
                'desc': desc
            }
            dataRecipientList.append(dataRecipientItem)
    return dataRecipientList