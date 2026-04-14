import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Role } from "@/generated/prisma/client";

function isDevMode() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url.includes("placeholder");
}

export async function getSession() {
  if (isDevMode()) {
    // In dev mode, check cookie for role selection
    const cookieStore = await cookies();
    const devRole = cookieStore.get("dev-role")?.value;
    return { email: devRole === "CLIENT" ? "client@example.com" : "admin@physioconnect.com" };
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.email! },
    include: { clientProfile: true },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(role: Role) {
  const user = await requireAuth();
  if (user.role !== role) {
    redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
  }
  return user;
}
