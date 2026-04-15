"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Stethoscope, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  function loginAs(role: "ADMIN" | "CLIENT") {
    document.cookie = `dev-role=${role}; path=/; max-age=86400`;
    router.push(role === "ADMIN" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-emerald-100/40 p-4 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />
      <Card className="relative w-full max-w-md shadow-xl shadow-primary/10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight">PhysioConnect</span>
            </Link>
          </div>
          <CardTitle>Bine ai venit la PhysioConnect</CardTitle>
          <CardDescription>
            Alege un rol pentru a explora platforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full h-16 text-lg justify-start gap-4"
            onClick={() => loginAs("ADMIN")}
          >
            <Stethoscope className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Fizioterapeut</div>
              <div className="text-xs font-normal opacity-80">
                Dr. Physio &mdash; admin@physioconnect.com
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full h-16 text-lg justify-start gap-4"
            onClick={() => loginAs("CLIENT")}
          >
            <User className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Pacient</div>
              <div className="text-xs font-normal opacity-80">
                Jane Doe &mdash; client@example.com
              </div>
            </div>
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Mod dezvoltare: autentificarea Supabase este dezactivată.
            Configurează-ți datele Supabase în .env pentru autentificarea de producție.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
