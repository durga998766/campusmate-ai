const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ================== TEST ==================
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ================== STUDY ==================
app.post("/api/study/generate", async (req, res) => {
  try {
    const { subject, topic, difficulty } = req.body;

    if (!subject || !topic || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Please provide subject, topic, and difficulty",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    let difficultyInstruction = "";

    if (difficulty === "Easy") {
      difficultyInstruction = `
Keep explanation simple and beginner friendly.
Short answer with basic concept.
Give one simple example.
`;
    } else if (difficulty === "Medium") {
      difficultyInstruction = `
Give balanced explanation with concept clarity.
Include working logic and one proper example.
Add exam-related theory.
`;
    } else {
      difficultyInstruction = `
Give detailed and advanced explanation.
Include technical depth, applications, and viva points.
Make it clearly more detailed than others.
`;
    }

    const prompt = `
You are an expert teacher helping an Indian college student.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Rules:
- No markdown
- No ** or #
- Plain clean text
- Use numbering like 1. 2. 3.

${difficultyInstruction}

Format:

Subject:
Topic:
Difficulty:

Introduction:
...

Key Concepts:
1. ...
2. ...
3. ...

Example:
...

Important Points:
1. ...
2. ...
3. ...
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "")
      .replace(/---/g, "")
      .replace(/\*/g, "")
      .trim();

    res.json({ success: true, content: text });
  } catch (err) {
    console.error("Gemini Study Error:", err);
    res.status(500).json({
      success: false,
      message: "Error generating study content",
    });
  }
});

// ================== PLACEMENT ==================
app.post("/api/placement/generate", async (req, res) => {
  try {
    const { category, role, difficulty } = req.body;

    if (!category || !role || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Please provide category, role, and difficulty",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    const prompt = `
You are a placement trainer.

Category: ${category}
Role: ${role}
Difficulty: ${difficulty}

Generate interview preparation content.

Rules:
- Plain text only
- No markdown
- Use numbering

Output:

Preparation Content:
1. ...
2. ...
3. ...

Tips:
1. ...
2. ...
3. ...
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "")
      .replace(/---/g, "")
      .replace(/\*/g, "")
      .trim();

    res.json({ success: true, content: text });
  } catch (err) {
    console.error("Gemini Placement Error:", err);
    res.status(500).json({
      success: false,
      message: "Error generating placement content",
    });
  }
});

// ================== PROJECT ==================
app.post("/api/project/generate", async (req, res) => {
  try {
    const { domain, interest, difficulty } = req.body;

    if (!domain || !interest || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Please provide domain, interest, and difficulty",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    const prompt = `
You are a final year project mentor.

Domain: ${domain}
Interest: ${interest}
Difficulty: ${difficulty}

Generate a project idea.

Rules:
- No markdown
- Plain text
- Numbering only

Output:

Project Title:
...

Description:
...

Features:
1. ...
2. ...
3. ...

Tech Stack:
1. ...
2. ...

Future Scope:
1. ...
2. ...
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "")
      .replace(/---/g, "")
      .replace(/\*/g, "")
      .trim();

    res.json({ success: true, content: text });
  } catch (err) {
    console.error("Gemini Project Error:", err);
    res.status(500).json({
      success: false,
      message: "Error generating project content",
    });
  }
});

// ================== LEARNING DOUBT ==================
app.post("/api/learning/doubt", async (req, res) => {
  try {
    const { subject, lessonTitle, doubt } = req.body;

    if (!subject || !lessonTitle || !doubt) {
      return res.status(400).json({
        success: false,
        message: "Please provide subject, lesson title, and doubt",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    const prompt = `
You are a helpful teacher helping an Indian college student.

Subject: ${subject}
Lesson: ${lessonTitle}
Student doubt: ${doubt}

Rules:
- Use plain clean text only
- No markdown
- No ** or # or ---
- Keep answer clear and beginner-friendly
- If needed, explain with one simple example
- Keep answer focused only on the doubt

Output format:

Lesson:
${lessonTitle}

Answer:
[clear explanation]

Simple Example:
[if useful]

What To Remember:
1. ...
2. ...
3. ...
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "")
      .replace(/---/g, "")
      .replace(/\*/g, "")
      .trim();

    return res.json({
      success: true,
      content: text,
    });
  } catch (error) {
    console.error("Gemini Doubt Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error generating doubt answer",
    });
  }
});

// ================== SERVER ==================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});