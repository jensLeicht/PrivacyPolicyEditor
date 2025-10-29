from aux_func import get_head_prolog, get_desc_prolog
from prolog_parser.purposeElements.safeguard import get_sfg


def get_dr(drtem, drId, sfgId):
    name = drtem['name']
    authInfo = drtem['authInfo']
    classification = drtem['classification']
    type = drtem['type']

    required = str(drtem['required']).lower()
    pointOfAcceptance = drtem['pointOfAcceptance']
    if(pointOfAcceptance == ""):
       pointOfAcceptance = "[]"
    thirdCountryTransfer = str(drtem['thirdCountryTransfer']).lower()
    country = drtem['country']
    adequacyDecision = str(drtem['adequacyDecision']).lower()

    head = drtem['head']
    desc = drtem['desc']

    header = get_head_prolog(head)
    description = get_desc_prolog(desc)

    sfgList = '['
    safeguardList = drtem['safeguardList']
    sfgList = sfgList + get_sfg(safeguardList) + ']'

    item = 'dataRecipient(dr' + str(drId) + ',("' + \
           name + '","' + \
           classification + '","' + \
           authInfo + '","' + \
           type + '",' + \
           required + ',' + \
           pointOfAcceptance + ',' + \
           thirdCountryTransfer + ',"' + \
           country + '",' + \
           adequacyDecision + ',' + \
           header + ',' + description + ',' + \
           sfgList + ')).'

    res = item
    return (res, sfgList)