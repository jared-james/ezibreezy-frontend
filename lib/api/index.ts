// lib/api/index.ts
import axios from "axios";
import { createClient } from "@/lib/supabase/client";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    console.log("🔵 Interceptor starting...");
    const supabase = createClient();
    console.log("🔵 Supabase client created");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("🔵 Session retrieved:", session ? "exists" : "null");

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (apiKey) {
      config.headers["x-api-key"] = apiKey;
    }

    if (session) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
      console.log("🔵 Auth header set");
    }

    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    console.log("🔵 Interceptor complete, making request to:", config.url);
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
