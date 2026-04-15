"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone") || null,
          dateOfBirth: formData.get("dateOfBirth") || null,
          medicalNotes: formData.get("medicalNotes") || null,
          emergencyContact: formData.get("emergencyContact") || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create client");
      }

      router.push("/admin/clients");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <Link
        href="/admin/clients"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Înapoi la pacienți
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Adaugă pacient nou</CardTitle>
          <CardDescription>
            Creează un cont de pacient. Acesta va primi un email pentru a-și
            seta parola.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nume complet *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Jane Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+40 721 234 567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Data nașterii</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Contact de urgență</Label>
              <Input
                id="emergencyContact"
                name="emergencyContact"
                placeholder="Nume și număr de telefon"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalNotes">Note medicale</Label>
              <Textarea
                id="medicalNotes"
                name="medicalNotes"
                placeholder="Istoric medical relevant, alergii, afecțiuni..."
                rows={4}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Se creează..." : "Creează pacient"}
              </Button>
              <Link href="/admin/clients">
                <Button variant="outline">Anulează</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
