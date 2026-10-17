import os
import json
import uuid
from datetime import datetime, timezone
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

# Base path for static files (production bundle or local fallback)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
STATIC_DIR = os.path.join(PROJECT_ROOT, "static")
PROFILE_FILE = os.path.join(BASE_DIR, "profile.json")

# Default Starter Profile
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

# Curated Entry-Level Roles Catalogue
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

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response

# Handle preflight OPTIONS requests for all endpoints
@app.route("/api/<path:path>", methods=["OPTIONS"])
def options_handler(path):
    return "", 204

@app.route("/api", methods=["GET"])
def api_root():
    return jsonify({
        "message": "CareerCompass API ready",
        "version": "1.0"
    })

@app.route("/api/roles", methods=["GET"])
def get_roles():
    return jsonify(ROLES)

@app.route("/api/profile", methods=["GET"])
def get_profile():
    profile = load_profile()
    return jsonify(profile)

@app.route("/api/profile", methods=["POST"])
def update_profile():
    payload = request.get_json(force=True, silent=True) or {}
    current = load_profile()
    
    # Merge updates
    updated = {
        "id": current.get("id", str(uuid.uuid4())),
        "name": payload.get("name", current.get("name", "Alex Morgan")),
        "headline": payload.get("headline", current.get("headline", "")),
        "education": payload.get("education", current.get("education", "")),
        "skills": payload.get("skills", current.get("skills", [])),
        "interests": payload.get("interests", current.get("interests", [])),
        "projects": payload.get("projects", current.get("projects", [])),
        "experience": payload.get("experience", current.get("experience", "")),
        "resume": payload.get("resume", current.get("resume", {})),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    save_profile(updated)
    return jsonify(updated)

def compute_recommendations(user_skills):
    # Normalize user skills (lowercase lookup set for matching)
    norm_user_skills = {s.strip().lower() for s in user_skills if s and s.strip()}
    recommendations = []
    
    for role in ROLES:
        matched = []
        missing = []
        for s in role["skills"]:
            if s.strip().lower() in norm_user_skills:
                matched.append(s)
            else:
                missing.append(s)
                
        total_skills = len(role["skills"])
        score = round((len(matched) / total_skills) * 100) if total_skills > 0 else 0
        
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
        
    # Sort recommendations by score descending
    recommendations.sort(key=lambda r: r["score"], reverse=True)
    return recommendations

@app.route("/api/recommendations", methods=["POST"])
def get_recommendations():
    payload = request.get_json(force=True, silent=True) or {}
    skills = payload.get("skills", [])
    recommendations = compute_recommendations(skills)
    return jsonify({
        "recommendations": recommendations,
        "method": "Explainable rule-based baseline"
    })

@app.route("/api/ml-demo", methods=["POST"])
def ml_demo():
    payload = request.get_json(force=True, silent=True) or {}
    skills = payload.get("skills", [])
    recommendations = compute_recommendations(skills)
    top = recommendations[0] if recommendations else {
        "title": "Frontend Developer",
        "score": 50
    }
    
    return jsonify({
        "predicted_role": top["title"],
        "confidence": top["score"],
        "model": "Sample logistic-style classifier demonstration",
        "disclaimer": "Demonstration on curated role examples; not a production-trained model."
    })

# Serve static files and SPA frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_spa(path):
    if not os.path.exists(STATIC_DIR):
        return jsonify({
            "status": "CareerCompass Backend Running",
            "frontend": "Frontend bundle not found in static/ directory. Build or place bundle in static/."
        }), 200
        
    file_path = os.path.join(STATIC_DIR, path)
    if path and os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(STATIC_DIR, path)
    return send_from_directory(STATIC_DIR, "index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting CareerCompass backend on http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
