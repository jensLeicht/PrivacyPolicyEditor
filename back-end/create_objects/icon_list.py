from aux_func import get_Desc
from aux_func import get_Headers

def create_icon_list(iconListXML):
    icons = iconListXML.findAll('icon')
    iconsList = []
    for icon in icons:
        name = icon.find('name').getText()
        header = icon.find('head')
        head = get_Headers(header)
        description = icon.find('desc')
        desc = get_Desc(description)
        iconItem = {
            'name': name,
            'head': head,
            'desc': desc
        }
        iconObj = {
            'icon': iconItem
        }
        iconsList.append(iconObj)
    return iconsList