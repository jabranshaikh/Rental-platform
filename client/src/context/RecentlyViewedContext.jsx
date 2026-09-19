import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const RecentlyViewedContext = createContext();

function RecentlyViewedProvider({ children }) {
  const [recentlyViewed, setRecentlyViewed] =
    useState(() => {
      try {
        const saved = localStorage.getItem(
          "staynest_recently_viewed"
        );

        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error(
          "Error loading recently viewed properties:",
          error
        );

        return [];
      }
    });

  useEffect(() => {
    localStorage.setItem(
      "staynest_recently_viewed",
      JSON.stringify(recentlyViewed)
    );
  }, [recentlyViewed]);

  const addRecentlyViewed = useCallback(
    (property) => {
      setRecentlyViewed((currentProperties) => {
        const filteredProperties =
          currentProperties.filter(
            (savedProperty) =>
              savedProperty.id !== property.id
          );

        return [
          property,
          ...filteredProperties,
        ].slice(0, 10);
      });
    },
    []
  );

  const removeRecentlyViewed = (propertyId) => {
    setRecentlyViewed((currentProperties) =>
      currentProperties.filter(
        (property) =>
          property.id !== propertyId
      )
    );
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  const isRecentlyViewed = (propertyId) => {
    return recentlyViewed.some(
      (property) =>
        property.id === propertyId
    );
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addRecentlyViewed,
        removeRecentlyViewed,
        clearRecentlyViewed,
        isRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(
    RecentlyViewedContext
  );

  if (!context) {
    throw new Error(
      "useRecentlyViewed must be used inside RecentlyViewedProvider"
    );
  }

  return context;
}

export default RecentlyViewedProvider;