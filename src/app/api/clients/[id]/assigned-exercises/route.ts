import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET: list exercises assigned to this client (across active plans, ordered).
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = await prisma.clientProfile.findUnique({
    where: { userId: id },
    include: {
      assignedPlans: {
        where: { status: "ACTIVE" },
        include: {
          exercises: {
            include: { exercise: true },
            orderBy: { orderIndex: "asc" },
          },
        },
      },
    },
  });

  if (!profile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const items = profile.assignedPlans.flatMap((plan) =>
    plan.exercises.map((pe) => ({
      id: pe.id,
      planId: plan.id,
      planName: plan.name,
      exerciseId: pe.exerciseId,
      exercise: pe.exercise,
      sets: pe.sets,
      reps: pe.reps,
      holdSeconds: pe.holdSeconds,
      frequencyPerWeek: pe.frequencyPerWeek,
      notes: pe.notes,
    }))
  );

  return NextResponse.json(items);
}

// POST: attach an exercise to the client. Finds/creates a default active plan
// and appends the PlanExercise to it.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const profile = await prisma.clientProfile.findUnique({
    where: { userId: id },
  });
  if (!profile) {
    return NextResponse.json(
      { error: "Client profile not found" },
      { status: 404 }
    );
  }

  // Find or create an active plan for the client.
  let plan = await prisma.treatmentPlan.findFirst({
    where: { clientProfileId: profile.id, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  if (!plan) {
    plan = await prisma.treatmentPlan.create({
      data: {
        name: "Exerciții asignate",
        clientProfileId: profile.id,
        createdById: user.id,
        startDate: new Date(),
        status: "ACTIVE",
      },
    });
  }

  // Prevent duplicates
  const existing = await prisma.planExercise.findFirst({
    where: { treatmentPlanId: plan.id, exerciseId: body.exerciseId },
  });
  if (existing) {
    return NextResponse.json(existing);
  }

  const count = await prisma.planExercise.count({
    where: { treatmentPlanId: plan.id },
  });

  const planExercise = await prisma.planExercise.create({
    data: {
      treatmentPlanId: plan.id,
      exerciseId: body.exerciseId,
      sets: body.sets ?? 3,
      reps: body.reps ?? 10,
      holdSeconds: body.holdSeconds ?? null,
      frequencyPerWeek: body.frequencyPerWeek ?? 3,
      orderIndex: count,
      notes: body.notes ?? null,
    },
    include: { exercise: true },
  });

  return NextResponse.json(planExercise, { status: 201 });
}
