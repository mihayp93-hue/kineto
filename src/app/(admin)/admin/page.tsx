import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Dumbbell,
  ClipboardList,
  CheckCircle,
  ArrowRight,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [clientCount, exerciseCount, activePlans, recentCompletions] =
    await Promise.all([
      prisma.clientProfile.count(),
      prisma.exercise.count(),
      prisma.treatmentPlan.count({ where: { status: "ACTIVE" } }),
      prisma.exerciseCompletion.count({
        where: {
          completedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

  const recentClients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: {
      clientProfile: {
        include: {
          assignedPlans: { where: { status: "ACTIVE" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const todayGreeting = getTodayGreeting();

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      {/* Greeting banner */}
      <div className="relative overflow-hidden rounded-[1.5rem] border bg-gradient-to-br from-primary via-[oklch(0.44_0.08_155)] to-[oklch(0.36_0.07_150)] text-primary-foreground p-6 md:p-8 mb-8">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-ochre/30 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium mb-4">
              <Sparkles className="h-3 w-3" />
              {formatDate(new Date())}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight">
              {todayGreeting}
            </h1>
            <p className="text-primary-foreground/85 mt-2 text-sm md:text-base">
              {recentCompletions > 0
                ? `Pacienții tăi au completat ${recentCompletions} exerciții în ultimele 7 zile.`
                : "Iată imaginea de ansamblu a cabinetului tău."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/exercises/new">
              <Button
                size="sm"
                className="gap-1 bg-background text-foreground hover:bg-background/90"
              >
                <Plus className="h-3.5 w-3.5" />
                Exercițiu
              </Button>
            </Link>
            <Link href="/admin/clients/new">
              <Button
                size="sm"
                variant="outline"
                className="gap-1 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                Pacient
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Pacienți"
          value={clientCount}
          icon={<Users className="h-4 w-4" />}
          href="/admin/clients"
          tone="primary"
        />
        <StatCard
          title="Exerciții"
          value={exerciseCount}
          icon={<Dumbbell className="h-4 w-4" />}
          href="/admin/exercises"
          tone="ochre"
        />
        <StatCard
          title="Planuri active"
          value={activePlans}
          icon={<ClipboardList className="h-4 w-4" />}
          tone="primary"
        />
        <StatCard
          title="Finalizări · 7 zile"
          value={recentCompletions}
          icon={<CheckCircle className="h-4 w-4" />}
          tone="ochre"
        />
      </div>

      {/* Recent Clients */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif text-2xl">
                Pacienți recenți
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ultimele persoane adăugate în cabinet
              </p>
            </div>
            <Link href="/admin/clients">
              <Button variant="ghost" size="sm" className="gap-1">
                Toți pacienții
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentClients.length === 0 ? (
            <div className="text-center py-10">
              <div className="h-14 w-14 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Niciun pacient încă.
              </p>
              <Link href="/admin/clients/new">
                <Button size="sm">Adaugă primul pacient</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {recentClients.map((client) => {
                const plans =
                  client.clientProfile?.assignedPlans.length ?? 0;
                const initials = client.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <Link
                    key={client.id}
                    href={`/admin/clients/${client.id}`}
                    className="flex items-center gap-4 py-3 group"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center shrink-0">
                      {initials || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium group-hover:text-primary transition truncate">
                        {client.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {client.email}
                      </p>
                    </div>
                    <div className="text-xs text-right shrink-0">
                      <div className="font-semibold">{plans}</div>
                      <div className="text-muted-foreground">
                        planuri active
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  href,
  tone = "primary",
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  href?: string;
  tone?: "primary" | "ochre";
}) {
  const iconClass =
    tone === "ochre"
      ? "bg-ochre/15 text-ochre"
      : "bg-primary/10 text-primary";
  const content = (
    <Card className="hover:shadow-lg hover:border-primary/30 transition-all h-full">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              {title}
            </p>
            <p className="font-serif text-4xl mt-2 leading-none">{value}</p>
          </div>
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function getTodayGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bună dimineața!";
  if (h < 18) return "Bună ziua!";
  return "Bună seara!";
}

function formatDate(d: Date) {
  const days = [
    "duminică",
    "luni",
    "marți",
    "miercuri",
    "joi",
    "vineri",
    "sâmbătă",
  ];
  const months = [
    "ianuarie",
    "februarie",
    "martie",
    "aprilie",
    "mai",
    "iunie",
    "iulie",
    "august",
    "septembrie",
    "octombrie",
    "noiembrie",
    "decembrie",
  ];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}
