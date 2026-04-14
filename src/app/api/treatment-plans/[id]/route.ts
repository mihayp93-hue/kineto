import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const plan = await prisma.treatmentPlan.findUnique({
    where: { id },
    include: {
      clientProfile: { include: { user: true } },
      exercises: {
        include: {
          exercise: { include: { annotations: true } },
          completions: { orderBy: { completedAt: "desc" } },
          schedule: true,
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!plan) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(plan);
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

  const plan = await prisma.treatmentPlan.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      status: data.status,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });

  return NextResponse.json(plan);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.treatmentPlan.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
