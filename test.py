import requests

url = 'https://zappsmaprd.tdsb.on.ca/token'

payload = {
    'username': '',
    'password': '',
    'grant_type': 'password'
}

headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Client-App-Info': 'Android||2024Oct01120000P|False|1.2.6|False|306|',
    'Accept': 'application/json'
}

try:
    print('Sending request to:', url)
    response = requests.post(url, data=payload, headers=headers, verify=False)
    print('Request sent. Status code:', response.status_code)

    if not response.ok:
        print('Response not OK. Status code:', response.status_code)
        print('Response text:', response.text)
        raise Exception('Network response was not ok')

    data = response.json()
    print('Login successful', data)

    # Store access token in AsyncStorage
    # AsyncStorage.setItem('access_token', data['access_token'])
    print('Access token stored successfully')
    # setIsLoggedIn(True)
except Exception as error:
    print('Login failed', error)
    print('Error details:', {
        'message': str(error),
        'response': response.text if 'response' in locals() else 'No response'
    })