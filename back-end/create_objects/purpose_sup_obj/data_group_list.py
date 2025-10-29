from aux_func import get_Headers, get_Desc

def create_data_group_list(dataGroupListXML):
    groups = dataGroupListXML.findAll('item', recursive=False)
    dataGroupList = []
    for group in groups:
        name = group.find('name').getText()

        header = group.find('head')
        head = get_Headers(header)
        description = group.find('desc')
        desc = get_Desc(description)
        dataGroupItem = {
            'name': name,
            'head': head,
            'desc': desc
        }
        dataGroupList.append(dataGroupItem)

    return dataGroupList

def create_data_group_list_from_dfd(dataGroupListXML):
    dataGroupList = []
    for group in dataGroupListXML:
        name = group.get('name')
        head = [{
            'lang': 'en',
            'value': name
        }]
        desct = group.get('description')
        if desct is None:
            desct = ''
        desc = [{
            'lang': 'en',
            'value': desct
        }]
        data = group.get('data')
        if data is None:
            data = ''
        dataGroupItem = {
            'data': data,
            'name': name,
            'head': head,
            'desc': desc
        }
        dataGroupList.append(dataGroupItem)

    return dataGroupList