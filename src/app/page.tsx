import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, Video, Users, BarChart3, Calendar, MessageSquare } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">PhysioConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Autentificare</Button>
            </Link>
            <Link href="/login">
              <Button>Începe</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Recuperarea ta,{" "}
            <span className="text-primary">Personalizată</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            O platformă unde fizioterapeutul tău îți atribuie exerciții video
            personalizate, îți urmărește progresul și te sprijină în parcursul
            de recuperare la fiecare pas.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8">
                Începe parcursul tău
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tot ce ai nevoie pentru recuperare
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Video className="h-10 w-10" />}
              title="Bibliotecă video exerciții"
              description="Urmărește videoclipuri profesionale de demonstrație cu adnotări pe minut/secundă de la fizioterapeutul tău."
            />
            <FeatureCard
              icon={<Calendar className="h-10 w-10" />}
              title="Rutine programate"
              description="Urmează calendarul tău personalizat de exerciții cu rutine zilnice adaptate planului tău de recuperare."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10" />}
              title="Urmărirea progresului"
              description="Înregistrează nivelul durerii, urmărește seriile de finalizări și vizualizează recuperarea prin grafice detaliate."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Gestionare pacienți"
              description="Fizioterapeuții pot gestiona pacienți, crea planuri de tratament și monitoriza aderența dintr-un singur panou."
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10" />}
              title="Mesagerie directă"
              description="Rămâi în contact cu fizioterapeutul tău prin mesagerie în aplicație pentru întrebări rapide și actualizări."
            />
            <FeatureCard
              icon={<Activity className="h-10 w-10" />}
              title="Progresie inteligentă"
              description="Sugestii automate de progresie a exercițiilor pe baza etapelor de recuperare și a nivelului de durere."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-slate-50">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} PhysioConnect. Toate drepturile rezervate.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-slate-50 hover:shadow-md transition-shadow">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}
