import requests
import os
import requests
from dotenv import load_dotenv
import json
from urllib.parse import quote
from datetime import datetime

load_dotenv()

today = datetime.today()
formatted_date = today.strftime("%m/%d/%Y")
encoded_date = quote(formatted_date)

url = f"https://zappsmaprd.tdsb.on.ca/api/MyDay/Get/{os.getenv('SCHOOL_CODE')}/Date/{encoded_date}"



headers = {
    "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|False",
    "Authorization": "Bearer " + os.getenv("TOKEN")
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()
    print(data)

    with open("logs/get_my_day.json", "w") as file:
        json.dump(data, file, indent=4)
    print("JSON data stored in get_my_day.json")
else:
    print("Request failed with status code:", response.status_code)
    print("Response Text:", response.text)
    print("Response Headers:", response.headers)

    # with open("logs/get_my_day.json", "w") as file:
    #     json.dump(response.json(), file, indent=4)
    # print("JSON data stored in get_my_day.json")