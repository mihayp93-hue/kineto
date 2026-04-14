"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PainDataPoint {
  date: string;
  painLevel: number;
}

interface ActivityDataPoint {
  date: string;
  count: number;
}

export function ProgressCharts({
  painData,
  activityData,
}: {
  painData: PainDataPoint[];
  activityData: ActivityDataPoint[];
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Nivelul durerii în timp</CardTitle>
        </CardHeader>
        <CardContent>
          {painData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Încă nu există date despre durere. Înregistrează exercițiile pentru a-ți urmări nivelul durerii.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={painData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="painLevel"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Nivel durere"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activitate zilnică</CardTitle>
        </CardHeader>
        <CardContent>
          {activityData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Încă nu există date despre activitate. Începe să finalizezi exerciții!
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Exerciții"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
