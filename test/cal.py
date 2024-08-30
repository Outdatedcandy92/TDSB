import requests
import json

#mmddyyyy
date = "09022024"
token = "axxtGBPU-XWULZTtAHz4WR56dKHILmGLQgB6x-KlntNA_7FYG_RPtqhrG5rXKTUwsBzbO3qtFy72EvSirXTg4yg-EkqaVTcRp2hkDujDIrcxYSpn9lIWlaqaeL91sMKqmKOviOd1q0jI-aITek9LHabXKOF_kv1YBpLMsJa1FShZJUebeDrFEE7phvZO8gKGw9mld9dzkOnbdMR-2Zs7HRxKeB9ahevae42Nc0SnaYC2LNLyZYHx5DNqYUCVujXY7fLs0fGKLCJRatmrTG3oYsCAi7R1CbOLzNE-DkhtYIin6PcQ-XwPBXwVsu3RpwmDF9XczXSZjBb5ad09LZjNLMuwDX1JVRvSIwcfCHgNFZbeBijdZ6Yd0DP2guScDsus0RYCh3KqfT0DNBAmZ6BAqhee6F5xCNZhHYKNHSYEJZYNPUIQrDUWWNBHrbGuVv9X7bLJMpslzyjvw5AOmSk1BMRipb9tq_LhdTGLF1OYIQ5_3tn_9z4l8mcZu2buqsssff61d2ivyftHkEYh1oMJQZ6c963j2Ox-qeiQuHJOTalV9AncUILR7kSnDGkUuCFOokZAsm8eWBqQ6-hbvxOEbehQqFMnf7Even0N44WHB6hQ1hWgo2eDw22kL9H7AxXKzkz58euhW5jWNU4HgW6MXy9fHVxOewQRO0BexXDohenxVBLvzZ2G4L8px97GO9Y8iFrsNNVFDdVRJ9Y0uS_YzhNrMZyAScXvn16jG2x33eTUAEsCGgn48NlND5S2bQRKh66T_zHHVGrCKjl53ZJwO2QMT0f3dOwCVpWJLZXBkWaW4wrffYGzbUP0apsG3DE7M0rbSmPDGbNrB2FpdLxo3mUeJ_af91nidBhC6EA3ihvOrmODSgMYnmJTvVdWJLkIx-grOwm5LFXQDuHBeJ6h8dwkxt7EkDIEHbHl2J7BQkN5p9U4LWkUw9DvzEBx3SO-W9mOoJaSidCUa18IuFZriXEJnY8ohhhkKY-SS1tioZzXKGChiHc7FwZbPNV4D16Amqr61vsn57GayqhuDsfDqkS7GP3-Fgdtb0Xy4Uum3kVskpj-vszgE7c_bBMNGLd-dkfO7hcPp5K5z9qG92h_pJrS1EKLIYXe2-gXM0cS-yjjo82EncPVMMzzHCrXMaV_pMC_oOI99Q92Ook15HnGSTiUey_RmFRj5otKkZujnchQruDtKIaDoYAlwUntCp2aZWKMJ-EDXrTODKOToJec103JbXQT3h568645cCn1ZJcQkb8qhMvS5vLOgBWBdrAB3UgN1VINGdI-5wu732W_o-e_26anDeiJpbKzsPGHVnY3683DjPM4euWuZ9w7eJittkf6y9LeJP-4cpLK4PkTjZF7D2A9fM2QUS3YNLXmDXmu2acBCZBYHbdjslcAnsEABUIROfEBaTr1eGdlmlzytVV7pvoDASjQNeQoSPGMrTP77oQq2vAZ245vTubE5TeCL_5Tj6pkVgv6HcMPOncaTaUF6EQSmqDGiCyWcUy0ceMPvLW0_qtvERv2QoTc_FfGoU3aEr1Xno2PtZjEahf6W_V1KPPX7dhxckKy4OD-GnqPv60oOPGxUWYAatAQSch2ldvRW7I4Rjya1mwtc"
url = f"https://zappsmaprd.tdsb.on.ca/api/GoogleCalendar/GetEvents/1013?timeMin=09%2F01%2F2024%2000%3A00%3A00&timeMax=09%2F30%2F2024%2023%3A59%3A59"
headers = {
    "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|False",
    "Authorization": f"Bearer {token}"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    print("Request successful!")
    print("Response content:")
    print(response.text)
    print(response.json())
    print(response)
    

    with open("calendar.json", "w") as file:
        json.dump(response.json(), file, indent=4)
        
    print("Response stored in logs/calendar.json")
else:
    print("Request failed with status code:", response.status_code)