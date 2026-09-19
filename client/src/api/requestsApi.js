import axios from "axios";

const API_URL =
  "http://localhost:5000/api/requests";


// ==============================
// CREATE REQUEST
// ==============================

export const createRequest = async (
  requestData,
  token
) => {
  const response = await axios.post(
    API_URL,
    requestData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ==============================
// GET MY REQUESTS
// ==============================

export const getMyRequests = async (
  token
) => {
  const response = await axios.get(
    `${API_URL}/my`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ==============================
// GET OWNER REQUESTS
// ==============================

export const getOwnerRequests = async (
  token
) => {
  const response = await axios.get(
    `${API_URL}/owner`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ==============================
// APPROVE REQUEST
// ==============================

export const approveRequest = async (
  requestId,
  token
) => {
  const response = await axios.put(
    `${API_URL}/${requestId}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ==============================
// REJECT REQUEST
// ==============================

export const rejectRequest = async (
  requestId,
  token
) => {
  const response = await axios.put(
    `${API_URL}/${requestId}/reject`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ==============================
// DELETE REQUEST
// ==============================

export const deleteRequest = async (
  requestId,
  token
) => {
  const response = await axios.delete(
    `${API_URL}/${requestId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};