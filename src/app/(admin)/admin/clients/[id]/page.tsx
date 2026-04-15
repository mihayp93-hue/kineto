import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Calendar, ClipboardList, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const client = await prisma.user.findUnique({
    where: { id, role: "CLIENT" },
    include: {
      clientProfile: {
        include: {
          assignedPlans: {
            include: {
              exercises: {
                include: {
                  exercise: true,
                  completions: { orderBy: { completedAt: "desc" }, take: 5 },
                },
                orderBy: { orderIndex: "asc" },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          sessionNotes: {
            include: { author: true },
            orderBy: { date: "desc" },
            take: 10,
          },
          progressEntries: {
            orderBy: { date: "desc" },
            take: 20,
          },
        },
      },
    },
  });

  if (!client || !client.clientProfile) notFound();

  const profile = client.clientProfile;
  const activePlans = profile.assignedPlans.filter(
    (p) => p.status === "ACTIVE"
  );

  return (
    <div className="p-8">
      <Link
        href="/admin/clients"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Înapoi la pacienți
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <p className="text-muted-foreground">{client.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={
                profile.status === "ACTIVE" ? "default" : "secondary"
              }
            >
              {profile.status === "ACTIVE"
                ? "ACTIV"
                : profile.status === "INACTIVE"
                ? "INACTIV"
                : "EXTERNAT"}
            </Badge>
            {client.phone && (
              <span className="text-sm text-muted-foreground">
                {client.phone}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/clients/${id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editează
            </Button>
          </Link>
          <Link href={`/admin/clients/${id}/plans/new`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Plan nou de tratament
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">Planuri tratament</TabsTrigger>
          <TabsTrigger value="notes">Note ședințe</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-6">
          {profile.assignedPlans.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Niciun plan de tratament încă.
                </p>
                <Link href={`/admin/clients/${id}/plans/new`}>
                  <Button className="mt-3" size="sm">
                    Creează primul plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {profile.assignedPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        {plan.description && (
                          <CardDescription>
                            {plan.description}
                          </CardDescription>
                        )}
                      </div>
                      <Badge
                        variant={
                          plan.status === "ACTIVE"
                            ? "default"
                            : plan.status === "COMPLETED"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {plan.status === "ACTIVE"
                          ? "ACTIV"
                          : plan.status === "COMPLETED"
                          ? "FINALIZAT"
                          : "SUSPENDAT"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Început{" "}
                        {new Date(plan.startDate).toLocaleDateString()}
                      </span>
                      {plan.endDate && (
                        <span>
                          Se încheie{" "}
                          {new Date(plan.endDate).toLocaleDateString()}
                        </span>
                      )}
                      <span>
                        {plan.exercises.length} exerciții
                      </span>
                    </div>

                    <div className="space-y-2">
                      {plan.exercises.map((pe) => {
                        const totalCompletions = pe.completions.length;
                        return (
                          <div
                            key={pe.id}
                            className="flex items-center justify-between p-2 rounded border text-sm"
                          >
                            <div>
                              <span className="font-medium">
                                {pe.exercise.title}
                              </span>
                              <span className="text-muted-foreground ml-2">
                                {pe.sets && `${pe.sets} seturi`}
                                {pe.reps && ` x ${pe.reps} repetări`}
                                {pe.holdSeconds &&
                                  ` x ${pe.holdSeconds}s menținere`}
                              </span>
                            </div>
                            <span className="text-muted-foreground">
                              {totalCompletions} finalizări
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <div className="space-y-4">
            <Link href={`/admin/clients/${id}/notes/new`}>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Adaugă notă
              </Button>
            </Link>
            {profile.sessionNotes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Nicio notă de ședință încă.
                </CardContent>
              </Card>
            ) : (
              profile.sessionNotes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {new Date(note.date).toLocaleDateString()}
                      </span>
                      {note.nextAppointment && (
                        <span className="text-xs text-muted-foreground">
                          Următoarea:{" "}
                          {new Date(
                            note.nextAppointment
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Data nașterii</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.dateOfBirth
                      ? new Date(profile.dateOfBirth).toLocaleDateString()
                      : "Nesetată"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact de urgență</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.emergencyContact || "Nesetat"}
                  </p>
                </div>
              </div>
              {profile.medicalNotes && (
                <div>
                  <p className="text-sm font-medium">Note medicale</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {profile.medicalNotes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
