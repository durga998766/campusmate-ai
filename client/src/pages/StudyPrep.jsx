import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  incrementModuleCount,
  saveRecentActivity,
} from "../utils/storage";
import { API_BASE_URL } from "../utils/api";

function StudyPrep() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!subject || !topic || !difficulty) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/api/study/generate`,
        {
          subject,
          topic,
          difficulty,
        }
      );

      const generatedText = response.data.content;
      setResult(generatedText);

      incrementModuleCount("study");
      saveRecentActivity({
        module: "Study Prep",
        title: `${subject} - ${topic}`,
        difficulty,
        time: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating notes");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    alert("Copied to clipboard");
  };

  const handleClear = () => {
    setResult("");
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "study-notes.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleGoogleKeep = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    window.open("https://keep.google.com/", "_blank");
  };

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
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="feature-card">
              <div className="feature-icon icon-blue">📘</div>
              <h4>Study Preparation</h4>
              <p>
                Generate notes and important learning points for your selected
                subject and topic.
              </p>

              <input
                className="form-control mb-3"
                type="text"
                placeholder="Enter subject (e.g. DBMS)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <input
                className="form-control mb-3"
                type="text"
                placeholder="Enter topic (e.g. Normalization)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />

              <select
                className="form-control mb-3"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <button className="custom-btn btn-blue" onClick={handleGenerate}>
                {loading ? "Generating..." : "Generate Notes"}
              </button>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="feature-card">
              <div className="module-header">
                <h4 className="mb-0">Generated Output</h4>

                <div className="module-actions">
                  <button className="btn btn-sm btn-outline-primary" onClick={handleCopy}>
                    Copy
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={handleClear}>
                    Clear
                  </button>
                  <button className="btn btn-sm btn-outline-success" onClick={handleDownload}>
                    Download
                  </button>
                  <button className="btn btn-sm btn-outline-dark" onClick={handleGoogleKeep}>
                    Google Keep
                  </button>
                </div>
              </div>

              {result ? (
                <div className="output-box">{result}</div>
              ) : (
                <div className="output-placeholder">
                  Your generated study notes will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyPrep;