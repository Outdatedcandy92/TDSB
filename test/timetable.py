import requests
import json

#ddmmyyyy
date = "06092024"

url = f"https://zappsmaprd.tdsb.on.ca/api/TimeTable/GetTimeTable/Student/1013/{date}"
headers = {
    "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|False",
    "Authorization": "Bearer " + "x"
}
response = requests.get(url, headers=headers)

if response.status_code == 200:
    print("Request successful!")
    print("Response content:")
    print(response.text)
    print(response.json())
    print(response)
    

    # with open("logs/timetable.json", "w") as file:
    #     json.dump(response.json(), file, indent=4)
        
    print("Response stored in logs/timetable.json")
else:
    print("Request failed with status code:", response.status_code)