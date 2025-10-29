from aux_func import get_Desc
from aux_func import get_Headers

def create_legal_basis_list(legalBasisListXML):
    legalBasisItems = legalBasisListXML.findAll('item', recursive=False)
    legalBasisList = []
    for legalBasis in legalBasisItems:
        lbCategory = legalBasis.find('lbCategory').getText()
        header = legalBasis.find('head')
        head = get_Headers(header)
        description = legalBasis.find('desc')
        desc = get_Desc(description)
        legalBasisItem = {
            'lbCategory': lbCategory,
            'head': head,
            'desc': desc
        }
        legalBasisList.append(legalBasisItem)

    return legalBasisList
