import requests

url = "http://localhost:8000/api/user/send-message"  # Change to your actual server URL
payload = {
    "phone": "8591106362",  # Replace with the recipient's phone number
}
headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

if response.status_code == 200:
    print("Message sent successfully:", response.json())
else:
    print("Failed to send message:", response.status_code, response.text)
