def createPurposeHierarchy(obj, purposeIdMapping):
    hierarchy = '['

    for tup in obj:
        superPurpose = tup['superPurpose']
        subPurpose = tup['subPurpose']

        tuple = '('

        for elem in purposeIdMapping:
            if elem[0] == superPurpose:
                tuple = tuple + 'p' + str(elem[1])
                break
        
        if tuple == '(':
            tuple = tuple + superPurpose

        for elem in purposeIdMapping:
            if elem[0] == subPurpose:
                tuple = tuple + ',p' + str(elem[1]) + '),'
    
        hierarchy = hierarchy + tuple
    if hierarchy != '[':
        hierarchy = hierarchy[:-1] + ']'
    else:
        hierarchy = hierarchy + ']'

    return hierarchy