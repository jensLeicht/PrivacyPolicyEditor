from numpy import size
from transformer import transform_json2prolog, transform_json2prolog_compatibility
from prolog_parser.purposeHierarchy import createPurposeHierarchy
from aux_func import get_underlying_lpps_list
from prolog_parser.basic_info import createBasicPart
from prolog_parser.controller import createControllerPart
from prolog_parser.dpo import createDPOPart
from prolog_parser.dsr import createDSRPart
from prolog_parser.icons import createIconsPart
from prolog_parser.lodgeComplaint import createLodgeComplaintPart
from prolog_parser.purposeElements.data import get_data
from prolog_parser.purposes import createPurposesData
from pyswip import Prolog

def statements(s: str):
    last = ""
    for _s in s.splitlines(keepends=False):
        _s = _s.rstrip()
        if not _s: continue
        if _s.endswith("."):
            last += _s[:-1]
            yield last
            last = ""
        else:
            last += _s
            last += " "
    if last:
        yield last

def consultString(prolog: Prolog, s: str):
    for ass in statements(s):
        #print(f"---------\n{ass}")
        prolog.assertz(ass)

def retractString(prolog: Prolog, s: str):
    for ass in statements(s):
        #print(f"---------\n{ass}")
        prolog.retract(ass)

def queryPrologText(input):
    policy = transform_json2prolog_compatibility(input)
    prolog = Prolog()
    prolog.consult("./prolog/pripocog.pl")
    consultString(prolog,policy)
    res = list(prolog.query("with_output_to(atom(Result),main)"))
    retractString(prolog,policy)
    list(prolog.query("unload_file('./prolog/pripocog.pl')"))
    if len(res) > 0:
        if (str(res[0]['Result']).__contains__(":\nend")):
            return 'No compliance issues detected.'
        else:
            return res[0]['Result']
    return 'Error during compliance check!'

def queryPrologJSON(input):
    policy = transform_json2prolog_compatibility(input)
    prolog = Prolog()
    prolog.consult("./prolog/pripocog.pl")
    consultString(prolog,policy)
    res = list(prolog.query("with_output_to(atom(Result),main)"))
    retractString(prolog,policy)
    list(prolog.query("unload_file('./prolog/pripocog.pl')"))
    if len(res) > 0:
        if (str(res[0]['Result']).__contains__(":\nend") | (str(res[0]['Result']).__contains__("DPO may") & str(res[0]['Result']).__contains__("details.\nend"))):
            return {"result": "compliant"}
        else:
            return {"result": "not compliant"}
    return {"result": "error"}

def queryPrologCompatibilityJSON(input):
    policy = transform_json2prolog_compatibility(input)
    prolog = Prolog()
    prolog.consult("./prolog/pripocog_compatibility.pl")
    consultString(prolog,policy)
    res = list(prolog.query("with_output_to(atom(Result),main)"))
    retractString(prolog,policy)
    list(prolog.query("unload_file('./prolog/pripocog_compatibility.pl')"))
    if len(res) > 0:
        return convertCompatibilityToJSON(res[0]['Result'])
    return {}

def convertCompatibilityToJSON(result):
    json = ""
    if (result != ""):
        listOfErrors = str(result).split("|")
        listOfErrors.reverse()
        listOfErrors.pop()
        json = "{\"errors\":["
        for e in listOfErrors:
            json += "{"
            json += e
            json += "},"
        json = json[:-1]
        json += "]}"
    return json