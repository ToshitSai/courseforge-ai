import urllib.request
import json
import urllib.error

url = "https://courseforge-ai-backend.onrender.com/api/generate-course"
data = json.dumps({"topic": "React Hooks", "difficulty": "Beginner", "language": "English"}).encode('utf-8')
headers = {'Content-Type': 'application/json', 'Origin': 'https://courseforge-7m3a5zmmo-toshitsais-projects.vercel.app'}

req = urllib.request.Request(url, data=data, headers=headers)
try:
    response = urllib.request.urlopen(req)
    print("Success:")
    print(response.headers)
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print("HEADERS:")
    print(dict(e.headers))
    print(e.read().decode('utf-8'))
