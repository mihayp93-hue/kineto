import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      annotations: { orderBy: { timestampSec: "asc" } },
      _count: { select: { planExercises: true } },
    },
  });
  return NextResponse.json(exercises);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  const exercise = await prisma.exercise.create({
    data: {
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
      duration: data.duration,
      category: data.category,
      difficulty: data.difficulty,
      bodyPart: data.bodyPart || [],
      equipment: data.equipment || [],
      instructions: data.instructions,
      createdById: user.id,
    },
  });

  return NextResponse.json(exercise, { status: 201 });
}
