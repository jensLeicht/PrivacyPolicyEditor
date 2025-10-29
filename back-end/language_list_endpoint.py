from datapackage import Package
import json

def load_language_code_from_json():
    json_file = open("language_code.json")
    variables = json.load(json_file)
    json_file.close()
    return variables