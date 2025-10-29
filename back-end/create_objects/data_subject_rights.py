from aux_func import get_Desc
from aux_func import get_Headers

def create_data_sub_right_list(dataSubjectRightListXML):
    dataSubjectRights = dataSubjectRightListXML.findAll('item', recursive=False)
    dataSubjectRightsList = []
    for ataSubjectRight in dataSubjectRights:
        name = ataSubjectRight.find('name').getText()
        header = ataSubjectRight.find('head')
        head = get_Headers(header)
        description = ataSubjectRight.find('desc')
        desc = get_Desc(description)
        dataSubjectRightItem = {
            'name': name,
            'head': head,
            'desc': desc
        }
        dataSubjectRightsList.append(dataSubjectRightItem)
    return dataSubjectRightsList