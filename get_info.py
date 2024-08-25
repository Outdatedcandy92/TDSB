import requests
import os
import requests
from dotenv import load_dotenv
import json

load_dotenv()

url = "https://zappsmaprd.tdsb.on.ca/api/Account/GetUserInfo"

headers = {
    "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|False",
    "Authorization": "Bearer " + os.getenv("TOKEN")
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()
    student_info = data['SchoolCodeList'][0]['StudentInfo']
    
    print(f"Name: {student_info['FirstName']} {student_info['LastName']}")
    print(f"Current Grade: {student_info['CurrentGradeLevel']}")
    print(f"Gender: {student_info['Gender']}")
    print(f"Age: {student_info['Age']}")
    print(f"Birth Date: {student_info['BirthDate']}")



    with open("logs/get_info.json", "w") as file:
        json.dump(data, file, indent=4)
    print("JSON data stored in get_info.json")
else:
    print("Request failed with status code:", response.status_code)
    print("Response Text:", response.text)
    print("Response Headers:", response.headers)