import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllStats,
  getRecentActivities,
  getWeeklyActivity,
} from "../utils/storage";

function ProgressTracker() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    study: 0,
    placement: 0,
    project: 0,
    total: 0,
  });

  const [activities, setActivities] = useState([]);
  const [weeklyData, setWeeklyData] = useState({
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  });

  const [learningProgress, setLearningProgress] = useState({});

  useEffect(() => {
    setStats(getAllStats());
    setActivities(getRecentActivities());
    setWeeklyData(getWeeklyActivity());

    const savedLearning = localStorage.getItem("cm_learning_progress");
    setLearningProgress(savedLearning ? JSON.parse(savedLearning) : {});
  }, []);

  const learningCompletedCount = useMemo(() => {
    return Object.values(learningProgress).filter(Boolean).length;
  }, [learningProgress]);

  const chartData = useMemo(() => {
    return [
      { day: "Sun", minutes: weeklyData.Sun || 0 },
      { day: "Mon", minutes: weeklyData.Mon || 0 },
      { day: "Tue", minutes: weeklyData.Tue || 0 },
      { day: "Wed", minutes: weeklyData.Wed || 0 },
      { day: "Thu", minutes: weeklyData.Thu || 0 },
      { day: "Fri", minutes: weeklyData.Fri || 0 },
      { day: "Sat", minutes: weeklyData.Sat || 0 },
    ];
  }, [weeklyData]);

  const maxMinutes = useMemo(() => {
    const max = Math.max(...chartData.map((item) => item.minutes), 60);
    return max;
  }, [chartData]);

  const totalWeeklyMinutes = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.minutes, 0);
  }, [chartData]);

  const totalWeeklyHours = (totalWeeklyMinutes / 60).toFixed(1);

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset activity, weekly graph, and learning progress?"
    );

    if (!confirmReset) return;

    localStorage.removeItem("cm_study_count");
    localStorage.removeItem("cm_placement_count");
    localStorage.removeItem("cm_project_count");
    localStorage.removeItem("cm_recent_activities");
    localStorage.removeItem("cm_learning_progress");
    localStorage.removeItem("cm_weekly_activity");

    setStats({
      study: 0,
      placement: 0,
      project: 0,
      total: 0,
    });
    setActivities([]);
    setLearningProgress({});
    setWeeklyData({
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
    });
  };

  return (
    <div className="dashboard-wrapper">
      <div className="topbar">
        <div className="brand-title">CampusMate AI</div>
        <div className="topbar-right d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleReset}
          >
            Reset Data
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="feature-card">
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#2563eb",
                  marginBottom: "10px",
                  letterSpacing: "0.04em",
                }}
              >
                LEARNING ANALYTICS
              </div>

              <h2 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "10px" }}>
                Progress & Activity
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "16px",
                  lineHeight: "1.7",
                  marginBottom: 0,
                }}
              >
                This section tracks module activity, lesson completion, and
                estimated weekly study effort in a day-wise graph.
              </p>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="feature-card h-100">
              <h4 className="mb-2">This Week</h4>
              <p style={{ minHeight: "unset" }}>
                Total tracked study effort for this week.
              </p>

              <div
                style={{
                  fontSize: "42px",
                  fontWeight: "800",
                  color: "#2563eb",
                  lineHeight: 1,
                }}
              >
                {totalWeeklyHours}h
              </div>

              <div style={{ color: "#64748b", marginTop: "10px", fontSize: "14px" }}>
                {totalWeeklyMinutes} minutes tracked from Sun to Sat
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-1">
          <div className="col-md-6 col-xl-3">
            <div className="stat-card">
              <h6>Total AI Activities</h6>
              <h3>{stats.total}</h3>
              <div className="stat-subtext">Total usage across all smart modules</div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="stat-card">
              <h6>Study Sessions</h6>
              <h3>{stats.study}</h3>
              <div className="stat-subtext">Study note generations</div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="stat-card">
              <h6>Placement Sessions</h6>
              <h3>{stats.placement}</h3>
              <div className="stat-subtext">Placement preparation generations</div>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="stat-card">
              <h6>Projects Generated</h6>
              <h3>{stats.project}</h3>
              <div className="stat-subtext">Project ideas generated</div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-1">
          <div className="col-lg-8">
            <div className="feature-card">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                  <h4 className="mb-1">Weekly Study Graph</h4>
                  <p className="mb-0" style={{ color: "#64748b" }}>
                    Estimated study effort from Sunday to Saturday
                  </p>
                </div>

                <div className="weekly-hours-badge">
                  {totalWeeklyHours} hours this week
                </div>
              </div>

              <div className="weekly-chart-wrapper">
                {chartData.map((item) => {
                  const heightPercent =
                    maxMinutes > 0 ? Math.max((item.minutes / maxMinutes) * 100, item.minutes > 0 ? 8 : 0) : 0;

                  return (
                    <div key={item.day} className="weekly-bar-item">
                      <div className="weekly-bar-top-label">
                        {item.minutes}m
                      </div>

                      <div className="weekly-bar-track">
                        <div
                          className="weekly-bar-fill"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>

                      <div className="weekly-bar-day">{item.day}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="feature-card h-100">
              <div className="feature-icon icon-blue">📚</div>
              <h4>Learning Path Completion</h4>
              <p style={{ minHeight: "unset" }}>
                Lessons marked as complete inside structured learning tracks.
              </p>

              <div
                style={{
                  fontSize: "42px",
                  fontWeight: "800",
                  color: "#2563eb",
                  marginBottom: "12px",
                }}
              >
                {learningCompletedCount}
              </div>

              <button
                className="custom-btn btn-blue"
                onClick={() => navigate("/learning-path")}
              >
                Open Learning Path
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-1">
          <div className="col-lg-12">
            <div className="feature-card">
              <h4 className="mb-3">Recent Activity Timeline</h4>

              {activities.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {activities.map((item, index) => (
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
                  No activity yet. Generate content from modules and complete lessons to build your graph and activity log.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressTracker;