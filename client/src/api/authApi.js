import axios from "axios";

const API_URL =
  "http://localhost:5000/api/auth";

// ==============================
// REGISTER
// ==============================

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/register`,
    userData
  );

  return response.data;
};

// ==============================
// LOGIN
// ==============================

export const loginUser = async (loginData) => {
  const response = await axios.post(
    `${API_URL}/login`,
    loginData
  );

  return response.data;
};

// ==============================
// GET CURRENT USER
// ==============================

export const getProfile = async (token) => {
  const response = await axios.get(
    `${API_URL}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};