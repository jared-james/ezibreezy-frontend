// lib/api/index.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
});

// You can also add interceptors here for handling errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors or handle them as needed
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
