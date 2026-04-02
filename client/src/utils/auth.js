export const AUTH_KEYS = {
  USERS: "cm_auth_users",
  SESSION: "cm_auth_session",
};

const getUsers = () => {
  const data = localStorage.getItem(AUTH_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
};

export const signupUser = ({ name, email, password }) => {
  const users = getUsers();

  const alreadyExists = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (alreadyExists) {
    return {
      success: false,
      message: "Account already exists with this email.",
    };
  }

  const newUser = {
    name,
    email,
    password,
  };

  users.push(newUser);
  saveUsers(users);

  localStorage.setItem(
    AUTH_KEYS.SESSION,
    JSON.stringify({
      isLoggedIn: true,
      email: newUser.email,
      name: newUser.name,
    })
  );

  return {
    success: true,
    user: newUser,
  };
};

export const getSavedUser = (email = "") => {
  const users = getUsers();

  if (!email) return null;

  return (
    users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ||
    null
  );
};

export const loginUser = ({ email, password }) => {
  const users = getUsers();

  const savedUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (!savedUser) {
    return {
      success: false,
      message: "No account found with this email. Please sign up first.",
    };
  }

  if (savedUser.password !== password) {
    return {
      success: false,
      message: "Invalid password.",
    };
  }

  localStorage.setItem(
    AUTH_KEYS.SESSION,
    JSON.stringify({
      isLoggedIn: true,
      email: savedUser.email,
      name: savedUser.name,
    })
  );

  return {
    success: true,
    user: savedUser,
  };
};

export const getSession = () => {
  const data = localStorage.getItem(AUTH_KEYS.SESSION);
  return data ? JSON.parse(data) : null;
};

export const isAuthenticated = () => {
  const session = getSession();
  return !!session?.isLoggedIn;
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_KEYS.SESSION);
};