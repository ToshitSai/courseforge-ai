import sys
import codecs
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from course_generator import generate_course

load_dotenv()

app = FastAPI(
    title="AI Course Builder API",
    description="Generate structured courses with lessons, videos, and quizzes using AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CourseRequest(BaseModel):
    topic: str
    difficulty: str = "Beginner"  # Beginner, Intermediate, Advanced
    language: str = "English"

# Serve static assets from the React build
# app.mount("/assets", StaticFiles(directory="../frontend/dist/assets"), name="assets")

@app.post("/api/generate-course")
async def generate_course_endpoint(request: CourseRequest):
    if not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    
    if len(request.topic) > 200:
        raise HTTPException(status_code=400, detail="Topic is too long (max 200 characters)")

    try:
        course = await generate_course(request.topic, request.difficulty, request.language)
        return course
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        error_msg = str(e)
        if "404" in error_msg or "NotFound" in error_msg or "API version" in error_msg:
            raise HTTPException(status_code=401, detail="Invalid API Key or Gemini API is not enabled for this key.")
        raise HTTPException(status_code=500, detail=f"Course generation failed: {error_msg}")

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    dist_path = os.path.join("..", "frontend", "dist")
    file_path = os.path.join(dist_path, full_path)
    
    # Check if the requested file exists (like vite.svg, favicon, etc)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
        
    # Send all other requests to index.html to support React Router SPA routing
    return FileResponse(os.path.join(dist_path, "index.html"))
