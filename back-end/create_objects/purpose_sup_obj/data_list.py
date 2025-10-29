from aux_func import get_Desc
from aux_func import get_Headers
from create_objects.purpose_sup_obj.data_Category_list import create_data_Category_list
from create_objects.purpose_sup_obj.anonymization_method import create_anonymization_method_obj
from create_objects.purpose_sup_obj.data_group_list import create_data_group_list


def create_data_list(dataListXML):
    data = dataListXML.findAll('item', recursive=False)
    dataList = []
    for d in data:
        id = int(d.find('id').getText())
        name = d.find('name').getText()
        required = d.find('required').getText() == "True"
        if (d.find('pointOfAcceptance') != None):
            pointOfAcceptance = d.find('pointOfAcceptance').getText()
        else:
            pointOfAcceptance = ""
        dataType = d.find('dataType').getText()
        privacyGroup = d.find('privacyGroup').getText()

        header = d.find('head', recursive = False)
        head = get_Headers(header)
        description = d.find('desc', recursive = False)
        desc = get_Desc(description)

        dataCategoryListXML = d.find('dataCategoryList')
        dataCategoryList = create_data_Category_list(dataCategoryListXML)

        dataGroupListXML = d.find('dataGroupList')
        dataGroupList = create_data_group_list(dataGroupListXML)

        anonymizationMethodXML = d.find('anonymizationMethod')
        anonymizationMethod = create_anonymization_method_obj(anonymizationMethodXML)

        dataItem = {
            'id': id,
            'name': name,
            'required': required,
            'pointOfAcceptance': pointOfAcceptance,
            'dataType': dataType,
            'privacyGroup': privacyGroup,
            'anonymizationMethod': anonymizationMethod,
            'dataCategoryList': dataCategoryList,
            'dataGroupList': dataGroupList,
            'head': head,
            'desc': desc
        }

        dataList.append(dataItem)
    return dataList

def create_data_list_from_dfd(dataListXML, groups):
    id = 0
    dataList = []
    for d in dataListXML:
        name = d.get('name')

        head = [{
            'lang': 'en',
            'value': name
        }]
        desct = d.get('description')
        if desct is None:
            desct = ''
        desc = [{
            'lang': 'en',
            'value': desct
        }]

        dataCategoryList = []

        dataGroupList = []
        for group in groups:
            if ('//@data.' + str(id)) in group['data']:
                dataGroupList.append(group)

        dataItem = {
            'id': id,
            'name': name,
            'required': False,
            'dataType': '',
            'privacyGroup': '',
            'anonymizationMethod': '',
            'dataCategoryList': dataCategoryList,
            'dataGroupList': dataGroupList,
            'head': head,
            'desc': desc
        }

        dataList.append(dataItem)
        id = id + 1
    return dataList