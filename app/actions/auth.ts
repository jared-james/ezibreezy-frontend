// app/actions/auth.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers"; // Import headers
import { syncUser } from "./user";

// --- 1. SETUP SIMPLE RATE LIMITER ---
const RATE_LIMIT_DURATION = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5; // 5 attempts per IP per duration

interface RateLimitRecord {
  count: number;
  firstAttempt: number;
}

// Note: In serverless (Vercel), this Map resets when the lambda spins down.
// For "easiest" implementation, this is usually sufficient.
// For strict production, use Redis (e.g., Upstash).
const rateLimitMap = new Map<string, RateLimitRecord>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (now - record.firstAttempt > RATE_LIMIT_DURATION) {
    // Reset if duration passed
    rateLimitMap.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count += 1;
  return true;
}
// ------------------------------------

interface LoginResult {
  success: boolean;
  error?: string;
  user?: { email: string };
}

export async function login(formData: FormData): Promise<LoginResult> {
  // --- 2. APPLY RATE LIMIT CHECK ---
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") || "unknown";

  if (!checkRateLimit(ip)) {
    return {
      success: false,
      error: "Too many login attempts. Please try again in a minute.",
    };
  }
  // ------------------------------------

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Optional: Return a specific error if Supabase rate limits you (HTTP 429)
    if (error.status === 429) {
      return { success: false, error: "Too many requests. Please wait." };
    }
    return { success: false, error: error.message };
  }

  if (data.user && !data.user.email_confirmed_at) {
    await supabase.auth.signOut();
    return { success: false, error: "Please verify your email address." };
  }

  const syncResult = await syncUser();

  if (!syncResult.success) {
    console.error("Login sync failed:", syncResult.error);
    // Optional: Decide if you want to block login if sync fails,
    // or just let them through and hope a subsequent page load fixes it.
  }

  revalidatePath("/", "layout");

  return {
    success: true,
    user: { email: data.user.email || "" },
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

interface SignupResult {
  success: boolean;
  error?: string;
}

export async function signup(formData: FormData): Promise<SignupResult> {
  // Apply rate limit check
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") || "unknown";

  if (!checkRateLimit(ip)) {
    return {
      success: false,
      error: "Too many signup attempts. Please try again in a minute.",
    };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const inviteToken = formData.get("inviteToken") as string | null;

  const supabase = await createClient();

  // Construct emailRedirectTo URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let emailRedirectTo = `${siteUrl}/auth/callback`;

  if (inviteToken) {
    emailRedirectTo += `?invite_token=${inviteToken}`;
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        displayName: name,
      },
    },
  });

  if (error) {
    // Handle Supabase rate limiting
    if (error.status === 429) {
      return { success: false, error: "Too many requests. Please wait." };
    }
    return { success: false, error: error.message };
  }

  return { success: true };
}
