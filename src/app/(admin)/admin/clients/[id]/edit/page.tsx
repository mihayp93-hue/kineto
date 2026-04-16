"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X } from "lucide-react";

interface ClientData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string; // yyyy-mm-dd
  emergencyContact: string;
  medicalNotes: string;
  status: "ACTIVE" | "INACTIVE" | "DISCHARGED";
}

interface LibraryExercise {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  bodyPart: string[];
  tags: { id: string; name: string; color: string | null }[];
}

interface AssignedExercise {
  id: string;
  planId: string;
  planName: string;
  exerciseId: string;
  exercise: LibraryExercise;
  sets: number | null;
  reps: number | null;
  holdSeconds: number | null;
  frequencyPerWeek: number | null;
  notes: string | null;
}

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<ClientData | null>(null);

  const [library, setLibrary] = useState<LibraryExercise[]>([]);
  const [assigned, setAssigned] = useState<AssignedExercise[]>([]);
  const [assignBusy, setAssignBusy] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<
    { id: string; name: string; color: string | null }[]
  >([]);
  const [filterTagId, setFilterTagId] = useState<string | null>(null);

  const loadAssigned = useCallback(async () => {
    const r = await fetch(`/api/clients/${id}/assigned-exercises`);
    if (r.ok) setAssigned(await r.json());
  }, [id]);

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

    fetch("/api/exercises")
      .then((r) => r.json())
      .then(setLibrary)
      .catch(() => {});

    fetch("/api/tags")
      .then((r) => r.json())
      .then(setAllTags)
      .catch(() => {});

    loadAssigned();
  }, [id, loadAssigned]);

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

  async function addExercise(exerciseId: string) {
    setAssignBusy(exerciseId);
    try {
      const res = await fetch(`/api/clients/${id}/assigned-exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Asignarea a eșuat");
      }
      await loadAssigned();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Eroare");
    } finally {
      setAssignBusy(null);
    }
  }

  async function removeAssigned(peId: string) {
    setAssignBusy(peId);
    try {
      const res = await fetch(
        `/api/clients/${id}/assigned-exercises/${peId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Ștergerea a eșuat");
      setAssigned((cur) => cur.filter((a) => a.id !== peId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Eroare");
    } finally {
      setAssignBusy(null);
    }
  }

  if (initialLoading) {
    return (
      <div className="p-4 md:p-8">
        <p className="text-muted-foreground">Se încarcă...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 md:p-8">
        <p className="text-destructive">{error || "Pacient negăsit"}</p>
      </div>
    );
  }

  const assignedIds = new Set(assigned.map((a) => a.exerciseId));
  const available = library.filter((ex) => {
    if (assignedIds.has(ex.id)) return false;
    if (filterTagId && !ex.tags?.some((t) => t.id === filterTagId)) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <Link
        href={`/admin/clients/${id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Înapoi la pacient
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Editează pacient</CardTitle>
          <CardDescription>Actualizează detaliile pacientului</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Assigned exercises */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Exerciții asignate</CardTitle>
          <CardDescription>
            Exercițiile din planul activ al pacientului. Pentru seturi/repetări
            detaliate folosește „Plan nou de tratament".
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assigned.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Niciun exercițiu asignat încă.
            </p>
          ) : (
            <div className="space-y-2">
              {assigned.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium text-sm">
                      {a.exercise.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {a.exercise.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {a.exercise.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {a.sets ?? "-"}×{a.reps ?? "-"}
                        {a.frequencyPerWeek
                          ? ` · ${a.frequencyPerWeek}/săpt`
                          : ""}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        plan: {a.planName}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={assignBusy === a.id}
                    onClick={() => removeAssigned(a.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Library — add */}
      <Card>
        <CardHeader>
          <CardTitle>Adaugă din bibliotecă</CardTitle>
          <CardDescription>
            Apasă un exercițiu pentru a-l asigna pacientului. Se creează
            automat un plan activ dacă nu există deja.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant={filterTagId === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterTagId(null)}
              >
                Toate
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={filterTagId === tag.id ? "default" : "outline"}
                  style={
                    filterTagId === tag.id && tag.color
                      ? { backgroundColor: tag.color, borderColor: tag.color }
                      : undefined
                  }
                  className="cursor-pointer"
                  onClick={() =>
                    setFilterTagId(filterTagId === tag.id ? null : tag.id)
                  }
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          {library.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Biblioteca este goală.{" "}
              <Link
                href="/admin/exercises/new"
                className="text-primary hover:underline"
              >
                Adaugă primul exercițiu
              </Link>
              .
            </p>
          ) : available.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Toate exercițiile din bibliotecă sunt deja asignate.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {available.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  disabled={assignBusy === ex.id}
                  onClick={() => addExercise(ex.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <Plus className="h-3 w-3" />
                  {ex.title}
                  <Badge variant="outline" className="text-[10px] ml-1">
                    {ex.category}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
