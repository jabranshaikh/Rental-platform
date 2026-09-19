import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createRequest as createRequestApi,
  getMyRequests,
  getOwnerRequests,
  approveRequest as approveRequestApi,
  rejectRequest as rejectRequestApi,
  deleteRequest as deleteRequestApi,
} from "../api/requestsApi";

import { useAuth } from "./AuthContext";

const RequestsContext = createContext();

function RequestsProvider({ children }) {
  const { user, token } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // LOAD REQUESTS
  // ==============================
  useEffect(() => {
    const loadRequests = async () => {
      if (!token || !user) {
        setRequests([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        let response;

        // USER → get their own requests
        if (user.role === "user") {
          response = await getMyRequests(token);
        }

        // OWNER → get requests sent to them
        else if (user.role === "owner") {
          response = await getOwnerRequests(token);
        }

        // ADMIN → don't load rental requests
        else if (user.role === "admin") {
          setRequests([]);
          setLoading(false);
          return;
        }

        if (response?.success) {
          setRequests(response.requests || []);
        } else {
          setError(
            response?.message ||
              "Failed to load requests."
          );
        }
      } catch (error) {
        console.error(
          "Load Requests Error:",
          error
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load requests."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [token, user]);

  // ==============================
  // CREATE REQUEST
  // ==============================
  const addRequest = async (requestData) => {
    try {
      if (!token) {
        throw new Error(
          "You must be logged in to send a request."
        );
      }

      setError("");

      /*
        IMPORTANT:

        We only send propertyId, requestType,
        preferred date/time and message.

        The backend determines:
        - userId
        - userName
        - userEmail
        - ownerId
        - ownerName
        - ownerEmail

        This prevents the frontend from deciding
        who receives the request.
      */

      const response = await createRequestApi(
        {
          propertyId: requestData.propertyId,
          requestType: requestData.requestType,
          preferredDate:
            requestData.preferredDate || "",
          preferredTime:
            requestData.preferredTime || "",
          message: requestData.message || "",
        },
        token
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to submit request."
        );
      }

      const newRequest = response.request;

      /*
        Add the real MongoDB request to state.
      */
      setRequests((currentRequests) => [
        newRequest,
        ...currentRequests,
      ]);

      return response;
    } catch (error) {
      console.error(
        "Create Request Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit request."
      );

      throw error;
    }
  };

  // ==============================
  // APPROVE REQUEST
  // ==============================
  const updateRequestStatus = async (
    requestId,
    newStatus
  ) => {
    try {
      if (!token) {
        throw new Error(
          "You must be logged in."
        );
      }

      let response;

      if (newStatus === "Approved") {
        response = await approveRequestApi(
          requestId,
          token
        );
      } else if (newStatus === "Rejected") {
        response = await rejectRequestApi(
          requestId,
          token
        );
      } else {
        throw new Error(
          "Invalid request status."
        );
      }

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to update request."
        );
      }

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          String(request._id || request.id) ===
          String(requestId)
            ? {
                ...request,
                status: newStatus,
              }
            : request
        )
      );

      return response;
    } catch (error) {
      console.error(
        "Update Request Status Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update request."
      );

      throw error;
    }
  };

  // ==============================
  // REMOVE REQUEST
  // ==============================
  const removeRequest = async (requestId) => {
    try {
      if (!token) {
        throw new Error(
          "You must be logged in."
        );
      }

      const response = await deleteRequestApi(
        requestId,
        token
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to delete request."
        );
      }

      setRequests((currentRequests) =>
        currentRequests.filter(
          (request) =>
            String(request._id || request.id) !==
            String(requestId)
        )
      );

      return response;
    } catch (error) {
      console.error(
        "Remove Request Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete request."
      );

      throw error;
    }
  };

  // ==============================
  // CLEAR REQUESTS
  // ==============================
  const clearRequests = () => {
    setRequests([]);
  };

  // ==============================
  // REQUEST FILTERS
  // ==============================
  const pendingRequests = requests.filter(
    (request) =>
      request.status === "Pending"
  );

  const approvedRequests = requests.filter(
    (request) =>
      request.status === "Approved"
  );

  const rejectedRequests = requests.filter(
    (request) =>
      request.status === "Rejected"
  );

  // ==============================
  // REFRESH REQUESTS
  // ==============================
  const refreshRequests = async () => {
    if (!token || !user) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      let response;

      if (user.role === "user") {
        response = await getMyRequests(token);
      } else if (user.role === "owner") {
        response = await getOwnerRequests(token);
      } else {
        setRequests([]);
        return;
      }

      if (response?.success) {
        setRequests(response.requests || []);
      }
    } catch (error) {
      console.error(
        "Refresh Requests Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to refresh requests."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequestsContext.Provider
      value={{
        requests,
        loading,
        error,

        addRequest,
        updateRequestStatus,
        removeRequest,
        clearRequests,
        refreshRequests,

        pendingRequests,
        approvedRequests,
        rejectedRequests,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
}

// ==============================
// USE REQUESTS HOOK
// ==============================
export function useRequests() {
  const context = useContext(
    RequestsContext
  );

  if (!context) {
    throw new Error(
      "useRequests must be used inside RequestsProvider"
    );
  }

  return context;
}

export default RequestsProvider;