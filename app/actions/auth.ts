// app/actions/auth.ts
"use server";

import { createClient } from "@/lib/supabase/server"; // Ensure you use the SERVER client
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Add this interface
interface LoginResult {
  success: boolean;
  error?: string;
  user?: { email: string }; // Return basic info for PostHog if needed
}

export async function login(formData: FormData): Promise<LoginResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Check email verification strictly on the server
  if (data.user && !data.user.email_confirmed_at) {
    // Optional: Sign them out immediately if you strictly enforce verification
    await supabase.auth.signOut();
    return { success: false, error: "Please verify your email address." };
  }

  // We revalidate the layout to update server components (headers, etc.)
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
