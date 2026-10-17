import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileText,
  Gauge,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Save,
  Send,
  Sparkles,
  Target,
  X
} from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL
  ? `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, "")}/api`
  : "/api";

const starter = {
  name: "Alex Morgan",
  headline: "Computer Science student",
  education: "B.Tech Computer Science · 2026",
  skills: ["Python", "HTML", "CSS", "JavaScript", "Communication"],
  interests: ["Product building"],
  projects: ["Campus Connect — React event discovery app"],
  experience: "Open to internships and collaborative projects."
};

const nav = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "explorer", label: "Career explorer", icon: BriefcaseBusiness },
  { id: "skills", label: "Skill analysis", icon: BarChart3 },
  { id: "resume", label: "Resume studio", icon: FileText },
  { id: "roadmap", label: "Learning roadmap", icon: BookOpen },
  { id: "interview", label: "Mock interview", icon: MessageCircle }
];

const fallback = (skills = []) => [
  {
    title: "Frontend Developer",
    team: "Product Engineering",
    description: "Turn ideas into fast, accessible interfaces.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git", "Responsive Design"],
    matched: (skills || []).filter((s) =>
      ["HTML", "CSS", "JavaScript", "React", "Git", "Responsive Design"].includes(s)
    ),
    missing: ["React", "Git", "Responsive Design"].filter(
      (s) => !(skills || []).includes(s)
    ),
    score: Math.round(
      ((skills || []).filter((s) =>
        ["HTML", "CSS", "JavaScript", "React", "Git", "Responsive Design"].includes(s)
      ).length /
        6) *
        100
    )
  },
  {
    title: "Python Developer",
    team: "Software Engineering",
    description: "Build reliable automation, APIs, and products.",
    skills: ["Python", "APIs", "Git", "SQL", "Testing", "Problem Solving"],
    matched: (skills || []).filter((s) =>
      ["Python", "APIs", "Git", "SQL", "Testing", "Problem Solving"].includes(s)
    ),
    missing: ["APIs", "Git", "SQL", "Testing", "Problem Solving"].filter(
      (s) => !(skills || []).includes(s)
    ),
    score: Math.round(
      ((skills || []).filter((s) =>
        ["Python", "APIs", "Git", "SQL", "Testing", "Problem Solving"].includes(s)
      ).length /
        6) *
        100
    )
  }
];

function Title({ eyebrow, title, sub, action }) {
  return (
    <div className="page-title">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1 data-testid="page-title">{title}</h1>
        <p>{sub}</p>
      </div>
      {action}
    </div>
  );
}

function RoleRow({ role, rank }) {
  return (
    <div className="role-row" data-testid={`role-row-${rank}`}>
      <div className="role-rank">0{rank}</div>
      <div className="role-info">
        <b>{role.title}</b>
        <span>{role.team}</span>
      </div>
      <div className="role-score">
        <strong>{role.score}%</strong>
        <span>match</span>
      </div>
      <div className="mini-progress">
        <i style={{ width: `${role.score}%` }} />
      </div>
      <ChevronRight size={16} />
    </div>
  );
}

function Dashboard({ profile, recs, ml, setActive }) {
  const safeRecs =
    Array.isArray(recs) && recs.length > 0
      ? recs
      : fallback(profile?.skills || starter.skills);
  const top = safeRecs[0];

  return (
    <>
      <Title
        eyebrow="MONDAY, 14 OCTOBER 2024"
        title={
          <>
            Good morning, {(profile?.name || "Alex").split(" ")[0]}{" "}
            <span className="wave">✦</span>
          </>
        }
        sub="Your next meaningful career move starts with a clear signal."
        action={
          <button
            className="primary-btn"
            onClick={() => setActive("explorer")}
            data-testid="explore-careers-button"
          >
            <Target size={16} /> Explore careers <ArrowUpRight size={16} />
          </button>
        }
      />
      <section className="hero-strip">
        <div>
          <span className="chip blue">PROFILE SIGNAL</span>
          <h2>
            You’re building a strong
            <br />
            <em>builder’s foundation.</em>
          </h2>
          <p>
            Your current profile points towards roles where curiosity and practical craft create momentum.
          </p>
          <button
            className="text-btn"
            onClick={() => setActive("skills")}
            data-testid="view-skill-analysis-button"
          >
            See your skill signal <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="hero-graphic">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-core">
            <Sparkles size={28} />
            <span>
              AI
              <br />
              SIGNAL
            </span>
          </div>
          <div className="signal-pill p1">{top.score}% match</div>
          <div className="signal-pill p2">
            {(profile?.skills || []).length} skills
          </div>
          <div className="signal-pill p3">{top.missing.length} next steps</div>
        </div>
      </section>
      <div className="section-head">
        <div>
          <span className="eyebrow">YOUR SIGNALS</span>
          <h2>Career snapshot</h2>
        </div>
        <button
          className="text-btn"
          onClick={() => setActive("explorer")}
          data-testid="view-all-recommendations"
        >
          View all <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="metrics">
        <Metric
          icon={<Gauge size={18} />}
          color="green"
          label="Top match"
          value={top.title}
          note={`${top.score}% alignment with your skills`}
        />
        <Metric
          icon={<ClipboardCheck size={18} />}
          color="blue"
          label="Skills mapped"
          value={`${(profile?.skills || []).length} / 18`}
          note="signals explored"
        />
        <Metric
          icon={<BookOpen size={18} />}
          color="orange"
          label="Roadmap progress"
          value="32%"
          note="2 of 6 milestones"
        />
        <Metric
          icon={<Sparkles size={18} />}
          color="pink"
          label="ML demonstration"
          value={`${ml?.confidence || top.score}%`}
          note={ml?.predicted_role || top.title}
        />
      </div>
      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">RECOMMENDED FOR YOU</span>
              <h2>Roles worth exploring</h2>
            </div>
          </div>
          {safeRecs.slice(0, 3).map((r, i) => (
            <RoleRow key={r.title} role={r} rank={i + 1} />
          ))}
        </div>
        <div className="panel next-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">UP NEXT</span>
              <h2>One small step</h2>
            </div>
            <span className="step-count">01 / 03</span>
          </div>
          <div className="next-content">
            <div className="next-number">01</div>
            <h3>Strengthen your {top.missing[0] || "next skill"}</h3>
            <p>A focused learning sprint today can lift your match signal.</p>
            <button
              className="outline-btn"
              onClick={() => setActive("roadmap")}
              data-testid="start-learning-step"
            >
              View learning path <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Metric({ icon, color, label, value, note }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${color}`}>{icon}</div>
      <span>{label}</span>
      <strong data-testid={`metric-${label.toLowerCase().replaceAll(" ", "-")}`}>
        {value}
      </strong>
      <small>{note}</small>
    </div>
  );
}

function Explorer({ recs, profile }) {
  const safeRecs =
    Array.isArray(recs) && recs.length > 0
      ? recs
      : fallback(profile?.skills || starter.skills);

  return (
    <>
      <Title
        eyebrow="CAREER EXPLORER"
        title="Find your strongest direction"
        sub="Explore the reasoning behind each role match — no black boxes."
      />
      <div className="explorer-intro">
        <div>
          <span className="chip green">EXPLAINABLE MATCHING</span>
          <h2>
            Based on your skills, interests
            <br />
            and room to grow.
          </h2>
        </div>
        <div className="method-card">
          <Sparkles size={18} />
          <div>
            <b>How this works</b>
            <span>
              We compare {(profile?.skills || []).length} profile signals against curated entry-level requirements.
            </span>
          </div>
        </div>
      </div>
      <div className="role-grid">
        {safeRecs.map((r, i) => (
          <article
            className="role-card"
            key={r.title}
            data-testid={`career-card-${i}`}
          >
            <div className="role-card-top">
              <span className={`role-icon role-${i}`}>
                <BriefcaseBusiness size={19} />
              </span>
              <span className="rank-label">0{i + 1} / 04</span>
            </div>
            <h3>{r.title}</h3>
            <span className="team-label">{r.team}</span>
            <div className="big-score">
              <strong>{r.score}%</strong>
              <span>match strength</span>
            </div>
            <div className="match-line">
              <i style={{ width: `${r.score}%` }} />
            </div>
            <p>{r.description}</p>
            <div className="skill-pills">
              {(r.matched || []).slice(0, 4).map((s) => (
                <span className="skill matched" key={s}>
                  <Check size={12} />
                  {s}
                </span>
              ))}
              {(r.missing || []).slice(0, 2).map((s) => (
                <span className="skill missing" key={s}>
                  + {s}
                </span>
              ))}
            </div>
            <div className="role-reason">
              <Sparkles size={14} />
              <span>Transparent signal: current skills align with this path.</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Skills({ recs }) {
  const safeRecs =
    Array.isArray(recs) && recs.length > 0 ? recs : fallback([]);
  const top = safeRecs[0];

  return (
    <>
      <Title
        eyebrow="SKILL ANALYSIS"
        title="Turn gaps into a game plan"
        sub={`Your ${top.title} signal is strongest right now.`}
      />
      <div className="analysis-head">
        <div className="donut" style={{ "--score": `${top.score}%` }}>
          <div>
            <strong>{top.score}%</strong>
            <span>match</span>
          </div>
        </div>
        <div>
          <span className="chip blue">SELECTED PATH</span>
          <h2>{top.title}</h2>
          <p>
            {top.matched.length} of {top.skills.length} core skills are already in your profile.
          </p>
          <div className="legend">
            <span>
              <i className="dot green-dot" />
              Matched ({top.matched.length})
            </span>
            <span>
              <i className="dot orange-dot" />
              Next to build ({top.missing.length})
            </span>
          </div>
        </div>
      </div>
      <div className="skill-columns">
        <SkillList
          title="Matched skills"
          eyebrow="ALREADY IN YOUR TOOLKIT"
          items={top.matched}
          good
        />
        <SkillList
          title="Skills to build"
          eyebrow="YOUR NEXT LEVER"
          items={top.missing}
        />
      </div>
    </>
  );
}

function SkillList({ title, eyebrow, items = [], good }) {
  return (
    <div className="panel skill-list">
      <div className="panel-head">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <span
          className={`count-badge ${good ? "green-badge" : "orange-badge"}`}
        >
          {items.length}
        </span>
      </div>
      {items.map((s, i) => (
        <div className="skill-list-row" key={s}>
          {good ? (
            <span className="check-circle">
              <Check size={14} />
            </span>
          ) : (
            <span className="priority">0{i + 1}</span>
          )}
          <div>
            <b>{s}</b>
            {!good && (
              <small>
                {i === 0
                  ? "Highest impact for your match"
                  : "Useful foundation for this path"}
              </small>
            )}
          </div>
          {good && <span className="skill-level">Profile signal</span>}
        </div>
      ))}
    </div>
  );
}

function Resume({ profile, save }) {
  const [draft, setDraft] = useState({ ...(profile || starter) });
  const update = (key, value) => setDraft({ ...draft, [key]: value });

  const copy = () => {
    navigator.clipboard?.writeText(
      `${draft.name}\n${draft.headline}\n\nEducation\n${draft.education}\n\nSkills\n${(draft.skills || []).join(
        ", "
      )}\n\nProjects\n${(draft.projects || []).join("\n")}`
    );
    toast.success("Resume text copied");
  };

  const print = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(
      `<html><head><title>${draft.name} — Resume</title><style>body{font-family:Arial;padding:48px;color:#18212f;max-width:760px;margin:auto}h1{margin-bottom:4px}h2{border-bottom:1px solid #ddd;padding-bottom:6px;font-size:16px;margin-top:28px}p{line-height:1.5}</style></head><body><h1>${draft.name}</h1><p>${draft.headline}</p><h2>Education</h2><p>${draft.education}</p><h2>Skills</h2><p>${(draft.skills || []).join(", ")}</p><h2>Projects</h2><p>${(draft.projects || []).join("<br/>")}</p><h2>Experience</h2><p>${draft.experience}</p><script>window.print()</script></body></html>`
    );
    w.document.close();
  };

  return (
    <>
      <Title
        eyebrow="RESUME STUDIO"
        title="Make your story easy to choose"
        sub="A clear, editable resume draft built from the signals in your profile."
        action={
          <div className="title-actions">
            <button
              className="outline-btn"
              onClick={copy}
              data-testid="copy-resume-button"
            >
              <ClipboardCheck size={15} /> Copy text
            </button>
            <button
              className="primary-btn"
              onClick={print}
              data-testid="download-resume-button"
            >
              <Download size={15} /> Download PDF
            </button>
          </div>
        }
      />
      <div className="resume-layout">
        <div className="panel resume-form">
          <div className="panel-head">
            <div>
              <span className="eyebrow">YOUR INPUTS</span>
              <h2>Edit your details</h2>
            </div>
          </div>
          <label>
            Full name
            <input
              data-testid="resume-name-input"
              value={draft.name || ""}
              onChange={(e) => update("name", e.target.value)}
            />
          </label>
          <label>
            Professional headline
            <input
              data-testid="resume-headline-input"
              value={draft.headline || ""}
              onChange={(e) => update("headline", e.target.value)}
            />
          </label>
          <label>
            Education
            <input
              data-testid="resume-education-input"
              value={draft.education || ""}
              onChange={(e) => update("education", e.target.value)}
            />
          </label>
          <label>
            Skills <span className="label-hint">comma separated</span>
            <input
              data-testid="resume-skills-input"
              value={(draft.skills || []).join(", ")}
              onChange={(e) =>
                update(
                  "skills",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
            />
          </label>
          <label>
            Projects <span className="label-hint">one project per line</span>
            <textarea
              data-testid="resume-projects-input"
              value={(draft.projects || []).join("\n")}
              onChange={(e) => update("projects", e.target.value.split("\n"))}
            />
          </label>
          <button
            className="primary-btn full-btn"
            onClick={() => save(draft)}
            data-testid="save-resume-button"
          >
            <Save size={15} /> Save changes
          </button>
        </div>
        <div className="resume-paper">
          <div className="paper-toolbar">
            <span>
              <span className="live-dot" /> Live preview
            </span>
            <span>
              Entry-level format · <b>A4</b>
            </span>
          </div>
          <div className="paper-content">
            <h2>{draft.name}</h2>
            <p className="paper-headline">{draft.headline}</p>
            <div className="paper-rule" />
            <h4>EDUCATION</h4>
            <p>{draft.education}</p>
            <h4>SKILLS</h4>
            <div className="paper-skills">
              {(draft.skills || []).map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <h4>PROJECTS</h4>
            {(draft.projects || []).map((p) => (
              <p key={p} className="project-line">
                {p}
              </p>
            ))}
            <h4>EXPERIENCE</h4>
            <p>
              {draft.experience ||
                "Add a short experience summary in your profile."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Roadmap({ recs }) {
  const safeRecs =
    Array.isArray(recs) && recs.length > 0 ? recs : fallback([]);
  const top = safeRecs[0];
  const steps = [
    ...(top.missing || []),
    "Build a proof project",
    "Share your work with confidence"
  ];

  return (
    <>
      <Title
        eyebrow="LEARNING ROADMAP"
        title="Small steps, visible momentum"
        sub={`A focused path towards your ${top.title} signal.`}
        action={
          <button className="primary-btn" data-testid="roadmap-start-button">
            <BookOpen size={15} /> Start next step
          </button>
        }
      />
      <div className="roadmap-banner">
        <div className="roadmap-stat">
          <strong>32%</strong>
          <span>complete</span>
        </div>
        <div className="roadmap-progress">
          <div>
            <b>Your {top.title} path</b>
            <span>2 of 6 milestones complete</span>
          </div>
          <div className="progress large">
            <i style={{ width: "32%" }} />
          </div>
        </div>
        <div className="streak">
          <span>✦</span>
          <b>4 day</b>
          <small>learning streak</small>
        </div>
      </div>
      <div className="roadmap-list">
        {steps.map((s, i) => (
          <div
            className={i < 2 ? "road-step complete" : "road-step"}
            key={s}
            data-testid={`roadmap-step-${i}`}
          >
            <div className="road-number">
              {i < 2 ? <Check size={16} /> : `0${i + 1}`}
            </div>
            <div className="road-body">
              <span className="road-type">
                {i < 2 ? "COMPLETED" : "UP NEXT"}
              </span>
              <h3>{s}</h3>
              <p>
                {i < 2
                  ? "You’ve added a strong signal to your profile."
                  : "Build this into your portfolio and make the learning visible."}
              </p>
            </div>
            <button className="icon-btn" data-testid={`roadmap-action-${i}`}>
              <ChevronRight size={17} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function Interview({ profile }) {
  const [started, setStarted] = useState(false);

  return (
    <>
      <Title
        eyebrow="NEW · PRACTICE LAB"
        title="Meet your next opportunity prepared"
        sub="A low-pressure mock interview that turns uncertainty into rehearsal."
        action={<span className="chip green">BETA EXPERIENCE</span>}
      />
      <div className="interview-hero">
        <div className="interview-copy">
          <div className="interview-orb">
            <MessageCircle size={30} />
          </div>
          <span className="chip blue">AI PRACTICE SESSION</span>
          <h2>
            Tell me about a project
            <br />
            <em>you’re proud of.</em>
          </h2>
          <p>
            Practice entry-level interview questions and get a thoughtful nudge, not a generic score.
          </p>
          {!started ? (
            <button
              className="primary-btn"
              onClick={() => setStarted(true)}
              data-testid="start-interview-button"
            >
              <Send size={15} /> Start practice
            </button>
          ) : (
            <div className="answer-box">
              <textarea
                data-testid="interview-answer-input"
                placeholder={`Hi ${(profile?.name || "Alex").split(" ")[0]}, take your time...`}
              />
              <button
                className="primary-btn"
                data-testid="submit-interview-answer"
              >
                Submit answer <ArrowUpRight size={15} />
              </button>
            </div>
          )}
        </div>
        <div className="interview-side">
          <div className="side-label">SESSION PREVIEW</div>
          <div className="preview-item">
            <span>01</span>
            <div>
              <b>Warm-up</b>
              <small>Tell me about yourself</small>
            </div>
            <Check size={15} />
          </div>
          <div className="preview-item active">
            <span>02</span>
            <div>
              <b>Storytelling</b>
              <small>Talk through a project</small>
            </div>
            <i>Now</i>
          </div>
          <div className="preview-item">
            <span>03</span>
            <div>
              <b>Reflection</b>
              <small>What will you learn next?</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AppShell() {
  const [active, setActive] = useState("dashboard");
  const [profile, setProfile] = useState(starter);
  const [recs, setRecs] = useState(fallback(starter.skills));
  const [ml, setMl] = useState({ confidence: 50, predicted_role: "Frontend Developer" });
  const [mobile, setMobile] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    let currentProfile = starter;
    try {
      const p = await axios.get(`${API}/profile`);
      if (
        p.data &&
        typeof p.data === "object" &&
        Array.isArray(p.data.skills) &&
        p.data.skills.length > 0
      ) {
        currentProfile = p.data;
      }
    } catch (e) {
      // Backend not yet connected or responding; using starter profile
    }
    setProfile(currentProfile);

    let currentRecs = fallback(currentProfile.skills);
    try {
      const r = await axios.post(`${API}/recommendations`, currentProfile);
      if (
        r.data &&
        Array.isArray(r.data.recommendations) &&
        r.data.recommendations.length > 0
      ) {
        currentRecs = r.data.recommendations;
      }
    } catch (e) {
      // Fallback recommendations
    }
    setRecs(currentRecs);

    try {
      const m = await axios.post(`${API}/ml-demo`, currentProfile);
      if (m.data && typeof m.data === "object" && m.data.predicted_role) {
        setMl(m.data);
      } else {
        setMl({
          confidence: currentRecs[0]?.score || 50,
          predicted_role: currentRecs[0]?.title || "Frontend Developer"
        });
      }
    } catch (e) {
      setMl({
        confidence: currentRecs[0]?.score || 50,
        predicted_role: currentRecs[0]?.title || "Frontend Developer"
      });
    }

    setLoaded(true);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (next = profile) => {
    setProfile(next);
    let currentRecs = fallback(next.skills);
    try {
      const r = await axios.post(`${API}/profile`, next);
      const updated =
        r.data && typeof r.data === "object" && Array.isArray(r.data.skills)
          ? r.data
          : next;
      const a = await axios.post(`${API}/recommendations`, updated);
      if (
        a.data &&
        Array.isArray(a.data.recommendations) &&
        a.data.recommendations.length > 0
      ) {
        currentRecs = a.data.recommendations;
      }
      setRecs(currentRecs);

      const m = await axios.post(`${API}/ml-demo`, updated);
      if (m.data && typeof m.data === "object" && m.data.predicted_role) {
        setMl(m.data);
      }
      toast.success("Your compass is up to date");
    } catch (e) {
      setRecs(currentRecs);
      toast.info("Saved for this session");
    }
  };

  if (!loaded) {
    return (
      <div className="loading-screen">
        <div className="brand-mark">✦</div>
        <p>Calibrating your compass…</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className={mobile ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <div className="brand-mark">✦</div>
          <div>
            <strong>CareerCompass</strong>
            <span>AI guidance for your next move</span>
          </div>
          <button
            className="icon-btn mobile-close"
            onClick={() => setMobile(false)}
            data-testid="close-mobile-nav"
          >
            <X size={18} />
          </button>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={active === id ? "nav-item active" : "nav-item"}
              onClick={() => {
                setActive(id);
                setMobile(false);
              }}
              data-testid={`nav-${id}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {id === "interview" && <i>new</i>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="method-note">
            <Sparkles size={16} />
            <div>
              <b>Transparent by design</b>
              <span>Every recommendation comes with the why.</span>
            </div>
          </div>
          <div className="profile-mini">
            <div className="avatar">AM</div>
            <div>
              <b data-testid="sidebar-profile-name">{profile?.name}</b>
              <span>Student profile</span>
            </div>
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <button
            className="icon-btn menu-btn"
            onClick={() => setMobile(true)}
            data-testid="open-mobile-nav"
          >
            <Menu size={21} />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <b>{nav.find((n) => n.id === active)?.label}</b>
          </div>
          <div className="top-actions">
            <span className="status-dot">
              ● <b>Saved</b>
            </span>
            <button
              className="outline-btn"
              onClick={() => save()}
              data-testid="top-save-button"
            >
              <Save size={15} /> Save profile
            </button>
            <div className="avatar top-avatar">AM</div>
          </div>
        </header>
        <div className="content">
          {active === "dashboard" && (
            <Dashboard
              profile={profile}
              recs={recs}
              ml={ml}
              setActive={setActive}
            />
          )}
          {active === "explorer" && (
            <Explorer recs={recs} profile={profile} />
          )}
          {active === "skills" && <Skills recs={recs} />}
          {active === "resume" && <Resume profile={profile} save={save} />}
          {active === "roadmap" && <Roadmap recs={recs} />}
          {active === "interview" && <Interview profile={profile} />}
        </div>
      </main>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;