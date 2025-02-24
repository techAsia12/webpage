import requests
import time
import random

url = "http://localhost:8000/api/user/sentData"  

params = {
    'phoneno': '1234567890',  
    'MACadd': '00:14:22:01:23:43',  
}

while True:
    try:
        voltage = random.randint(100, 240)  
        current = random.randint(1, 15)     
        
        params['voltage'] = voltage
        params['current'] = current

        print(voltage)
        print(current)
        response = requests.get(url, params=params)

        if response.status_code == 200:
            print(f"Success: {response.json()}")
        else:
            print(f"Failed with status code {response.status_code}: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

    time.sleep(15)