import requests
import os
import requests
from dotenv import load_dotenv
import json

load_dotenv()

url = f"https://zappsmaprd.tdsb.on.ca/api/TimeTable/GetHolidays/{os.getenv('SCHOOL_CODE')}"

headers = {
    "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|False",
    "Authorization": "Bearer " + os.getenv("TOKEN")
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()
    print("Request successful!")
    print("Response:", data)

    with open("logs/get_holidays.json", "w") as file:
        json.dump(data, file, indent=4)
    print("JSON data stored in get_holidays.json")
else:
    print("Request failed with status code:", response.status_code)
    print("Response Text:", response.text)
    print("Response Headers:", response.headers)