import requests
import pandas as pd

url = "https://api.ebird.org/v2/data/obs/IN-MH/recent"

payload = {}
headers = {
    'X-eBirdApiToken': 'ak9ff6f8ea7q'
}

response = requests.request("GET", url, headers=headers, data=payload)

data = response.json()
print(type(data))

for d in data:
    CommonName = d['comName']
    # ScientificName = d['sciName']
    # LocationName = d['locName']
    # ObservedDate = d['obsDt']
    count = d['howMany']
#     latitude = d['lat']
    # longitude = d['lng']
    # print(CommonName, ScientificName, LocationName,ObservedDate,latitude,longitude)
    print(count)
# if isinstance(data, list):
#     df = pd.DataFrame(data)
#     df.to_csv('ebird_data.csv', index=False)
#     print("Data saved to ebird_data.csv")
# else:
#     print("No data available or response format is not as expected.")

