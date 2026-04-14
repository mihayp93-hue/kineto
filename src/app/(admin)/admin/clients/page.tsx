import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: {
      clientProfile: {
        include: {
          assignedPlans: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pacienți</h1>
          <p className="text-muted-foreground">
            Gestionează lista de pacienți
          </p>
        </div>
        <Link href="/admin/clients/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adaugă pacient
          </Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Niciun pacient încă</h3>
            <p className="text-muted-foreground mb-4">
              Adaugă primul pacient pentru a începe să creezi planuri de tratament.
            </p>
            <Link href="/admin/clients/new">
              <Button>Adaugă pacient</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nume</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Stare</TableHead>
                <TableHead>Planuri active</TableHead>
                <TableHead>Înscris</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => {
                const activePlans =
                  client.clientProfile?.assignedPlans.filter(
                    (p) => p.status === "ACTIVE"
                  ).length ?? 0;

                return (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {client.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {client.email}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={client.clientProfile?.status ?? "ACTIVE"}
                      />
                    </TableCell>
                    <TableCell>{activePlans}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "ACTIVE"
      ? "default"
      : status === "INACTIVE"
      ? "secondary"
      : "outline";

  const labels: Record<string, string> = {
    ACTIVE: "ACTIV",
    INACTIVE: "INACTIV",
    DISCHARGED: "EXTERNAT",
  };
  return <Badge variant={variant}>{labels[status] ?? status}</Badge>;
}
