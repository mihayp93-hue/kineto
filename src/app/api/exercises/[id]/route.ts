import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      annotations: { orderBy: { timestampSec: "asc" } },
      tags: true,
    },
  });

  if (!exercise) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(exercise);
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

  const tagIds: string[] | undefined = Array.isArray(data.tagIds)
    ? data.tagIds
    : undefined;

  const exercise = await prisma.exercise.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
      duration: data.duration,
      category: data.category,
      difficulty: data.difficulty,
      bodyPart: data.bodyPart,
      equipment: data.equipment,
      instructions: data.instructions,
      tags:
        tagIds !== undefined
          ? { set: tagIds.map((tid) => ({ id: tid })) }
          : undefined,
    },
    include: { tags: true },
  });

  return NextResponse.json(exercise);
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
  await prisma.exercise.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
