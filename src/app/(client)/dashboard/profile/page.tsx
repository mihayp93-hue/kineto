import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await prisma.clientProfile.findUnique({
    where: { userId: user.id },
  });

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profilul meu</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Telefon</p>
              <p className="text-sm text-muted-foreground">
                {user.phone || "Nesetat"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Stare</p>
              <Badge variant={profile?.status === "ACTIVE" ? "default" : "secondary"}>
                {profile?.status === "ACTIVE"
                  ? "ACTIV"
                  : profile?.status === "INACTIVE"
                  ? "INACTIV"
                  : profile?.status === "DISCHARGED"
                  ? "EXTERNAT"
                  : "N/A"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Data nașterii</p>
              <p className="text-sm text-muted-foreground">
                {profile?.dateOfBirth
                  ? new Date(profile.dateOfBirth).toLocaleDateString()
                  : "Nesetată"}
              </p>
            </div>
          </div>
          {profile?.medicalNotes && (
            <div>
              <p className="text-sm font-medium">Note medicale</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {profile.medicalNotes}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium">Membru din</p>
            <p className="text-sm text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
