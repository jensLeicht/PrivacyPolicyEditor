from datapackage import Package
import json

# def get_country_codes():
#     package = Package('https://datahub.io/core/country-list/datapackage.json')
#     for resource in package.resources:
#         if resource.descriptor['datahub']['type'] == 'derived/csv':
#             return resource.read()

#     return []

def load_country_code_from_json():
    json_file = open("country_code.json")
    variables = json.load(json_file)
    json_file.close()
    return variables