import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = await prisma.user.findUnique({
    where: { id, role: "CLIENT" },
    include: {
      clientProfile: {
        include: {
          assignedPlans: {
            include: {
              exercises: {
                include: { exercise: true, completions: true },
              },
            },
          },
        },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(client);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await request.json();

  const client = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      phone: data.phone,
      clientProfile: {
        update: {
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          medicalNotes: data.medicalNotes,
          emergencyContact: data.emergencyContact,
          status: data.status,
        },
      },
    },
    include: { clientProfile: true },
  });

  return NextResponse.json(client);
}
