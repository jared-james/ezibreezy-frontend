// lib/api/index.ts
import axios from "axios";
import { createClient } from "@/lib/supabase/client";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (apiKey) {
      config.headers["x-api-key"] = apiKey;
    }

    if (session) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    // Add workspace header for operational endpoints
    // Skip auth endpoints and user context endpoint
    if (
      !config.url?.startsWith("/auth") &&
      !config.url?.startsWith("/users/me/context")
    ) {
      // Get current workspace from localStorage
      if (typeof window !== "undefined") {
        const workspaceId = localStorage.getItem("currentWorkspaceId");

        if (workspaceId) {
          config.headers["x-workspace-id"] = workspaceId;
        } else {
          console.warn(
            "⚠️ No workspace selected - API call may fail:",
            config.url
          );
        }
      }
    }

    return config;
  },
  (error) => {
    console.error("🔴 Interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
