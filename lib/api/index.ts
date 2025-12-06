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

    // 1. Inject Auth Token
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    // 2. Inject API Key (for server-side validation)
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (apiKey) {
      config.headers["x-api-key"] = apiKey;
    }

    // 3. Set Content-Type
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    // 4. Inject Workspace Context from URL
    // We skip this for endpoints that:
    // - Are generic authentication routes
    // - Are fetching the user/workspace hierarchy itself
    const isExcluded =
      config.url?.startsWith("/auth") ||
      config.url?.startsWith("/users") ||
      config.url?.startsWith("/workspaces");

    if (!isExcluded) {
      // CRITICAL: Check if window is defined to prevent SSR breakage
      if (typeof window !== "undefined") {
        // Read workspace from URL (supports both slug and UUID)
        const urlParams = new URLSearchParams(window.location.search);
        const workspace = urlParams.get("workspace");

        if (workspace) {
          config.headers["x-workspace-id"] = workspace;
        } else {
          // If we are hitting a data endpoint without a workspace, it will likely 400/403.
          console.warn(
            "⚠️ No workspace in URL for data request:",
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
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      console.error("🔴 Unauthorized - redirecting to login");
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }

    if (error.response?.status === 403) {
      // Permission denied
      console.error("🔴 Permission denied:", error.response.data);
      // Optionally show a toast notification here
    }

    return Promise.reject(error);
  }
);

export default apiClient;
