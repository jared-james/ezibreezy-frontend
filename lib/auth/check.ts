// lib/auth/check.ts

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserAndOrganization } from "@/lib/auth";

export async function requireAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export { getUserAndOrganization };
