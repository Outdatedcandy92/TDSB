import requests
import json

#mmddyyyy
date = "09022024"

url = f"https://zappsmaprd.tdsb.on.ca/api/TimeTable/GetDayNameDayCycle/1013/09032024/Regular/09032024/09032024"
headers = {
    "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|False",
    "Authorization": "Bearer " + "xxxxMClHqiUT4SXH5sadas12sC1z3MP2tQm4YgVtJc1G17ejUlAlwysCBoE-T5jR_2tu7UNjYsbcpvzMcVS5ovz44jYMurbzxrwL9Boz-5ArdxaH4R_uyJJ7tDih5oV6hwmhTfjmbKswST_5PY_E2EkymCayDeJn6DkmuuJoxO2IhNEWeSNZNtN-XD6Q79UMWijmJE3TLszMnYSx0CfsTDyQBABHjKfVRS1Lm8hSyX6ORHQ-nkwyxWrgaB5_nQXuqGFcPnLwsiuXTOt-JeTbAAq5OaQmBBDRV7fquYiHYG7p0pm4M2sg6rt7KXSgH-jBLbQx5yWwQEgiBkysRdSGWz7cqmGQ9AD0piNDPBj84QiZYuHpuFg6hoEjYl3QDHDtACffH1U-SqY3kl0J-8rFuZZA_iu6gQXh91S0Atzh1H2DdCmkt2I1weBUnOiDkTdeNaRAPZJCxVUT9P-NidhD3Gy9FKyxbEyBmsyK6j9ipkaumdsB0ncp_km9uhTbBAKmbY-y3JxR-G0z4bZ9B1ZsrVqNPkbGlAMuuEh_RxDcXw4kmvDSYk7RS0kS5ZKO8AxjJyyjMhenlhn7dKYu6I5narHyq18B2CzexwO1mfLjgkFDyvd4kQs2gLJhlK9AlYTOXgEH7oIXwgSm1ZW_S-tIwOM42F-JulHUf5JNUEw1owdCOSKIk0YlQHb5W4prrKpPsGf7eXVkpdoLfz2mYATqHQfnNzXE_oAYyUj6lmyUjW_7fAZphG1yRC76370lJXTRg99n1NCwlmzkaeP44QLdHp20ZhpTaPraRdEXXZDua55wpjJ2iUC2q-kyij2Xf-E2rE6mgH4IHMO6Tr55eU6-kCsDbyGleAfX_7SDPD3tnnapdJgNhdfvE5vA_nuNsUz6IE66IxMlAuIkpgx7tDVWPb2QR-TyuLIvsx3UiTMFOWse5O-JdklNPCP6PjX4OwvQkjHo3QFlln0VLYwh9M0fo_Dus-JDg-FbTiICA5cBG172jej-3xKMD5ihiHtEV_p9TyShDFifCV-8LdjciPQRPr5MPzLwysxRQriYYA-fAJEdgtgLZBWedXnsRFVzBrZf6p2K8dKjnAxGUcVlIB6M7tVZAos61pEB1AAlBPf8Pd7bdG-_AXsFUS71Y4bxngrupBhGUVSsWTywROXsCKEBu4EunommOP45yFl9_v0jz184N2pJ44UP60DqMmWjvnIGJAAcilI6vHBrNeoSp7_rDgfqRtA6hK0q-IAJuYHJFGG7OLWC5-QTGg44PLvpaZZeo1r3yoI5omlOnGWcnzY0jLpC0vjWNll0YAC0w8XoFGntwfg_nDDnsEwA5ufCr4bF18_n2hH2SIqtAEy6O_ru6TdnfCWKFgxYAFmIVwlfzjwKPUVOLaZ7x3k1PXMvh1may80sEaizw37Z8hgwgimAKOWA7AfYuB5DEqoz5glpsjqfrW2z7Ng5zvFejTZ3PDA3PFV1T0Yh_CjZgB-PuSTtJdI6M_KVVP1MNJVrZyHHlCCuU5uMVYaHCgD2FkjwjNHuWKdrpLUDceeBIr-kF00shhuyc2CKOViqGZ78v5OchrX5yKRG34EIbGTXUcQskS46evnzAe1WUOf6oeWsGaIHtPQ8c0"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    print("Request successful!")
    print("Response content:")
    print(response.text)
    print(response.json())
    print(response)
    

    with open("logs/timetable.json", "w") as file:
        json.dump(response.json(), file, indent=4)
        
    print("Response stored in logs/timetable.json")
else:
    print("Request failed with status code:", response.status_code)