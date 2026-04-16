"use client";

import { useEffect, useState } from "react";
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
import { Plus, Trash2, Pencil, X, Check, Tag as TagIcon } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  _count?: { exercises: number };
}

const SUGGESTED_COLORS = [
  "#14b8a6",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#f97316",
  "#ef4444",
  "#eab308",
  "#64748b",
];

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(SUGGESTED_COLORS[0]);
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editColor, setEditColor] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/tags");
      setTags(await r.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || null,
          color,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Eroare");
      }
      setName("");
      setDescription("");
      setColor(SUGGESTED_COLORS[0]);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Eroare");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(tag: Tag) {
    setEditingId(tag.id);
    setEditName(tag.name);
    setEditDescription(tag.description ?? "");
    setEditColor(tag.color);
  }

  async function saveEdit(id: string) {
    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDescription || null,
          color: editColor,
        }),
      });
      if (!res.ok) throw new Error("Salvarea a eșuat");
      setEditingId(null);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Eroare");
    }
  }

  async function remove(id: string) {
    if (!confirm("Ștergi această afecțiune? Exercițiile asociate rămân.")) return;
    try {
      const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Ștergerea a eșuat");
      setTags((cur) => cur.filter((t) => t.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Eroare");
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Afecțiuni</h1>
        <p className="text-muted-foreground">
          Creează etichete pentru problemele medicale (ex: hernie de disc,
          entorsă gleznă). Le asignezi exercițiilor din bibliotecă pentru a
          le găsi rapid când construiești planul unui pacient.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Afecțiune nouă
          </CardTitle>
          <CardDescription>
            Dă un nume scurt problemei și, opțional, o descriere pentru tine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              <div className="space-y-2">
                <Label htmlFor="name">Nume *</Label>
                <Input
                  id="name"
                  placeholder="ex: Hernie de disc lombară"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Culoare</Label>
                <div className="flex items-center gap-1.5 h-9">
                  {SUGGESTED_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      aria-label={c}
                      onClick={() => setColor(c)}
                      style={{ backgroundColor: c }}
                      className={`h-6 w-6 rounded-full border-2 transition-transform ${
                        color === c
                          ? "border-foreground scale-110"
                          : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descriere (opțional)</Label>
              <Textarea
                id="description"
                placeholder="Context intern, protocol preferat, observații..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={creating || !name.trim()}>
              {creating ? "Se creează..." : "Creează afecțiune"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Toate afecțiunile</CardTitle>
          <CardDescription>
            {loading
              ? "Se încarcă..."
              : `${tags.length} afecțiuni definite`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && tags.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <TagIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
              Nu ai definit nicio afecțiune încă.
            </div>
          ) : (
            <div className="divide-y">
              {tags.map((tag) => (
                <div key={tag.id} className="py-3">
                  {editingId === tag.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <div className="flex items-center gap-1.5">
                          {SUGGESTED_COLORS.map((c) => (
                            <button
                              type="button"
                              key={c}
                              onClick={() => setEditColor(c)}
                              style={{ backgroundColor: c }}
                              className={`h-6 w-6 rounded-full border-2 ${
                                editColor === c
                                  ? "border-foreground scale-110"
                                  : "border-transparent"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEdit(tag.id)}>
                          <Check className="h-4 w-4 mr-1" />
                          Salvează
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Anulează
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-3 w-3 rounded-full shrink-0"
                        style={{
                          backgroundColor: tag.color ?? "#94a3b8",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{tag.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {tag._count?.exercises ?? 0} exerciții
                          </Badge>
                        </div>
                        {tag.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {tag.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(tag)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => remove(tag.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
