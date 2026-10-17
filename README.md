# CareerCompass (SkillPath AI) ✦

AI guidance for your next career move. An explainable career navigation and skill-signal matching platform tailored for students and early-career software developers.

Live preview reference: [https://skillpath-ai-32.preview.emergentagent.com/](https://skillpath-ai-32.preview.emergentagent.com/)

---

## 🌟 Key Features

1. **Dashboard & Signal Overview**: Real-time signal calculation showing top career matches, skills mapped, roadmap progress, and ML demonstration confidence.
2. **Career Explorer**: Explainable role matching (Frontend Developer, Python Developer, Data Analyst, QA Tester) with transparent matched vs. missing skill breakdown.
3. **Skill Analysis**: Interactive donut visualizer and priority roadmap showing highest-impact skills to learn next.
4. **Resume Studio**: Live dual-pane resume editor with instant formatted A4 printable view, text export, and PDF download.
5. **Learning Roadmap**: Milestone-based sprint roadmap with streak tracking and actionable portfolio recommendations.
6. **Practice Lab (Mock Interview)**: Interactive interview simulation for entry-level engineering questions.
7. **Transparent ML Demo**: Dynamic classifier model demonstration comparing profile skill signals against industry benchmarks.

---

## 📂 Project Structure

```
skillpath-ai/
├── backend/
│   ├── app.py                # Flask production server (zero-install on your machine)
│   ├── main.py               # FastAPI alternative server
│   ├── requirements.txt      # Python dependencies
│   ├── profile.json          # Persistent user profile data
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html        # React HTML entry
│   ├── src/
│   │   ├── App.js            # Main React SPA application
│   │   ├── index.js          # React root mount
│   │   ├── App.css           # Core styling and theme tokens
│   │   └── index.css         # Typography, reset, and utilities
│   ├── package.json          # Node package definition
│   └── .env.example
├── static/                   # Production-ready pre-built static bundle
│   ├── index.html
│   └── static/js/bundle.js   # Client bundle with dynamic origin detection
├── Dockerfile                # Optional Docker container deployment
├── Procfile                  # Render / Heroku process declaration
├── render.yaml               # Render Blueprint for 1-click deploy
├── start.bat                 # 1-click Windows launcher
└── README.md
```

---

## 🚀 Running Locally on Your Computer

### Method 1: Instant Launch (Python — No Node required!)

Since Python is already installed on your computer, you can run the full app (Backend API + Interactive UI) immediately:

```bash
cd C:\Users\hp\.gemini\antigravity\scratch\skillpath-ai
python backend/app.py
```
Or simply double-click `start.bat`.

Then open your browser at:
👉 **[http://localhost:8000](http://localhost:8000)**

---

### Method 2: Development Mode (React + Flask / FastAPI)

If you have Node.js installed and want hot-reloading for React:

1. **Terminal 1 (Backend)**:
   ```bash
   cd backend
   python app.py
   # Runs on http://localhost:8000
   ```

2. **Terminal 2 (Frontend)**:
   ```bash
   cd frontend
   npm install
   npm start
   # Runs on http://localhost:3000
   ```

---

## 📦 How to Upload to GitHub

Follow these steps to upload the code to your GitHub account:

### Step 1: Create a new repository on GitHub
1. Go to [https://github.com/new](https://github.com/new).
2. Set the repository name to `careercompass` (or `skillpath-ai`).
3. Set visibility to **Public** (or **Private**).
4. **Leave "Initialize this repository with a README" unchecked**.
5. Click **Create repository**.

### Step 2: Push your local code
Open your terminal / command prompt and run:

```bash
cd C:\Users\hp\.gemini\antigravity\scratch\skillpath-ai

# Initialize git repository (if not already initialized)
git init
git add .
git commit -m "Initial commit: Complete CareerCompass AI application"

# Rename default branch to main
git branch -M main

# Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/risharavi/careercompass.git

# Push the code
git push -u origin main
```

*(If you are prompted for GitHub authentication, sign in with your GitHub account or use a Personal Access Token).*

---

## ☁️ How to Deploy on Render

Render can automatically build and host the application directly from your GitHub repository for free.

### Option A: Automatic 1-Click Blueprint Deploy (Recommended)

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** at the top right and select **Blueprint**.
3. Connect your GitHub account and select the `careercompass` repository.
4. Render will detect the `render.yaml` file in the repository root and auto-configure everything:
   - **Service Name**: `careercompass`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn --chdir backend app:app --bind 0.0.0.0:$PORT`
5. Click **Apply**.
6. In 1–2 minutes, Render will assign your application a live public URL (e.g., `https://careercompass-xxxx.onrender.com`).

---

### Option B: Manual Web Service Deploy

1. In your [Render Dashboard](https://dashboard.render.com/), click **New +** → **Web Service**.
2. Select your `careercompass` GitHub repository.
3. Configure the following fields:
   - **Name**: `careercompass` (or any name you prefer)
   - **Region**: Oregon (or nearest to you)
   - **Branch**: `main`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn --chdir backend app:app --bind 0.0.0.0:$PORT`
   - **Instance Type**: `Free`
4. Under **Advanced** → **Environment Variables**, add:
   - `PYTHON_VERSION` = `3.11.0`
   - `FLASK_ENV` = `production`
5. Click **Create Web Service**.
6. When deployment finishes, visit your live URL!

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api` | Service status check |
| `GET` | `/api/roles` | List all available career roles |
| `GET` | `/api/profile` | Fetch the current user profile |
| `POST` | `/api/profile` | Update and save user profile signals |
| `POST` | `/api/recommendations` | Compute match scores and explainable signals |
| `POST` | `/api/ml-demo` | Run machine learning classifier demonstration |

---

## 📄 License
MIT License. Created for career guidance and student skill acceleration.
