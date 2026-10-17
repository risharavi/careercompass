import os
import json
import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

app = FastAPI(title="CareerCompass API", version="1.0")

# Enable CORS for local dev and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
STATIC_DIR = os.path.join(PROJECT_ROOT, "static")
PROFILE_FILE = os.path.join(BASE_DIR, "profile.json")

DEFAULT_PROFILE = {
    "id": "25b669b3-6ae8-4b54-8dbf-c89587160e6a",
    "name": "Alex Morgan",
    "headline": "Computer Science student",
    "education": "B.Tech Computer Science · 2026",
    "skills": ["Python", "HTML", "CSS", "JavaScript", "Communication"],
    "interests": ["Product building"],
    "projects": ["Campus Connect — React event discovery app"],
    "experience": "Open to internships and collaborative projects.",
    "resume": {},
    "updated_at": "2026-10-17T07:53:15.947889+00:00"
}

ROLES = [
    {
        "id": "frontend",
        "title": "Frontend Developer",
        "team": "Product Engineering",
        "description": "Turn ideas into fast, accessible interfaces that people love to use.",
        "skills": ["HTML", "CSS", "JavaScript", "React", "Git", "Responsive Design"],
        "signal": "Strong visual problem-solving and interface craft"
    },
    {
        "id": "python",
        "title": "Python Developer",
        "team": "Software Engineering",
        "description": "Build reliable automation, APIs, and products with a versatile language.",
        "skills": ["Python", "APIs", "Git", "SQL", "Testing", "Problem Solving"],
        "signal": "Structured thinking with a builder mindset"
    },
    {
        "id": "data",
        "title": "Data Analyst",
        "team": "Insights & Strategy",
        "description": "Translate messy data into decisions teams can act on with confidence.",
        "skills": ["Python", "SQL", "Excel", "Statistics", "Data Visualization", "Communication"],
        "signal": "Curiosity backed by analytical clarity"
    },
    {
        "id": "qa",
        "title": "QA Tester",
        "team": "Quality Engineering",
        "description": "Protect the user experience by finding issues before they reach customers.",
        "skills": ["Testing", "Bug Tracking", "SQL", "Git", "Communication", "Problem Solving"],
        "signal": "Detail orientation and calm investigation"
    }
]

class ProfileModel(BaseModel):
    name: Optional[str] = "Alex Morgan"
    headline: Optional[str] = "Computer Science student"
    education: Optional[str] = "B.Tech Computer Science · 2026"
    skills: Optional[List[str]] = Field(default_factory=list)
    interests: Optional[List[str]] = Field(default_factory=list)
    projects: Optional[List[str]] = Field(default_factory=list)
    experience: Optional[str] = ""
    resume: Optional[Dict[str, Any]] = Field(default_factory=dict)

def load_profile():
    if os.path.exists(PROFILE_FILE):
        try:
            with open(PROFILE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return DEFAULT_PROFILE.copy()

def save_profile(data):
    try:
        with open(PROFILE_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Error saving profile: {e}")

@app.get("/api")
def api_root():
    return {"message": "CareerCompass API ready", "version": "1.0"}

@app.get("/api/roles")
def get_roles():
    return ROLES

@app.get("/api/profile")
def get_profile():
    return load_profile()

@app.post("/api/profile")
def update_profile(profile_in: ProfileModel):
    current = load_profile()
    updated = {
        "id": current.get("id", str(uuid.uuid4())),
        "name": profile_in.name or current.get("name", "Alex Morgan"),
        "headline": profile_in.headline or current.get("headline", ""),
        "education": profile_in.education or current.get("education", ""),
        "skills": profile_in.skills if profile_in.skills is not None else current.get("skills", []),
        "interests": profile_in.interests if profile_in.interests is not None else current.get("interests", []),
        "projects": profile_in.projects if profile_in.projects is not None else current.get("projects", []),
        "experience": profile_in.experience if profile_in.experience is not None else current.get("experience", ""),
        "resume": profile_in.resume if profile_in.resume is not None else current.get("resume", {}),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    save_profile(updated)
    return updated

def compute_recommendations(user_skills: List[str]):
    norm_skills = {s.strip().lower() for s in user_skills if s and s.strip()}
    recommendations = []
    
    for role in ROLES:
        matched = []
        missing = []
        for s in role["skills"]:
            if s.strip().lower() in norm_skills:
                matched.append(s)
            else:
                missing.append(s)
        total = len(role["skills"])
        score = round((len(matched) / total) * 100) if total > 0 else 0
        
        recommendations.append({
            "id": role["id"],
            "title": role["title"],
            "team": role["team"],
            "description": role["description"],
            "skills": role["skills"],
            "signal": role["signal"],
            "matched": matched,
            "missing": missing,
            "score": score
        })
        
    recommendations.sort(key=lambda r: r["score"], reverse=True)
    return recommendations

@app.post("/api/recommendations")
def get_recommendations(profile_in: ProfileModel):
    recs = compute_recommendations(profile_in.skills or [])
    return {
        "recommendations": recs,
        "method": "Explainable rule-based baseline"
    }

@app.post("/api/ml-demo")
def ml_demo(profile_in: ProfileModel):
    recs = compute_recommendations(profile_in.skills or [])
    top = recs[0] if recs else {"title": "Frontend Developer", "score": 50}
    return {
        "predicted_role": top["title"],
        "confidence": top["score"],
        "model": "Sample logistic-style classifier demonstration",
        "disclaimer": "Demonstration on curated role examples; not a production-trained model."
    }

# SPA fallback routing
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=os.path.join(STATIC_DIR, "static")), name="static")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = os.path.join(STATIC_DIR, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(STATIC_DIR, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        return JSONResponse({"status": "Frontend build not found"}, status_code=404)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
