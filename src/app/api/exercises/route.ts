import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tagId = url.searchParams.get("tagId");

  const exercises = await prisma.exercise.findMany({
    where: tagId ? { tags: { some: { id: tagId } } } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      annotations: { orderBy: { timestampSec: "asc" } },
      tags: true,
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

  const tagIds: string[] = Array.isArray(data.tagIds) ? data.tagIds : [];

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
      tags: tagIds.length
        ? { connect: tagIds.map((id) => ({ id })) }
        : undefined,
    },
    include: { tags: true },
  });

  return NextResponse.json(exercise, { status: 201 });
}
