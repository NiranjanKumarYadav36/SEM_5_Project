# pip install ebird-api

from ebird.api import get_observations, get_taxonomy
import csv

api_key = "ak9ff6f8ea7q"

records = get_observations(api_key, 'IN-MH', back=30)


# with open("1.csv", 'w', encoding='utf-8') as file:
#     writer = csv.writer(file)
#
#     # write the header
#     writer.writerow(['Common Name', 'Scientific Name', 'Location Name', 'Observation Date',
#                      'How Many', 'Latitude', 'Longitude'])
#
#     # write the data
#     for record in records:
#
#         common_name = record.get('comName', '0')
#         scientific_name = record.get('sciName', '0')
#         location_name = record.get('locName', '0')
#         observation_date = record.get('obsDt', '0')
#         how_many = record.get('howMany', '1')
#         latitude = record.get('lat', '0')
#         longitude = record.get('lng', '0')
#
#         writer.writerow([common_name, scientific_name, location_name, observation_date, how_many, latitude, longitude])



