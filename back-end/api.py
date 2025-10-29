from flask import Flask, request
from flask_cors import CORS

from country_list_endpoint import load_country_code_from_json
from language_list_endpoint import load_language_code_from_json
from transformer import transform_dfd2json, transform_json2prolog_compatibility, transform_json2xml, transform_json2prolog
from transformer import transform_xml2json
from prolog import queryPrologCompatibilityJSON, queryPrologJSON, queryPrologText
from jsonizer import convertPolicyToJSON
import json

api = Flask(__name__)
CORS(api)

@api.route('/')
def hello_world():
    return 'Hello World!'

@api.route("/saveJSON", methods=["POST"])
def saveJSON_file():
    obj = json.loads(request.data)
    policy = convertPolicyToJSON(obj)
    return json.dumps(policy, indent=4), 200

@api.route("/save", methods=["POST"])
def save_file():
    obj = json.loads(request.data)
    res = transform_json2xml(obj)
    return res, 200

@api.route("/saveAsProlog", methods=["POST"])
def save_prolog_file():
    input = request.data.replace(b"\\\\",b"\\\\\\\\")
    input2 = input.replace(b"\\n",b" ")
    obj = json.loads(input2)
    res = transform_json2prolog_compatibility(obj)
    return res, 200

@api.route("/saveAsText", methods=["POST"])
def save_text_file():
    input = request.data.replace(b"\\\\",b"\\\\\\\\")
    input2 = input.replace(b"\\n",b" ")
    # TODO textual privacy policy patterns
    # obj = json.loads(input2)
    # res = transform_json2prolog(obj)
    return input2, 200

# prologResponse
@api.route("/gdprCompliance", methods=["POST"])
def save_prolog_response():
    input = request.data.replace(b"\\\\",b"\\\\\\\\")
    input2 = input.replace(b"\\n",b" ")
    obj = json.loads(input2)
    res = ''.join(str(e) for e in queryPrologText(obj))
    return res, 200

#gdprComplianceJSON
@api.route("/gdprComplianceJSON", methods=["POST"])
def get_prolog_response_json():
    input = request.data.replace(b"\\\\",b"\\\\\\\\")
    input2 = input.replace(b"\\n",b" ")
    obj = json.loads(input2)
    res = queryPrologJSON(obj)
    return res, 200

#compatibility
@api.route("/compatibility", methods=["POST"])
def get_prolog_compatibilty_response_json():
    input = request.data.replace(b"\\\\",b"\\\\\\\\")
    input2 = input.replace(b"\\n",b" ")
    obj = json.loads(input2)
    res = queryPrologCompatibilityJSON(obj)
    return res, 200

@api.route("/upload", methods=["POST"])
def upload_file():
    data = request.data.decode('utf-8')
    res = transform_xml2json(data, False)
    return json.dumps(res), 200

@api.route("/uploadDFD", methods=["POST"])
def upload_DFD():
    data = request.data.decode('utf-8')
    res = transform_dfd2json(data, False)
    return json.dumps(res), 200

@api.route("/countryCode", methods=["GET"])
def get_country_code_list():
    res = load_country_code_from_json()
    return json.dumps(res), 200

@api.route("/languageCode", methods=["GET"])
def get_language_code_list():
    res = load_language_code_from_json()
    return json.dumps(res), 200

if __name__ == "__main__":
    # from waitress import serve
    # serve(api, host="0.0.0.0", port=5002)
    api.run(host='0.0.0.0', port=5002)