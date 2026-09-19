const API_URL = "http://localhost:5000/api";

// ========================================
// Generic API Request
// ========================================

const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Something went wrong"
      );
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ========================================
// Authentication APIs
// ========================================

export const registerUser = async (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData)
  });
};

export const loginUser = async (userData) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData)
  });
};

// ========================================
// Property APIs
// ========================================

export const getProperties = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        queryParams.append(key, value);
      }
    }
  );

  const queryString =
    queryParams.toString();

  const endpoint = queryString
    ? `/properties?${queryString}`
    : "/properties";

  return apiRequest(endpoint);
};

export const getPropertyById = async (id) => {
  return apiRequest(`/properties/${id}`);
};

// ========================================
// Owner Property APIs
// ========================================

export const createProperty = async (
  propertyData,
  token
) => {
  return apiRequest("/properties", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(propertyData)
  });
};

export const updateProperty = async (
  id,
  propertyData,
  token
) => {
  return apiRequest(`/properties/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(propertyData)
  });
};

export const deleteProperty = async (
  id,
  token
) => {
  return apiRequest(`/properties/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export default apiRequest;