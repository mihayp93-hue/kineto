import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
  process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("[seed] No DATABASE_URL / DIRECT_DATABASE_URL set, skipping.");
  process.exit(0);
}

const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("[seed] Seeding database...");

  // 1. Admin (Dr. Physio) — dev-bypass login expects this email
  const admin = await prisma.user.upsert({
    where: { email: "admin@physioconnect.com" },
    update: {},
    create: {
      email: "admin@physioconnect.com",
      name: "Dr. Physio",
      role: "ADMIN",
    },
  });

  // 2. Client (Jane Doe) with a profile
  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      email: "client@example.com",
      name: "Jane Doe",
      phone: "+40 721 234 567",
      role: "CLIENT",
      clientProfile: {
        create: {
          status: "ACTIVE",
          dateOfBirth: new Date("1990-05-15"),
          medicalNotes:
            "Entorsă de gleznă suferită la alergare. Fizioterapie de 6 săptămâni.",
          emergencyContact: "John Doe — +40 722 111 222",
        },
      },
    },
    include: { clientProfile: true },
  });

  const profile =
    client.clientProfile ??
    (await prisma.clientProfile.findUnique({ where: { userId: client.id } }));

  if (!profile) {
    throw new Error("Client profile missing after upsert");
  }

  // 3. Sample exercises — idempotent via title+createdById
  const exerciseData = [
    {
      title: "Rotație externă umăr",
      description:
        "Exercițiu de mobilitate pentru articulația umărului. Crește amplitudinea mișcării și reduce tensiunea musculară.",
      videoUrl:
        "https://cdn.coverr.co/videos/coverr-a-man-doing-shoulder-exercises-6048/1080p.mp4",
      category: "Mobilitate",
      difficulty: "BEGINNER" as const,
      bodyPart: ["Umăr"],
      equipment: ["Bandă elastică"],
      duration: 120,
      instructions:
        "1. Stai drept cu brațul lipit de corp\n2. Îndoaie cotul la 90°\n3. Rotește antebrațul spre exterior\n4. Revino încet",
    },
    {
      title: "Extensii pentru genunchi",
      description:
        "Întărește cvadricepsul, esențial pentru stabilitatea genunchiului.",
      videoUrl:
        "https://cdn.coverr.co/videos/coverr-a-man-doing-squats-0127/1080p.mp4",
      category: "Forță",
      difficulty: "INTERMEDIATE" as const,
      bodyPart: ["Genunchi", "Coapsă"],
      equipment: [],
      duration: 180,
      instructions:
        "1. Așază-te pe un scaun\n2. Extinde complet un picior\n3. Ține 2 secunde\n4. Coboară controlat",
    },
    {
      title: "Flexii cu bandă elastică",
      description:
        "Exercițiu izometric pentru umeri, ideal pentru recuperare timpurie.",
      videoUrl:
        "https://cdn.coverr.co/videos/coverr-woman-doing-yoga-at-home-6226/1080p.mp4",
      category: "Forță",
      difficulty: "BEGINNER" as const,
      bodyPart: ["Umăr", "Piept"],
      equipment: ["Bandă elastică"],
      duration: 90,
    },
    {
      title: "Mobilizare cervicală",
      description:
        "Serie de mișcări lente pentru gât care reduc rigiditatea și durerea.",
      videoUrl:
        "https://cdn.coverr.co/videos/coverr-woman-stretching-in-the-park-5180/1080p.mp4",
      category: "Mobilitate",
      difficulty: "BEGINNER" as const,
      bodyPart: ["Cervical"],
      equipment: [],
      duration: 150,
    },
    {
      title: "Ridicări pe vârfuri",
      description: "Tonifică gambele și îmbunătățește propriocepția gleznei.",
      videoUrl:
        "https://cdn.coverr.co/videos/coverr-a-woman-jogs-on-the-beach-1543/1080p.mp4",
      category: "Forță",
      difficulty: "BEGINNER" as const,
      bodyPart: ["Gleznă", "Gambă"],
      equipment: [],
      duration: 120,
    },
  ];

  const exercises = [];
  for (const data of exerciseData) {
    const existing = await prisma.exercise.findFirst({
      where: { title: data.title, createdById: admin.id },
    });
    const ex =
      existing ??
      (await prisma.exercise.create({
        data: { ...data, createdById: admin.id },
      }));
    exercises.push(ex);
  }

  // 4. Treatment plan — only create if client has none
  const existingPlans = await prisma.treatmentPlan.count({
    where: { clientProfileId: profile.id },
  });

  if (existingPlans === 0) {
    const plan = await prisma.treatmentPlan.create({
      data: {
        name: "Recuperare gleznă — Faza 1",
        description:
          "Plan inițial de 4 săptămâni: mobilitate, propriocepție, întărire ușoară.",
        clientProfileId: profile.id,
        createdById: admin.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
        exercises: {
          create: [
            {
              exerciseId: exercises[4].id, // Ridicări pe vârfuri
              sets: 3,
              reps: 15,
              frequencyPerWeek: 5,
              orderIndex: 0,
              schedule: {
                create: [
                  { dayOfWeek: 1, timeOfDay: "08:00" },
                  { dayOfWeek: 3, timeOfDay: "08:00" },
                  { dayOfWeek: 5, timeOfDay: "08:00" },
                ],
              },
            },
            {
              exerciseId: exercises[3].id, // Mobilizare cervicală
              sets: 2,
              reps: 10,
              frequencyPerWeek: 3,
              orderIndex: 1,
              schedule: {
                create: [
                  { dayOfWeek: 2, timeOfDay: "18:00" },
                  { dayOfWeek: 4, timeOfDay: "18:00" },
                ],
              },
            },
            {
              exerciseId: exercises[1].id, // Extensii pentru genunchi
              sets: 3,
              reps: 12,
              frequencyPerWeek: 3,
              orderIndex: 2,
              schedule: {
                create: [
                  { dayOfWeek: 1, timeOfDay: "18:00" },
                  { dayOfWeek: 4, timeOfDay: "08:00" },
                ],
              },
            },
            {
              exerciseId: exercises[0].id, // Rotație externă umăr
              sets: 2,
              reps: 15,
              holdSeconds: 5,
              frequencyPerWeek: 3,
              orderIndex: 3,
            },
          ],
        },
      },
      include: { exercises: true },
    });

    // 5. Fake completions over last 10 days for progress charts
    for (let daysAgo = 0; daysAgo < 10; daysAgo++) {
      const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      const howMany = Math.floor(Math.random() * plan.exercises.length);
      for (let i = 0; i < howMany; i++) {
        await prisma.exerciseCompletion.create({
          data: {
            planExerciseId: plan.exercises[i].id,
            completedAt: date,
            setsCompleted: plan.exercises[i].sets ?? 3,
            repsCompleted: plan.exercises[i].reps ?? 10,
            painLevel: Math.max(
              1,
              Math.min(7, Math.floor(5 - daysAgo * 0.3 + Math.random() * 2))
            ),
            difficultyFelt: Math.floor(Math.random() * 3) + 2,
          },
        });
      }
    }

    // 6. A session note
    await prisma.sessionNote.create({
      data: {
        clientProfileId: profile.id,
        authorId: admin.id,
        date: new Date(),
        content:
          "Primă evaluare. Pacienta prezintă durere moderată la încărcare. Program stabilit pentru 4 săptămâni.",
        nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log("[seed] Done.");
}

main()
  .catch((e) => {
    console.error("[seed] Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
