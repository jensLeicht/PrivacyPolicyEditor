from aux_func import get_Desc
from aux_func import get_Headers
from create_objects.purpose_sup_obj.retention import create_retention_obj
from create_objects.purpose_sup_obj.data_recipient_list import create_data_recipient_list
from create_objects.purpose_sup_obj.data_list import create_data_list
from create_objects.purpose_sup_obj.privacy_model_list import create_privacy_model_list
from create_objects.purpose_sup_obj.legal_basis_list import create_legal_basis_list
from create_objects.purpose_sup_obj.automated_decision_making_list import create_automated_decision_making_list
from create_objects.purpose_sup_obj.pseudonymization_method_list import create_pseudonymization_method_list

def create_purpose_list(purposeList):
    purposes = purposeList.findAll('item', recursive=False)
    purposesList = []

    for purpose in purposes:
        name = purpose.find('name').getText()
        optOut = purpose.find('optOut').getText() == "True"
        required = purpose.find('required').getText() == "True"
        pointOfAcceptance = purpose.find('pointOfAcceptance').getText()

        dataRecipientListXML = purpose.find('dataRecipientList')
        dataRecipientList = create_data_recipient_list(dataRecipientListXML)

        dataListXML = purpose.find('dataList')
        dataList = create_data_list(dataListXML)

        retentionXML = purpose.find('retention')
        retention = create_retention_obj(retentionXML)

        privacyModelListXML = purpose.find('privacyModelList')
        privacyModelList = create_privacy_model_list(privacyModelListXML)

        legalBasisListXML = purpose.find('legalBasisList')
        legalBasisList = create_legal_basis_list(legalBasisListXML)

        automatedDecisionMakingListXML = purpose.find('automatedDecisionMakingList')
        automatedDecisionMakingList = create_automated_decision_making_list(automatedDecisionMakingListXML)

        pseudonymizationMethodListXML = purpose.find('pseudonymizationMethodList')
        pseudonymizationMethodList = create_pseudonymization_method_list(pseudonymizationMethodListXML)

        header = purpose.find('head', recursive=False)
        head = get_Headers(header)
        description = purpose.find('desc', recursive=False)
        desc = get_Desc(description)
        
        purposeItem = {
            'name': name,
            'optOut': optOut,
            'required': required,
            'pointOfAcceptance': pointOfAcceptance,
            'dataRecipientList': dataRecipientList,
            'dataList': dataList,
            'retention': retention,
            'privacyModelList': privacyModelList,
            'legalBasisList': legalBasisList,
            'automatedDecisionMakingList': automatedDecisionMakingList,
            'pseudonymizationMethodList': pseudonymizationMethodList,
            'head': head,
            'desc': desc
        }
        purposesList.append(purposeItem)
    return purposesList

def create_purpose_list_from_dfd(purposeList):

    purposesList = []
    for purpose in purposeList:
        name = purpose.get('name')

        # dataRecipientListXML = purpose.find('dataRecipientList')
        dataRecipientList = []
        # dataRecipientList = create_data_recipient_list(dataRecipientListXML)

        # dataListXML = purpose.find('dataList')
        dataList = []
        # dataList = create_data_list(dataListXML)

        head = [{
            'lang': 'en',
            'value': name
            }] 
        desct = purpose.get('description')
        if desct is None:
            desct = ''
        desc = [{
            'lang': 'en',
            'value': desct
        }]
        
        purposeItem = {
            'name': name,
            'optOut': False,
            'required': False,
            'pointOfAcceptance': '',
            'dataRecipientList': dataRecipientList,
            'dataList': dataList,
            'retention': '',
            'privacyModelList': [],
            'legalBasisList': [],
            'automatedDecisionMakingList': [],
            'pseudonymizationMethodList': [],
            'head': head,
            'desc': desc
        }
        purposesList.append(purposeItem)
    return purposesList