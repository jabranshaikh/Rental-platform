import axios from "axios";

const API_URL =
  "http://localhost:5000/api/admin";


// ==============================
// ADMIN STATS
// ==============================

export const getAdminStats = async (
  token
) => {
  const response = await axios.get(
    `${API_URL}/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ==============================
// RECENT USERS
// ==============================

export const getRecentUsers = async (
  token
) => {
  const response = await axios.get(
    `${API_URL}/recent-users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ==============================
// RECENT PROPERTIES
// ==============================

export const getRecentProperties =
  async (token) => {
    const response = await axios.get(
      `${API_URL}/recent-properties`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };


// ==============================
// RECENT REQUESTS
// ==============================

export const getRecentRequests =
  async (token) => {
    const response = await axios.get(
      `${API_URL}/recent-requests`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };