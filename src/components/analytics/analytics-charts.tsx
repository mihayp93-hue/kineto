"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsChartsProps {
  topExercises: { name: string; count: number }[];
  painTrend: { date: string; avgPain: number }[];
  dailyCompletions: { date: string; count: number }[];
}

export function AnalyticsCharts({
  topExercises,
  painTrend,
  dailyCompletions,
}: AnalyticsChartsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cele mai prescrise exerciții</CardTitle>
        </CardHeader>
        <CardContent>
          {topExercises.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nu există date încă
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topExercises} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={150}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                  name="Prescrieri"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Nivel mediu de durere (30 de zile)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {painTrend.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nu există date despre durere încă
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={painTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avgPain"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  name="Durere medie"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Finalizări zilnice (30 de zile)</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyCompletions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nicio finalizare încă
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyCompletions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Finalizări"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
