import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SavedPropertiesContext = createContext();

function SavedPropertiesProvider({ children }) {
  const [savedProperties, setSavedProperties] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "staynest_saved_properties"
      );

      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error(
        "Error loading saved properties:",
        error
      );

      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "staynest_saved_properties",
      JSON.stringify(savedProperties)
    );
  }, [savedProperties]);

  const isSaved = (propertyId) => {
    return savedProperties.some(
      (property) => property.id === propertyId
    );
  };

  const toggleSaveProperty = (property) => {
    setSavedProperties((currentSaved) => {
      const alreadySaved = currentSaved.some(
        (savedProperty) =>
          savedProperty.id === property.id
      );

      if (alreadySaved) {
        return currentSaved.filter(
          (savedProperty) =>
            savedProperty.id !== property.id
        );
      }

      return [...currentSaved, property];
    });
  };

  const removeSavedProperty = (propertyId) => {
    setSavedProperties((currentSaved) =>
      currentSaved.filter(
        (property) => property.id !== propertyId
      )
    );
  };

  const clearSavedProperties = () => {
    setSavedProperties([]);
  };

  return (
    <SavedPropertiesContext.Provider
      value={{
        savedProperties,
        isSaved,
        toggleSaveProperty,
        removeSavedProperty,
        clearSavedProperties,
      }}
    >
      {children}
    </SavedPropertiesContext.Provider>
  );
}

export function useSavedProperties() {
  const context = useContext(
    SavedPropertiesContext
  );

  if (!context) {
    throw new Error(
      "useSavedProperties must be used inside SavedPropertiesProvider"
    );
  }

  return context;
}

export default SavedPropertiesProvider;