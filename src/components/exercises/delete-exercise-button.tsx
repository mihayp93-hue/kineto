"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteExerciseButton({ exerciseId }: { exerciseId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Sigur dorești să ștergi acest exercițiu?")) return;

    setLoading(true);
    const res = await fetch(`/api/exercises/${exerciseId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/admin/exercises");
      router.refresh();
    } else {
      alert("Eroare la ștergerea exercițiului");
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="h-4 w-4 mr-1" />
      {loading ? "Se șterge..." : "Șterge"}
    </Button>
  );
}
