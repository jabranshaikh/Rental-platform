import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getProperties as fetchProperties,
  createProperty as createPropertyApi,
  updateProperty as updatePropertyApi,
  deleteProperty as deletePropertyApi,
} from "../api/propertiesApi";

const PropertiesContext = createContext();

function PropertiesProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // GET ALL PROPERTIES
  // ==============================

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetchProperties();

      if (response.success) {
        setProperties(response.properties || []);
      } else {
        setError(
          response.message || "Failed to load properties."
        );
      }
    } catch (error) {
      console.error("Load Properties Error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load properties."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD PROPERTIES ON START
  // ==============================

  useEffect(() => {
    loadProperties();
  }, []);

  // ==============================
  // CREATE PROPERTY
  // ==============================

  const addProperty = async (propertyData, token) => {
    try {
      const response = await createPropertyApi(
        propertyData,
        token
      );

      if (response.success) {
        setProperties((currentProperties) => [
          response.property,
          ...currentProperties,
        ]);
      }

      return response;
    } catch (error) {
      console.error("Add Property Error:", error);
      throw error;
    }
  };

  // ==============================
  // UPDATE PROPERTY
  // ==============================

  const updateProperty = async (
    propertyId,
    updatedData,
    token
  ) => {
    try {
      if (!propertyId) {
        throw new Error("Property ID is required.");
      }

      const response = await updatePropertyApi(
        propertyId,
        updatedData,
        token
      );

      if (response.success) {
        setProperties((currentProperties) =>
          currentProperties.map((property) =>
            String(property._id || property.id) ===
            String(propertyId)
              ? response.property
              : property
          )
        );
      }

      return response;
    } catch (error) {
      console.error("Update Property Error:", error);
      throw error;
    }
  };

  // ==============================
  // DELETE PROPERTY
  // ==============================

  const deleteProperty = async (
    propertyId,
    token
  ) => {
    try {
      if (!propertyId) {
        throw new Error("Property ID is required.");
      }

      const response = await deletePropertyApi(
        propertyId,
        token
      );

      if (response.success) {
        setProperties((currentProperties) =>
          currentProperties.filter(
            (property) =>
              String(property._id || property.id) !==
              String(propertyId)
          )
        );
      }

      return response;
    } catch (error) {
      console.error("Delete Property Error:", error);
      throw error;
    }
  };

  // ==============================
  // GET SINGLE PROPERTY
  // ==============================

  /*
    IMPORTANT:

    PropertyDetails.jsx uses:

      const property = getPropertyById(id);

    Therefore this function must return
    the actual property object immediately.

    We already load all properties into
    `properties`, so there is no need to
    make this function async.
  */

  const getPropertyById = (propertyId) => {
    if (!propertyId) {
      return null;
    }

    const property = properties.find(
      (property) =>
        String(property._id || property.id) ===
        String(propertyId)
    );

    return property || null;
  };

  // ==============================
  // GET PROPERTIES BY OWNER
  // ==============================

  const getPropertiesByOwner = (ownerId) => {
    if (!ownerId) {
      return [];
    }

    return properties.filter((property) => {
      const propertyOwnerId =
        property.ownerId?._id ||
        property.ownerId;

      return (
        String(propertyOwnerId) ===
        String(ownerId)
      );
    });
  };

  // ==============================
  // REFRESH PROPERTIES
  // ==============================

  const refreshProperties = async () => {
    await loadProperties();
  };

  // ==============================
  // PROVIDER
  // ==============================

  return (
    <PropertiesContext.Provider
      value={{
        properties,
        loading,
        error,
        addProperty,
        updateProperty,
        deleteProperty,
        getPropertyById,
        getPropertiesByOwner,
        refreshProperties,
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
}

// ==============================
// USE PROPERTIES
// ==============================

export function useProperties() {
  const context = useContext(PropertiesContext);

  if (!context) {
    throw new Error(
      "useProperties must be used inside PropertiesProvider"
    );
  }

  return context;
}

export default PropertiesProvider;