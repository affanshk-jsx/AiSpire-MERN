import axios from "axios";

const API_URL = "/api/auth/";

/**
 * Normalize backend user data so both admin and user are handled cleanly.
 */
const normalizeUser = (data) => {
  return {
    _id: data?._id,
    name: data?.name,
    email: data?.email,
    role: data?.role || "user",
    isAdmin: data?.isAdmin || data?.role === "admin" || false,
    token: data?.token || null,
  };
};

// ✅ Register user
const register = async (userData) => {
  try {
    const response = await axios.post(API_URL + "register", userData);
    const user = normalizeUser(response.data);

    // Save entire user object
    localStorage.setItem("user", JSON.stringify(user));
    if (user.token) localStorage.setItem("token", user.token);

    console.log("✅ Registered user saved:", user);
    return user;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Registration failed.";
    return Promise.reject(new Error(message));
  }
};

// ✅ Login user
const login = async (userData) => {
  try {
    const response = await axios.post(API_URL + "login", userData);
    const user = normalizeUser(response.data);

    // Save entire user object
    localStorage.setItem("user", JSON.stringify(user));
    if (user.token) localStorage.setItem("token", user.token);

    console.log("✅ Login user saved:", user);
    return user;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Invalid credentials.";
    return Promise.reject(new Error(message));
  }
};

const authService = { register, login };
export default authService;
