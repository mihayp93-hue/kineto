import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  const completion = await prisma.exerciseCompletion.create({
    data: {
      planExerciseId: data.planExerciseId,
      setsCompleted: data.setsCompleted,
      repsCompleted: data.repsCompleted,
      painLevel: data.painLevel,
      difficultyFelt: data.difficultyFelt,
      rangeOfMotion: data.rangeOfMotion,
      notes: data.notes,
    },
  });

  return NextResponse.json(completion, { status: 201 });
}
