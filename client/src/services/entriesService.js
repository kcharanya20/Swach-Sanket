import api from "./api";

// 🧩 GET /api/entries?dateKey=YYYY-MM-DD
export const getEntryByDate = async (dateKey) => {
  try {
    const res = await api.get(`/api/entries?dateKey=${dateKey}`);
    return res.data.entry || { dateKey, data: {} };
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_id");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};

// 🧩 PUT /api/entries/:dateKey
export const upsertEntry = async (dateKey, data) => {
  try {
    const res = await api.put(`/api/entries/${dateKey}`, { data });
    return res.data.entry;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_id");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};

// 🧩 DELETE /api/entries/:dateKey
export const deleteEntryByDate = async (dateKey) => {
  try {
    const res = await api.delete(`/api/entries/${dateKey}`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_id");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};

// 🧩 GET /api/entries/history?limit=30
export const getEntriesHistory = async (limit = 30) => {
  try {
    const res = await api.get(`/api/entries/history?limit=${limit}`);
    return res.data.entries || [];
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_id");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};
