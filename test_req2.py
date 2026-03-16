import urllib.request
import json
import urllib.error

url = "http://localhost:8000/api/generate-course"
data = json.dumps({"topic": "React Hooks", "difficulty": "Beginner", "language": "English"}).encode('utf-8')
headers = {'Content-Type': 'application/json'}

req = urllib.request.Request(url, data=data, headers=headers)
try:
    response = urllib.request.urlopen(req)
    print("Success:")
    print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode('utf-8'))
except urllib.error.URLError as e:
    print(f"URLError: {e.reason}")
