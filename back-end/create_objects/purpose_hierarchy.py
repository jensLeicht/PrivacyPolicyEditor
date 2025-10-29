def create_purpose_hierarchy(purposeHierarchy):
    purposeHierarchyElements = purposeHierarchy.findAll('item', recursive=False)
    elements = []

    for element in purposeHierarchyElements:
        superPurpose = element.find('superPurpose').getText()
        subPurpose = element.find('subPurpose').getText()
        
        tuple = {
            'superPurpose': superPurpose,
            'subPurpose': subPurpose
        }
        elements.append(tuple)
    return elements