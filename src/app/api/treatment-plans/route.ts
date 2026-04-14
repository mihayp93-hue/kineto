import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const plans = await prisma.treatmentPlan.findMany({
    include: {
      clientProfile: { include: { user: true } },
      exercises: { include: { exercise: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  // Find the client profile
  const clientProfile = await prisma.clientProfile.findUnique({
    where: { userId: data.clientId },
  });

  if (!clientProfile) {
    return NextResponse.json(
      { error: "Client profile not found" },
      { status: 404 }
    );
  }

  const plan = await prisma.treatmentPlan.create({
    data: {
      name: data.name,
      description: data.description,
      clientProfileId: clientProfile.id,
      createdById: user.id,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      exercises: {
        create: data.exercises.map(
          (ex: {
            exerciseId: string;
            sets: number | null;
            reps: number | null;
            holdSeconds: number | null;
            frequencyPerWeek: number | null;
            orderIndex: number;
            notes: string | null;
          }) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            holdSeconds: ex.holdSeconds,
            frequencyPerWeek: ex.frequencyPerWeek,
            orderIndex: ex.orderIndex,
            notes: ex.notes,
          })
        ),
      },
    },
    include: {
      exercises: { include: { exercise: true } },
    },
  });

  return NextResponse.json(plan, { status: 201 });
}
