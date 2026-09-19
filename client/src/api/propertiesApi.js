import axios from "axios";

const API_URL = "http://localhost:5000/api/properties";

// ==============================
// GET ALL PROPERTIES
// ==============================
export const getProperties = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ==============================
// GET SINGLE PROPERTY
// ==============================
export const getPropertyById = async (propertyId) => {
  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  const response = await axios.get(`${API_URL}/${propertyId}`);

  return response.data;
};

// ==============================
// CREATE PROPERTY
// ==============================
export const createProperty = async (propertyData, token) => {
  const response = await axios.post(API_URL, propertyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ==============================
// UPDATE PROPERTY
// ==============================
export const updateProperty = async (
  propertyId,
  propertyData,
  token
) => {
  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  const response = await axios.put(
    `${API_URL}/${propertyId}`,
    propertyData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ==============================
// DELETE PROPERTY
// ==============================
export const deleteProperty = async (propertyId, token) => {
  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  const response = await axios.delete(
    `${API_URL}/${propertyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};