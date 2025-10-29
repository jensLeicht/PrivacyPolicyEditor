def get_Headers(headersXML):
    headers = headersXML.findAll('item')
    headerList = []
    for header in headers:
        lang = header.find('lang').getText()
        value = header.find('value').getText()
        headerObj = {
            'lang': lang,
            'value': value
        }
        headerList.append(headerObj)
    return headerList


def get_Desc(descriptionsXML):
    descriptions = descriptionsXML.findAll('item')
    descList = []
    for desc in descriptions:
        lang = desc.find('lang').getText()
        value = desc.find('value').getText()
        descObj = {
            'lang': lang,
            'value': value
        }
        descList.append(descObj)
    return descList

def get_head_prolog(head):
    header = '['
    if len(head) == 0:
        header = header + ']'
    else:
        for h in head:
            lang = h['lang']
            value = h['value']
            item = '("' + lang + '","' + value + '")'
            header = header + item + ','
        header = header[:-1] + ']'
    return header

def get_desc_prolog(desc):
    desct = '['
    if len(desc) == 0:
        desct = desct + ']'
    else:
        for h in desc:
            lang = h['lang']
            value = h['value']
            item = '("' + lang + '","' + value + '")'
            desct = desct + item + ','
        desct = desct[:-1] + ']'
    return desct

def get_underlying_lpps(lppList, policy_id):
    underlying_lpps = []
    for lpp in lppList:
        if lpp['parentId'] == policy_id:
            underlying_lpps.append(lpp['id'])
    return underlying_lpps

def get_underlying_lpps_list(lppList, policy_id):
    # lpps_list = get_underlying_lpps(lppList, policy_id)
    # res = ''
    # if len(lpps_list) == 0:
    # res = ('lpp(upp1,[]).\n','upp1')
    # else:
    #     for element in lpps_list:
    #         res = res + 'lpp' + str(element) + ','
    #     res = res[:-1] + ''
    return  ('lpp(upp1,[]).','upp1')