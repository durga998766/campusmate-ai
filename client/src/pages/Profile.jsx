import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfileData, saveProfileData, getAllStats, getRecentActivities } from "../utils/storage";
import { getSession, logoutUser } from "../utils/auth";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    learningGoal: "",
    preferredDomain: "",
    targetRole: "",
    bio: "",
  });

  const [stats, setStats] = useState({
    study: 0,
    placement: 0,
    project: 0,
    total: 0,
  });

  const [latestActivity, setLatestActivity] = useState("No activity yet");

  useEffect(() => {
    const storedProfile = getProfileData();
    const session = getSession();
    const allStats = getAllStats();
    const recent = getRecentActivities();

    setProfile({
      ...storedProfile,
      fullName: storedProfile.fullName || session?.name || "",
      email: storedProfile.email || session?.email || "",
    });

    setStats(allStats);

    if (recent.length > 0) {
      setLatestActivity(`${recent[0].module}: ${recent[0].title}`);
    }
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    saveProfileData(profile);
    alert("Profile updated successfully");
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const userInitial = profile.fullName?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className="dashboard-wrapper">
      <div className="topbar">
        <div className="brand-title">CampusMate AI</div>
        <div className="topbar-right">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="container py-4">
        <div className="profile-main-grid">
          <div className="profile-left-col">
            <div className="feature-card profile-hero-card">
              <div className="profile-hero-top">
                <div className="profile-page-avatar large-avatar">{userInitial}</div>

                <div className="profile-hero-info">
                  <div className="profile-page-label">Student Profile</div>
                  <h1 className="profile-main-title">
                    {profile.fullName || "Student User"}
                  </h1>
                  <p className="profile-main-subtitle">
                    Manage your account information, learning preferences, and career goals.
                  </p>
                </div>
              </div>

              <div className="profile-mini-stats">
                <div className="profile-mini-stat-card">
                  <span className="profile-mini-stat-label">Study</span>
                  <strong>{stats.study}</strong>
                </div>
                <div className="profile-mini-stat-card">
                  <span className="profile-mini-stat-label">Placement</span>
                  <strong>{stats.placement}</strong>
                </div>
                <div className="profile-mini-stat-card">
                  <span className="profile-mini-stat-label">Projects</span>
                  <strong>{stats.project}</strong>
                </div>
                <div className="profile-mini-stat-card">
                  <span className="profile-mini-stat-label">Total</span>
                  <strong>{stats.total}</strong>
                </div>
              </div>
            </div>

            <div className="feature-card profile-section-card">
              <div className="profile-section-title">Personal Information</div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-control"
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            <div className="feature-card profile-section-card">
              <div className="profile-section-title">Learning Preferences</div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Learning Goal</label>
                  <input
                    className="form-control"
                    type="text"
                    value={profile.learningGoal}
                    onChange={(e) => handleChange("learningGoal", e.target.value)}
                    placeholder="e.g. Crack placements in 2 months"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Preferred Domain</label>
                  <select
                    className="form-control custom-select-field"
                    value={profile.preferredDomain}
                    onChange={(e) => handleChange("preferredDomain", e.target.value)}
                  >
                    <option value="">Select domain</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Java">Java</option>
                    <option value="DBMS">DBMS</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Placement Prep">Placement Prep</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Project Development">Project Development</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Target Role</label>
                  <input
                    className="form-control"
                    type="text"
                    value={profile.targetRole}
                    onChange={(e) => handleChange("targetRole", e.target.value)}
                    placeholder="e.g. UI/UX Designer"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Bio / Notes</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={profile.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Write a short note about your goals, skills, or current learning focus."
                  />
                </div>
              </div>

              <div className="profile-action-row">
                <button className="custom-btn btn-blue profile-save-btn" onClick={handleSave}>
                  Save Profile
                </button>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="profile-right-col">
            <div className="feature-card profile-side-card">
              <div className="profile-side-card-title">Account Overview</div>

              <div className="profile-overview-list">
                <div className="profile-overview-item">
                  <span>Name</span>
                  <strong>{profile.fullName || "Not added"}</strong>
                </div>
                <div className="profile-overview-item">
                  <span>Email</span>
                  <strong>{profile.email || "Not added"}</strong>
                </div>
                <div className="profile-overview-item">
                  <span>Preferred Domain</span>
                  <strong>{profile.preferredDomain || "Not selected"}</strong>
                </div>
                <div className="profile-overview-item">
                  <span>Target Role</span>
                  <strong>{profile.targetRole || "Not added"}</strong>
                </div>
              </div>
            </div>

            <div className="feature-card profile-side-card">
              <div className="profile-side-card-title">Latest Activity</div>
              <p className="profile-side-card-text">{latestActivity}</p>
            </div>

            <div className="feature-card profile-side-card">
              <div className="profile-side-card-title">Help & Support</div>
              <p className="profile-side-card-text">
                Use Study Prep for notes, Placement Prep for interview practice,
                Project Assistant for final year ideas, and Learning Path for
                structured learning.
              </p>
            </div>

            <div className="feature-card profile-side-card">
              <div className="profile-side-card-title">About Platform</div>
              <p className="profile-side-card-text">
                CampusMate AI is a smart student preparation platform that combines
                learning support, project guidance, placement readiness, progress
                tracking, and AI-powered assistance in one place.
              </p>
            </div>

            <div className="feature-card profile-side-card">
              <div className="profile-side-card-title">Quick Access</div>
              <div className="profile-quick-links">
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => navigate("/study-prep")}
                >
                  Open Study Prep
                </button>
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => navigate("/learning-path")}
                >
                  Open Learning Path
                </button>
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => navigate("/progress")}
                >
                  Open Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;