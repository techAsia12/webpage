import requests
import time
import random

url = "https://webpage-fh3k.onrender.com/api/user/sentData"  

params = {
    'phoneno': '1212121212',  
    'MACadd': '00:52:22:01:23:45',  
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