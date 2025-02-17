import requests
import time
import random

# URL of the API endpoint
url = "http://localhost:3000/api/user/sentData"  # Replace with the actual URL

# Parameters you want to send in the query
params = {
    'phoneno': '1234567890',  
    'MACadd': '00:14:22:01:23:43',  
}

while True:
    try:
        # Randomly generate voltage and current values
        voltage = random.randint(100, 240)  # Random voltage between 100V and 240V
        current = random.randint(1, 15)     # Random current between 1A and 15A
        
        # Update params with dynamic voltage and current
        params['voltage'] = voltage
        params['current'] = current

        print(voltage)
        print(current)
        # Send GET request to the API endpoint
        response = requests.get(url, params=params)

        # Check if the request was successful
        if response.status_code == 200:
            print(f"Success: {response.json()}")
        else:
            print(f"Failed with status code {response.status_code}: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

    # Wait for 5 seconds before sending the next request
    time.sleep(15)