def create_data_source_obj(dataSourceXML):
    publicAvailable = dataSourceXML.find('publicAvailable').getText()
    name = dataSourceXML.find('name').getText()
    authInfo = dataSourceXML.find('authInfo').getText()
    classification = dataSourceXML.find('classification').getText()
    type = dataSourceXML.find('type').getText()
    dataSourceObj = {
        'publicAvailable': publicAvailable,
        'name': name,
        'authInfo': authInfo,
        'classification': classification,
        'type': type
    }
    return dataSourceObj