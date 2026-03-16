import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")
if key:
    print(f"Local key starts with: {key[:10]}... ends with: {key[-5:]}")
    print(f"Total length: {len(key)}")
else:
    print("No key found locally")
