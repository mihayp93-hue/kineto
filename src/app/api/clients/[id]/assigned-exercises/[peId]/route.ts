import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; peId: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { peId } = await params;
  const body = await request.json();

  const updated = await prisma.planExercise.update({
    where: { id: peId },
    data: {
      sets: body.sets,
      reps: body.reps,
      holdSeconds: body.holdSeconds,
      frequencyPerWeek: body.frequencyPerWeek,
      notes: body.notes,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; peId: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { peId } = await params;
  await prisma.planExercise.delete({ where: { id: peId } });
  return NextResponse.json({ success: true });
}
