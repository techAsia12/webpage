import requests
import time
import random

url = "http://localhost:8000/api/user/sentData"  

params = {
    'phoneno': '1212121212',  
    'MACadd': '00:52:22:01:23:45',  
}

while True:
    try:
        voltage = random.randint(100, 240)  
        current = random.randint(1, 15)     
        power_factor = random.randint(-1, 1)     
        
        params['voltage'] = voltage
        params['current'] = current
        params['power_factor'] = power_factor

        print(voltage)
        print(current)
        print(power_factor)
        response = requests.get(url, params=params)

        if response.status_code == 200:
            print(f"Success: {response.json()}")
        else:
            print(f"Failed with status code {response.status_code}: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

    time.sleep(15)