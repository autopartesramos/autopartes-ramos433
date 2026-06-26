"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("LOGIN ERROR:", error);

  if (error) {
    throw new Error("Email o contraseña incorrectos.");
  }

  redirect("/productos");
}