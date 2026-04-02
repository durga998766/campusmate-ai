import { getSession } from "./auth";

export const STORAGE_KEYS = {
  STUDY_COUNT: "cm_study_count",
  PLACEMENT_COUNT: "cm_placement_count",
  PROJECT_COUNT: "cm_project_count",
  RECENT_ACTIVITIES: "cm_recent_activities",
  WEEKLY_ACTIVITY: "cm_weekly_activity",
  PROFILE: "cm_profile_data",
  LEARNING_PROGRESS: "cm_learning_progress",
};

const getCurrentUserKey = () => {
  const session = getSession();
  const email = session?.email || "guest";
  return email.toLowerCase().replace(/[^a-z0-9]/g, "_");
};

const getScopedKey = (baseKey) => {
  return `${baseKey}_${getCurrentUserKey()}`;
};

export const getNumber = (key) => {
  return Number(localStorage.getItem(getScopedKey(key))) || 0;
};

export const setNumber = (key, value) => {
  localStorage.setItem(getScopedKey(key), String(value));
};

export const getRecentActivities = () => {
  const data = localStorage.getItem(getScopedKey(STORAGE_KEYS.RECENT_ACTIVITIES));
  return data ? JSON.parse(data) : [];
};

export const saveRecentActivity = (activity) => {
  const existing = getRecentActivities();
  const updated = [activity, ...existing].slice(0, 12);

  localStorage.setItem(
    getScopedKey(STORAGE_KEYS.RECENT_ACTIVITIES),
    JSON.stringify(updated)
  );
};

export const incrementModuleCount = (moduleName) => {
  if (moduleName === "study") {
    const current = getNumber(STORAGE_KEYS.STUDY_COUNT);
    setNumber(STORAGE_KEYS.STUDY_COUNT, current + 1);
    addWeeklyMinutes(20);
  }

  if (moduleName === "placement") {
    const current = getNumber(STORAGE_KEYS.PLACEMENT_COUNT);
    setNumber(STORAGE_KEYS.PLACEMENT_COUNT, current + 1);
    addWeeklyMinutes(15);
  }

  if (moduleName === "project") {
    const current = getNumber(STORAGE_KEYS.PROJECT_COUNT);
    setNumber(STORAGE_KEYS.PROJECT_COUNT, current + 1);
    addWeeklyMinutes(25);
  }
};

export const getAllStats = () => {
  const study = getNumber(STORAGE_KEYS.STUDY_COUNT);
  const placement = getNumber(STORAGE_KEYS.PLACEMENT_COUNT);
  const project = getNumber(STORAGE_KEYS.PROJECT_COUNT);

  return {
    study,
    placement,
    project,
    total: study + placement + project,
  };
};

const defaultWeeklyData = () => ({
  Sun: 0,
  Mon: 0,
  Tue: 0,
  Wed: 0,
  Thu: 0,
  Fri: 0,
  Sat: 0,
});

export const getWeeklyActivity = () => {
  const data = localStorage.getItem(getScopedKey(STORAGE_KEYS.WEEKLY_ACTIVITY));
  return data ? JSON.parse(data) : defaultWeeklyData();
};

export const addWeeklyMinutes = (minutes) => {
  const weekly = getWeeklyActivity();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = days[new Date().getDay()];

  weekly[today] = (weekly[today] || 0) + minutes;

  localStorage.setItem(
    getScopedKey(STORAGE_KEYS.WEEKLY_ACTIVITY),
    JSON.stringify(weekly)
  );
};

export const getProfileData = () => {
  const data = localStorage.getItem(getScopedKey(STORAGE_KEYS.PROFILE));
  return data
    ? JSON.parse(data)
    : {
        fullName: "",
        email: "",
        learningGoal: "",
        preferredDomain: "",
        targetRole: "",
        bio: "",
      };
};

export const saveProfileData = (profile) => {
  localStorage.setItem(
    getScopedKey(STORAGE_KEYS.PROFILE),
    JSON.stringify(profile)
  );
};

export const getLearningProgress = () => {
  const data = localStorage.getItem(
    getScopedKey(STORAGE_KEYS.LEARNING_PROGRESS)
  );
  return data ? JSON.parse(data) : {};
};

export const saveLearningProgress = (progress) => {
  localStorage.setItem(
    getScopedKey(STORAGE_KEYS.LEARNING_PROGRESS),
    JSON.stringify(progress)
  );
};

export const resetCurrentUserData = () => {
  localStorage.removeItem(getScopedKey(STORAGE_KEYS.STUDY_COUNT));
  localStorage.removeItem(getScopedKey(STORAGE_KEYS.PLACEMENT_COUNT));
  localStorage.removeItem(getScopedKey(STORAGE_KEYS.PROJECT_COUNT));
  localStorage.removeItem(getScopedKey(STORAGE_KEYS.RECENT_ACTIVITIES));
  localStorage.removeItem(getScopedKey(STORAGE_KEYS.WEEKLY_ACTIVITY));
  localStorage.removeItem(getScopedKey(STORAGE_KEYS.PROFILE));
  localStorage.removeItem(getScopedKey(STORAGE_KEYS.LEARNING_PROGRESS));
};

export const getRecommendedNextStep = () => {
  const stats = getAllStats();

  if (stats.study === 0) return "Start with Study Prep to build your concepts.";
  if (stats.placement === 0) return "Continue with Placement Prep for interview readiness.";
  if (stats.project === 0) return "Use Project Assistant to explore a strong final year idea.";

  return "Open Learning Path and continue your structured learning journey.";
};

export const getAssistantReply = (message) => {
  const text = message.toLowerCase().trim();
  const profile = getProfileData();
  const stats = getAllStats();

  if (
    text.includes("campusmate") ||
    text.includes("what is this app") ||
    text.includes("about this app") ||
    text.includes("ye app kya hai") ||
    text.includes("what is campusmate")
  ) {
    return "CampusMate AI is a smart student support platform. It helps students in study preparation, placement preparation, project idea generation, structured learning through learning paths, doubt solving, and progress tracking.";
  }

  if (
    text.includes("study prep") ||
    text.includes("notes") ||
    text.includes("what should i study") ||
    text.includes("kya padhun") ||
    text.includes("study")
  ) {
    return "Study Prep helps you generate topic-wise notes, explanations, examples, and exam-focused points. You can enter a subject, topic, and difficulty level, and the system creates structured study content for you.";
  }

  if (
    text.includes("placement") ||
    text.includes("interview") ||
    text.includes("job prep") ||
    text.includes("placement prep")
  ) {
    return "Placement Prep helps you prepare for interviews and job readiness. It can generate technical, HR, and preparation-oriented content so that you can practice important concepts before placements.";
  }

  if (
    text.includes("project") ||
    text.includes("major project") ||
    text.includes("final year project")
  ) {
    return "Project Assistant helps you generate project ideas based on category, interest, and difficulty. It can suggest project title, description, features, tech stack, and future scope. It can be used for computer science as well as other engineering domains.";
  }

  if (
    text.includes("learning path") ||
    text.includes("roadmap") ||
    text.includes("course flow")
  ) {
    return "Learning Path gives you structured topic-wise learning. It includes lessons, embedded videos, tasks, progress tracking, and doubt support. It is useful for guided step-by-step learning instead of random studying.";
  }

  if (
    text.includes("progress") ||
    text.includes("activity") ||
    text.includes("graph") ||
    text.includes("analytics")
  ) {
    return "Progress and Activity tracks how much you are using the platform. It stores study sessions, placement sessions, project generations, lesson completions, and weekly estimated study effort in graph form from Sunday to Saturday.";
  }

  if (
    text.includes("profile") ||
    text.includes("account") ||
    text.includes("admin")
  ) {
    return "Profile page allows you to manage your user details such as name, email, learning goal, preferred domain, target role, and bio. It acts like a simple student account settings page inside the platform.";
  }

  if (
    text.includes("next step") ||
    text.includes("what should i do next") ||
    text.includes("what next") ||
    text.includes("next")
  ) {
    if (stats.study === 0) {
      return "Your best next step is to start with Study Prep and generate notes for one important subject. After that, open Learning Path for structured learning.";
    }

    if (stats.placement === 0) {
      return "You have started studying. Now the next best step is Placement Prep so that you also improve interview readiness along with academics.";
    }

    if (stats.project === 0) {
      return "A good next step is to use Project Assistant and shortlist one strong final year project idea based on your interest.";
    }

    return "You already have activity in multiple modules. Now the best step is to continue Learning Path, ask doubts when needed, and maintain consistent weekly study activity.";
  }

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
  ) {
    return `Hello ${profile.fullName || "Student"}! I am CampusMate Assistant. You can ask me about study prep, placement prep, project assistant, learning path, profile, progress tracking, or your next best step.`;
  }

  if (profile.preferredDomain) {
    return `Based on your profile, your preferred domain is ${profile.preferredDomain}. You currently have ${stats.total} tracked activities. A smart next step is to continue learning consistently and use the relevant module according to your goal.`;
  }

  return "I can help you understand CampusMate AI, Study Prep, Placement Prep, Project Assistant, Learning Path, Progress Tracking, Profile settings, or suggest your next best step. Try asking something specific.";
};