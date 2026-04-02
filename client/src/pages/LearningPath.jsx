import { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { learningPaths } from "../data/learningPaths";
import { API_BASE_URL } from "../utils/api";

function LearningPath() {
  const navigate = useNavigate();

  const [selectedTrack, setSelectedTrack] = useState("uiux");
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem("cm_learning_progress");
    return saved ? JSON.parse(saved) : {};
  });

  const [doubtInputs, setDoubtInputs] = useState({});
  const [doubtAnswers, setDoubtAnswers] = useState({});
  const [loadingLessonId, setLoadingLessonId] = useState("");

  const track = learningPaths[selectedTrack];

  const selectedLesson =
    track.lessons.find((lesson) => lesson.id === selectedLessonId) ||
    track.lessons[0];

  const progress = useMemo(() => {
    const lessonIds = track.lessons.map((lesson) => lesson.id);
    const doneCount = lessonIds.filter((id) => completedLessons[id]).length;
    const percentage =
      track.lessons.length > 0
        ? Math.round((doneCount / track.lessons.length) * 100)
        : 0;

    return {
      doneCount,
      total: track.lessons.length,
      percentage,
    };
  }, [track, completedLessons]);

  const saveProgress = (updated) => {
    setCompletedLessons(updated);
    localStorage.setItem("cm_learning_progress", JSON.stringify(updated));
  };

  const toggleComplete = (lessonId) => {
    const updated = {
      ...completedLessons,
      [lessonId]: !completedLessons[lessonId],
    };
    saveProgress(updated);
  };

  const handleDoubtChange = (lessonId, value) => {
    setDoubtInputs((prev) => ({
      ...prev,
      [lessonId]: value,
    }));
  };

  const handleAskDoubt = async (lesson) => {
    const doubt = doubtInputs[lesson.id]?.trim();

    if (!doubt) {
      alert("Please type your doubt first");
      return;
    }

    try {
      setLoadingLessonId(lesson.id);

      const response = await axios.post(
        `${API_BASE_URL}/api/learning/doubt`,
        {
          subject: track.title,
          lessonTitle: lesson.title,
          doubt,
        }
      );

      setDoubtAnswers((prev) => ({
        ...prev,
        [lesson.id]: response.data.content,
      }));
    } catch (error) {
      console.error(error);
      alert("Something went wrong while asking the doubt");
    } finally {
      setLoadingLessonId("");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="topbar">
        <div className="brand-title">CampusMate AI</div>
        <div className="topbar-right d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="container py-4">
        <div className="learning-hero">
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <div className="hero-badge dark-badge">STRUCTURED LEARNING</div>
              <h1 className="learning-hero-title">Smart Learning Path</h1>
              <p className="learning-hero-text">
                Learn in sequence with embedded videos, practical tasks, lesson
                completion tracking, and AI-powered doubt solving.
              </p>
            </div>

            <div className="col-lg-4">
              <label className="select-label">Choose Learning Track</label>
              <select
                className="form-control custom-select-field"
                value={selectedTrack}
                onChange={(e) => {
                  setSelectedTrack(e.target.value);
                  setSelectedLessonId(null);
                }}
              >
                <option value="uiux">UI/UX Design</option>
                <option value="java">Java Programming</option>
                <option value="dbms">DBMS</option>
                <option value="webdev">Web Development</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4 mt-1">
          <div className="col-md-4">
            <div className="stat-card">
              <h6>Current Track</h6>
              <h3 style={{ fontSize: "24px" }}>{track.title}</h3>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card">
              <h6>Completed Lessons</h6>
              <h3>
                {progress.doneCount} / {progress.total}
              </h3>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card">
              <h6>Track Progress</h6>
              <h3>{progress.percentage}%</h3>
            </div>
          </div>
        </div>

        <div className="feature-card mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <div>
              <h4 className="mb-1">{track.title}</h4>
              <p className="mb-0" style={{ color: "#64748b" }}>
                {track.description}
              </p>
            </div>

            <button
              className="btn btn-outline-success"
              onClick={() => toggleComplete(selectedLesson.id)}
            >
              {completedLessons[selectedLesson.id]
                ? "Completed"
                : "Mark Current Lesson Done"}
            </button>
          </div>

          <div className="progress" style={{ height: "10px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-3">
            <div className="feature-card h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Lessons</h4>
                <span className="small text-muted">{track.lessons.length} total</span>
              </div>

              <div className="d-flex flex-column gap-3">
                {track.lessons.map((lesson, index) => {
                  const isSelected = selectedLesson.id === lesson.id;
                  const isDone = completedLessons[lesson.id];

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`lesson-item-btn ${isSelected ? "active" : ""}`}
                    >
                      <div className="lesson-small-label">Lesson {index + 1}</div>
                      <div className="lesson-main-title">{lesson.title}</div>
                      <div className={isDone ? "lesson-done" : "lesson-pending"}>
                        {isDone ? "Completed" : "Not completed"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="feature-card h-100">
              <div className="mb-3">
                <div className="lesson-small-label">CURRENT LESSON</div>
                <h4 className="mb-1">{selectedLesson.title}</h4>
                <p className="mb-0" style={{ color: "#64748b" }}>
                  {selectedLesson.videoTitle}
                </p>
              </div>

              <div className="lesson-video-wrap">
                <iframe
                  width="100%"
                  height="380"
                  src={selectedLesson.embedUrl}
                  title={selectedLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="feature-card h-100 d-flex flex-column gap-4">
              <div className="soft-box">
                <h5 className="mb-2">Task</h5>
                <p className="mb-0" style={{ color: "#0f172a", lineHeight: "1.7" }}>
                  {selectedLesson.task}
                </p>
              </div>

              <div className="soft-box">
                <h5 className="mb-2">Ask Doubt</h5>

                <textarea
                  className="form-control mb-3"
                  rows="4"
                  placeholder="Type what you did not understand..."
                  value={doubtInputs[selectedLesson.id] || ""}
                  onChange={(e) =>
                    handleDoubtChange(selectedLesson.id, e.target.value)
                  }
                />

                <button
                  className="btn btn-primary w-100 mb-3"
                  onClick={() => handleAskDoubt(selectedLesson)}
                >
                  {loadingLessonId === selectedLesson.id ? "Answering..." : "Ask Doubt"}
                </button>

                <div className="assistant-reply-box small-reply-box">
                  {doubtAnswers[selectedLesson.id] ||
                    "Your doubt answer will appear here."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningPath;