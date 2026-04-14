import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Dumbbell, ClipboardList, CheckCircle } from "lucide-react";
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Panou principal</h1>
          <p className="text-muted-foreground">
            Bine ai revenit la PhysioConnect
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/exercises/new">
            <Button>Adaugă exercițiu</Button>
          </Link>
          <Link href="/admin/clients/new">
            <Button variant="outline">Adaugă pacient</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <StatCard
          title="Total pacienți"
          value={clientCount}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Exerciții"
          value={exerciseCount}
          icon={<Dumbbell className="h-5 w-5" />}
        />
        <StatCard
          title="Planuri active"
          value={activePlans}
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <StatCard
          title="Finalizări (7 zile)"
          value={recentCompletions}
          icon={<CheckCircle className="h-5 w-5" />}
        />
      </div>

      {/* Recent Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Pacienți recenți</CardTitle>
        </CardHeader>
        <CardContent>
          {recentClients.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Niciun pacient încă.{" "}
              <Link href="/admin/clients/new" className="text-primary hover:underline">
                Adaugă primul pacient
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {recentClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/admin/clients/${client.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.email}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {client.clientProfile?.assignedPlans.length ?? 0} planuri
                    active
                  </div>
                </Link>
              ))}
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
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
