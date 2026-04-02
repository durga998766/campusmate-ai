import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  incrementModuleCount,
  saveRecentActivity,
} from "../utils/storage";
import { API_BASE_URL } from "../utils/api";

function PlacementPrep() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!category || !role || !difficulty) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/api/placement/generate`,
        {
          category,
          role,
          difficulty,
        }
      );

      const generatedText = response.data.content;
      setResult(generatedText);

      incrementModuleCount("placement");
      saveRecentActivity({
        module: "Placement Prep",
        title: `${category} - ${role}`,
        difficulty,
        time: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating placement content");
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
    a.download = "placement-content.txt";
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

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="feature-card">
              <div className="feature-icon icon-green">💼</div>
              <h4>Placement Preparation</h4>
              <p>
                Generate interview and placement preparation content based on category and difficulty.
              </p>

              <select
                className="form-control mb-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                <option value="HR">HR</option>
                <option value="Technical">Technical</option>
                <option value="Aptitude">Aptitude</option>
                <option value="Communication">Communication</option>
              </select>

              <input
                className="form-control mb-3"
                type="text"
                placeholder="Enter role/topic (e.g. Java Developer)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
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

              <button className="custom-btn btn-green" onClick={handleGenerate}>
                {loading ? "Generating..." : "Generate Placement Content"}
              </button>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="feature-card">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h4 className="mb-0">Generated Output</h4>
                <div className="d-flex gap-2 flex-wrap">
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
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    background: "#f8fafc",
                    padding: "20px",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    minHeight: "300px",
                    lineHeight: "1.8",
                    fontSize: "15px",
                    color: "#0f172a",
                    overflowY: "auto",
                  }}
                >
                  {result}
                </div>
              ) : (
                <div
                  style={{
                    background: "#f8fafc",
                    padding: "20px",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    minHeight: "300px",
                    color: "#64748b",
                  }}
                >
                  Your generated placement content will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlacementPrep;