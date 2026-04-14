import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Setări</h1>
        <p className="text-muted-foreground">Gestionează setările contului tău</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informații cont</CardTitle>
          <CardDescription>Detaliile contului tău</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Nume</p>
            <p className="text-sm text-muted-foreground">{user.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Rol</p>
            <p className="text-sm text-muted-foreground">{user.role === "ADMIN" ? "Fizioterapeut" : "Pacient"}</p>
          </div>
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
