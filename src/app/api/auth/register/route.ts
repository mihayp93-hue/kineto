import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { email, name, role = "ADMIN" } = await request.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(existing);
  }

  const user = await prisma.user.create({
    data: { email, name, role },
  });

  return NextResponse.json(user);
}
