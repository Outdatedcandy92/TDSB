import requests
import os

url = "https://zappsmaprd.tdsb.on.ca/token"
data = {
    "username": os.getenv("STUDENT_NUMBER"),
    "password": os.getenv("STUDENT_PASS"),
    "grant_type": "password"
}

headers = {
    "Content-Type": "x-www-form-urlencoded",
    "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|False",
    "Accept": "application/json"
}

response = requests.post(url, data=data, headers=headers)

if response.status_code == 200:
    print("Request successful!")
    print("Response:", response.json())
    access_token = response.json().get("access_token")
    if access_token:
        with open(".env", "w") as file:
            file.write(f"TOKEN={access_token}")
        print("Access token stored in access_token.txt")
    else:
        print("Access token not found in response")
else:
    print("Request failed with status code:", response.status_code)
    #print("Response Text:", response.text)
    print("Response Headers:", response.headers)
