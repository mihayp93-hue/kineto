import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: {
      clientProfile: {
        include: { assignedPlans: { where: { status: "ACTIVE" } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  // Check if email already exists
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 400 }
    );
  }

  const client = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: "CLIENT",
      clientProfile: {
        create: {
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          medicalNotes: data.medicalNotes,
          emergencyContact: data.emergencyContact,
        },
      },
    },
    include: { clientProfile: true },
  });

  return NextResponse.json(client, { status: 201 });
}
