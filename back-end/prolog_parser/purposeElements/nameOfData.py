def get_name_of_data_list(allNameOfDataList, nameOfDataElement, nOdId):

    res = '['
    nOds = '['

    for nameOfData in nameOfDataElement:
        name = nameOfData['name']

        item = '"' + \
               name + '",'

        res = res + item

    res = res[:-1] + ']'

    return (res, nOdId, allNameOfDataList, nOds)