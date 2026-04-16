import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { exercises: true } } },
  });
  return NextResponse.json(tags);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name: string = (body.name ?? "").trim();
  if (!name) {
    return NextResponse.json(
      { error: "Numele este obligatoriu" },
      { status: 400 }
    );
  }

  const slug = slugify(name);
  try {
    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        description: body.description ?? null,
        color: body.color ?? null,
      },
    });
    return NextResponse.json(tag, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Un tag cu acest nume există deja" },
      { status: 400 }
    );
  }
}
