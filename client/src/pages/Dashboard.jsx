import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllStats, getRecentActivities, getProfileData } from "../utils/storage";
import AssistantWidget from "../components/AssistantWidget";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    study: 0,
    placement: 0,
    project: 0,
    total: 0,
  });

  const [latestAction, setLatestAction] = useState("No activity yet");
  const [recentActivities, setRecentActivities] = useState([]);
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const currentStats = getAllStats();
    const activities = getRecentActivities();
    const profile = getProfileData();

    setStats(currentStats);
    setRecentActivities(activities.slice(0, 4));

    if (profile?.fullName?.trim()) {
      setUserName(profile.fullName);
    }

    if (activities.length > 0) {
      setLatestAction(`${activities[0].module}: ${activities[0].title}`);
    }
  }, []);

  const userInitial = userName?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className="dashboard-wrapper">
      <div className="topbar">
        <div className="brand-title">CampusMate AI</div>

        <div className="topbar-right">
          <button
            className="profile-chip"
            onClick={() => navigate("/profile")}
          >
            <div className="profile-chip-avatar">{userInitial}</div>
            <div className="profile-chip-text">
              <span className="profile-chip-label">Signed in as</span>
              <span className="profile-chip-name">{userName}</span>
            </div>
          </button>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="dashboard-hero">
              <div>
                <div className="hero-badge">AI Powered Student Platform</div>

                <h1 className="dashboard-hero-title">
                  Learn Smarter, Practice Better, Build Faster
                </h1>

                <p className="dashboard-hero-text">
                  One platform for study preparation, placement readiness,
                  project ideation, structured learning paths, and AI-based
                  doubt solving.
                </p>
              </div>

              <div className="d-flex gap-2 flex-wrap mt-4">
                <button
                  className="btn btn-light"
                  onClick={() => navigate("/learning-path")}
                >
                  Open Learning Path
                </button>
                <button
                  className="btn btn-outline-light"
                  onClick={() => navigate("/study-prep")}
                >
                  Start Study Prep
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="feature-card h-100 dashboard-side-card">
              <div>
                <div className="feature-icon icon-dark">⚡</div>
                <h4>Latest Activity</h4>
                <p className="dashboard-side-text">{latestAction}</p>
              </div>

              <button
                className="custom-btn btn-darkcustom"
                onClick={() => navigate("/progress")}
              >
                View Progress & Activity
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-1">
          <div className="col-md-6 col-xl-3">
            <div className="stat-card">
              <h6>Study Sessions</h6>
              <h3>{stats.study}</h3>
              <div className="stat-subtext">
                Notes and topic-based study generations
              </div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="stat-card">
              <h6>Placement Sessions</h6>
              <h3>{stats.placement}</h3>
              <div className="stat-subtext">
                Interview and placement practice generations
              </div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="stat-card">
              <h6>Projects Generated</h6>
              <h3>{stats.project}</h3>
              <div className="stat-subtext">
                AI-generated final year project ideas
              </div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="stat-card">
              <h6>Total Activities</h6>
              <h3>{stats.total}</h3>
              <div className="stat-subtext">
                Overall platform engagement count
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-lg-8">
            <div className="feature-card">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h4 className="mb-0">Core Modules</h4>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate("/learning-path")}
                >
                  Explore Learning Path
                </button>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="mini-module-card">
                    <div className="feature-icon icon-blue">📘</div>
                    <h4>Study Prep</h4>
                    <p>Generate notes, examples, and exam-focused explanations.</p>
                    <button
                      className="custom-btn btn-blue"
                      onClick={() => navigate("/study-prep")}
                    >
                      Open Module
                    </button>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mini-module-card">
                    <div className="feature-icon icon-green">💼</div>
                    <h4>Placement Prep</h4>
                    <p>Practice HR, technical, aptitude, and communication topics.</p>
                    <button
                      className="custom-btn btn-green"
                      onClick={() => navigate("/placement-prep")}
                    >
                      Open Module
                    </button>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mini-module-card">
                    <div className="feature-icon icon-orange">🛠️</div>
                    <h4>Project Assistant</h4>
                    <p>Generate major project ideas, features, tech stack, and future scope.</p>
                    <button
                      className="custom-btn btn-orange"
                      onClick={() => navigate("/project-assistant")}
                    >
                      Open Module
                    </button>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mini-module-card">
                    <div className="feature-icon icon-dark">🎓</div>
                    <h4>Learning Path</h4>
                    <p>Follow structured topic-wise learning with embedded videos and tasks.</p>
                    <button
                      className="custom-btn btn-darkcustom"
                      onClick={() => navigate("/learning-path")}
                    >
                      Open Module
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="feature-card h-100">
              <h4 className="mb-3">Recent Activity</h4>

              {recentActivities.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {recentActivities.map((item, index) => (
                    <div key={index} className="recent-activity-card">
                      <div className="recent-activity-title">{item.module}</div>
                      <div className="recent-activity-topic">{item.title}</div>
                      <div className="recent-activity-meta">
                        Difficulty: {item.difficulty}
                      </div>
                      <div className="recent-activity-time">{item.time}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="recent-empty-box">
                  No recent activity yet. Start using the modules to build your
                  activity history.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AssistantWidget />
    </div>
  );
}

export default Dashboard;