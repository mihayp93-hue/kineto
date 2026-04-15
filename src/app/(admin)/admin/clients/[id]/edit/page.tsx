"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface ClientData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string; // yyyy-mm-dd
  emergencyContact: string;
  medicalNotes: string;
  status: "ACTIVE" | "INACTIVE" | "DISCHARGED";
}

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<ClientData | null>(null);

  useEffect(() => {
    fetch(`/api/clients/${id}`)
      .then((r) => r.json())
      .then((c) => {
        const p = c.clientProfile ?? {};
        setData({
          name: c.name ?? "",
          email: c.email ?? "",
          phone: c.phone ?? "",
          dateOfBirth: p.dateOfBirth
            ? new Date(p.dateOfBirth).toISOString().slice(0, 10)
            : "",
          emergencyContact: p.emergencyContact ?? "",
          medicalNotes: p.medicalNotes ?? "",
          status: p.status ?? "ACTIVE",
        });
        setInitialLoading(false);
      })
      .catch(() => {
        setError("Nu s-a putut încărca pacientul");
        setInitialLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone || null,
          dateOfBirth: data.dateOfBirth || null,
          emergencyContact: data.emergencyContact || null,
          medicalNotes: data.medicalNotes || null,
          status: data.status,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Salvarea a eșuat");
      }
      router.push(`/admin/clients/${id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Eroare");
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Se încarcă...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <p className="text-destructive">{error || "Pacient negăsit"}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href={`/admin/clients/${id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Înapoi la pacient
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Editează pacient</CardTitle>
          <CardDescription>Actualizează detaliile pacientului</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nume complet *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  disabled
                  readOnly
                />
                <p className="text-xs text-muted-foreground">
                  Emailul nu poate fi modificat.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  placeholder="+40 721 234 567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Data nașterii</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={data.dateOfBirth}
                  onChange={(e) =>
                    setData({ ...data, dateOfBirth: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={data.status}
                onChange={(e) =>
                  setData({
                    ...data,
                    status: e.target.value as ClientData["status"],
                  })
                }
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
              >
                <option value="ACTIVE">Activ</option>
                <option value="INACTIVE">Inactiv</option>
                <option value="DISCHARGED">Externat</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Contact de urgență</Label>
              <Input
                id="emergencyContact"
                value={data.emergencyContact}
                onChange={(e) =>
                  setData({ ...data, emergencyContact: e.target.value })
                }
                placeholder="Nume și număr de telefon"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalNotes">Note medicale</Label>
              <Textarea
                id="medicalNotes"
                value={data.medicalNotes}
                onChange={(e) =>
                  setData({ ...data, medicalNotes: e.target.value })
                }
                rows={4}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Se salvează..." : "Salvează modificările"}
              </Button>
              <Link href={`/admin/clients/${id}`}>
                <Button variant="outline" type="button">
                  Anulează
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
