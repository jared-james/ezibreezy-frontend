// lib/api/index.ts
import axios from "axios";

console.log("=== API Client Configuration ===");
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
console.log(
  "API Key configured:",
  process.env.NEXT_PUBLIC_API_KEY ? "YES" : "NO"
);
console.log(
  "API Key preview:",
  process.env.NEXT_PUBLIC_API_KEY?.substring(0, 10) + "..."
);

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Add API key to every request via interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log("=== Outgoing Request ===");
    console.log("URL:", config.url);
    console.log("Method:", config.method);
    console.log("BaseURL:", config.baseURL);

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    console.log(
      "API Key from env:",
      apiKey ? apiKey.substring(0, 10) + "..." : "MISSING"
    );

    if (apiKey) {
      config.headers["x-api-key"] = apiKey;
      console.log(
        "API Key added to headers:",
        config.headers["x-api-key"].substring(0, 10) + "..."
      );
    } else {
      console.error("NO API KEY FOUND IN ENVIRONMENT!");
    }

    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    console.log("Final headers:", JSON.stringify(config.headers));
    console.log("======================");

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log("=== Response Received ===");
    console.log("Status:", response.status);
    console.log("Data:", response.data);
    console.log("========================");
    return response;
  },
  (error) => {
    console.error("=== API Error ===");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Headers:", error.response?.headers);
    console.error("================");
    return Promise.reject(error);
  }
);

export default apiClient;
