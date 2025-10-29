from aux_func import get_head_prolog, get_desc_prolog

def createLodgeComplaintPart(d, lcId):
       name = d['name']
       classification = d['classification']
       authInfo = d['authInfo']
       type = d['type']
       firstName = d['firstName']
       lastName = d['lastName']
       address = d['address']
       phoneNumber = d['phoneNumber']
       email = d['email']
       head = d['head']
       desc = d['desc']

       header = get_head_prolog(head)
       description = get_desc_prolog(desc)

       delimiter = '","'
       item = 'supervisoryAuthority(sa' + str(lcId) + ',("' + \
              name + delimiter + \
              classification + delimiter + \
              authInfo + delimiter + \
              type + delimiter + \
              firstName + delimiter + \
              lastName + delimiter + \
              address + delimiter + \
              phoneNumber + delimiter + \
              email + '",' + header + ',' + description + ')).\n'
       return item