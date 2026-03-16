import asyncio
import google.generativeai as genai

async def test_fake_key():
    genai.configure(api_key="AIzaSy_FAKEKEYTHATDOESNTEXIST__123123")
    model = genai.GenerativeModel("gemini-1.5-flash")
    try:
        response = await model.generate_content_async("Hello")
        print("Success:", response.text)
    except Exception as e:
        print("Raw error string:")
        print(str(e))

asyncio.run(test_fake_key())
