import os
import json
import re
import asyncio
from typing import Optional
from dotenv import load_dotenv
from youtube_service import search_youtube_video

def get_gemini_api_key():
    from dotenv import load_dotenv
    load_dotenv()
    return os.getenv("GEMINI_API_KEY")

# ─────────────────────────────────────────────
# SYSTEM PROMPT: Ensures consistent JSON output
# ─────────────────────────────────────────────
SYSTEM_PROMPT = """You are an expert curriculum designer and educator. Your role is to create 
comprehensive, engaging, and well-structured online courses. You MUST always respond with valid 
JSON only — no markdown, no code fences, no extra text before or after the JSON.

When creating a course, follow these strict rules:
1. Always generate exactly 4 lessons.
2. Each lesson must have a clear title, concise explanation (50-80 words), key learning 
   objectives, and a YouTube search query for finding a relevant video.
3. Always generate exactly 3 multiple-choice quiz questions per lesson.
4. Each quiz question must have exactly 4 options (A, B, C, D) and one correct answer.
5. Explanations should be educational, clear, and suitable for the specified difficulty level.
6. Use examples and analogies but keep them brief.
7. Generate exactly 2 key terms per lesson.
8. Keep all text extremely concise to avoid exceeding output length limits.
9. Your entire response must be valid, parseable JSON matching the exact schema provided.

Output ONLY valid JSON in exactly this structure:
{
  "courseTitle": "string",
  "topic": "string", 
  "difficulty": "string",
  "description": "string (2-3 sentences overview)",
  "estimatedDuration": "string (e.g., '4-6 hours')",
  "prerequisites": ["string"],
  "lessons": [
    {
      "lessonNumber": 1,
      "title": "string",
      "objectives": ["string", "string", "string"],
      "explanation": "string (50-80 word explanation)",
      "keyTerms": [{"term": "string", "definition": "string"}],
      "youtubeQuery": "string (search query for YouTube)",
      "quiz": [
        {
          "questionNumber": 1,
          "question": "string",
          "options": {
            "A": "string",
            "B": "string", 
            "C": "string",
            "D": "string"
          },
          "correctAnswer": "A",
          "explanation": "string (why this answer is correct)"
        }
      ]
    }
  ]
}"""

USER_PROMPT_TEMPLATE = """Create a complete 4-lesson course on the topic: "{topic}"

Difficulty Level: {difficulty}
Language: {language}

Requirements:
- Course title should be engaging and professional
- Each lesson should build upon the previous one
- Explanations should be concise and educational (~50-80 words each)
- Quiz questions should test understanding, not just memorization
- The youtubeQuery field should be a specific search phrase to find the best tutorial video
- IMPORTANT: All the generated text content (titles, explanations, quiz questions, options, etc.) MUST be written in {language}. The youtubeQuery should also be configured to find videos in {language} if possible.

Return ONLY the JSON, no other text."""


async def generate_with_gemini(prompt: str) -> str:
    """Call Google Gemini API using the official Python SDK."""
    import google.generativeai as genai
    
    api_key = get_gemini_api_key()
    if not api_key or api_key == "your_google_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY is not configured. Please set it in your .env file.")
    
    genai.configure(api_key=api_key)
    
    models_to_try = [
        "gemini-flash-latest",
        "gemini-2.5-flash-lite",
        "gemini-flash-lite-latest",
        "gemini-2.5-flash",
        "models/gemini-2.5-flash"
    ]
    
    last_error = None
    for model_name in models_to_try:
        try:
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=SYSTEM_PROMPT,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "max_output_tokens": 8192,
                    "response_mime_type": "application/json"
                }
            )
            response = await model.generate_content_async(prompt)
            if not response.text:
                 raise Exception("Empty response from Gemini")
            return response.text
        except Exception as e:
            error_str = str(e)
            if "404" in error_str or "NotFound" in error_str or "not found" in error_str.lower():
                last_error = e
                continue
            # If the API key is truly invalid (401), fail fast
            if "API_KEY_INVALID" in error_str or "API key not valid" in error_str.lower():
                raise
            last_error = e
            
    raise Exception(f"Failed with all Gemini models. Last error: {last_error}")


def parse_course_json(raw_text: str) -> dict:
    """Parse and validate the course JSON from LLM response."""
    # Remove markdown code fences if present
    text = raw_text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\n?", "", text)
        text = re.sub(r"\n?```$", "", text)
    
    print(f"DEBUG LLM TEXT SIZE: {len(text)}")
    with open("debug_output.json", "w", encoding="utf-8") as f:
        f.write(text)
    
    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        print(f"Standard JSON decode failed: {e}. Attempting robust repair...")
        # Try to repair the JSON if it got truncated from hitting max output tokens
        try:
            import json_repair
            data = json_repair.repair_json(text, return_objects=True)
            if not isinstance(data, dict):
                raise ValueError("Repaired JSON did not yield a dictionary structure")
        except Exception as repair_err:
            raise ValueError(f"Could not parse or repair JSON from AI response. Decode error: {e}. Repair error: {repair_err}")
    
    # Validate required fields
    required_fields = ["courseTitle", "lessons"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    if len(data.get("lessons", [])) == 0:
        raise ValueError("Course must have at least one lesson")
    
    return data


async def generate_course(topic: str, difficulty: str = "Beginner", language: str = "English") -> dict:
    """
    Main course generation function.
    1. Calls LLM to generate course structure + content
    2. Enriches each lesson with a real YouTube video
    3. Returns the complete course object
    """
    print(f"Generating course | Difficulty: {difficulty} | Language: {language}")
    
    # Step 1: Generate course content via LLM
    user_prompt = USER_PROMPT_TEMPLATE.format(topic=topic, difficulty=difficulty, language=language)
    
    raw_response = await generate_with_gemini(user_prompt)
    course_data = parse_course_json(raw_response)
    
    print(f"Course generated successfully with {len(course_data['lessons'])} lessons")
    
    # Step 2: Fetch YouTube videos for each lesson concurrently
    async def enrich_lesson(lesson: dict) -> dict:
        youtube_query = lesson.get("youtubeQuery", f"{topic} {lesson.get('title', '')}")
        video = await search_youtube_video(topic, youtube_query, language)
        lesson["video"] = video
        return lesson
    
    enriched_lessons = await asyncio.gather(
        *[enrich_lesson(lesson) for lesson in course_data["lessons"]]
    )
    course_data["lessons"] = list(enriched_lessons)
    
    print(f"Course enrichment complete. Returning course data.")
    return course_data
