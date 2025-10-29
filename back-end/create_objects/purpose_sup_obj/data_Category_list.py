from aux_func import get_Desc
from aux_func import get_Headers

def create_data_Category_list(dataCategoryListXML):
    categories = dataCategoryListXML.findAll('item', recursive=False)
    dataCategoryList = []
    for category in categories:
        name = category.find('name').getText()

        header = category.find('head')
        head = get_Headers(header)
        description = category.find('desc')
        desc = get_Desc(description)
        dataCategoryItem = {
            'name': name,
            'head': head,
            'desc': desc
        }
        dataCategoryList.append(dataCategoryItem)

    return dataCategoryList