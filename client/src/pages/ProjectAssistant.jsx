import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  incrementModuleCount,
  saveRecentActivity,
} from "../utils/storage";
import { API_BASE_URL } from "../utils/api";

function ProjectAssistant() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [interest, setInterest] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!category || !interest || !difficulty) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/api/project/generate`,
        {
          domain: category,
          interest,
          difficulty,
        }
      );

      const generatedText = response.data.content;
      setResult(generatedText);

      incrementModuleCount("project");
      saveRecentActivity({
        module: "Project Assistant",
        title: `${category} - ${interest}`,
        difficulty,
        time: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating project content");
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
    a.download = "project-idea.txt";
    a.click();
    window.URL.revokeObjectURL(url);
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
              <div className="feature-icon icon-orange">🛠️</div>
              <h4>Project Assistant</h4>
              <p>
                Generate final year project ideas, features, tech stack, and future scope
                based on category, interest, and difficulty.
              </p>

              <select
                className="form-control custom-select-field mb-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Electronics">Electronics</option>
                <option value="Civil">Civil</option>
                <option value="AI / ML">AI / ML</option>
                <option value="IoT">IoT</option>
                <option value="General Engineering">General Engineering</option>
              </select>

              <textarea
                className="form-control mb-3"
                rows="5"
                placeholder="Enter your project interest or idea direction (e.g. smart irrigation system, AI learning platform, EV battery monitoring, traffic management)"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
              />

              <select
                className="form-control custom-select-field mb-3"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <button className="custom-btn btn-orange" onClick={handleGenerate}>
                {loading ? "Generating..." : "Generate Project Idea"}
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
                </div>
              </div>

              {result ? (
                <div className="output-box">{result}</div>
              ) : (
                <div className="output-placeholder">
                  Your generated project title, description, features, suggested tech stack,
                  and future scope will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectAssistant;