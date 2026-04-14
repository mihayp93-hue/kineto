"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";

interface ScheduleEntry {
  dayOfWeek: number;
  timeOfDay: string | null;
  exerciseTitle: string;
  planExerciseId: string;
  sets: number | null;
  reps: number | null;
  completions: string[];
}

const DAYS = [
  "Duminică",
  "Luni",
  "Marți",
  "Miercuri",
  "Joi",
  "Vineri",
  "Sâmbătă",
];

export function CalendarView({
  scheduleData,
}: {
  scheduleData: ScheduleEntry[];
}) {
  const today = new Date().getDay();

  if (scheduleData.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Niciun exercițiu programat încă. Fizioterapeutul tău îți va configura
          programul săptămânal.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-7 gap-3">
      {DAYS.map((day, index) => {
        const dayExercises = scheduleData.filter(
          (s) => s.dayOfWeek === index
        );
        const isToday = index === today;

        return (
          <Card
            key={day}
            className={isToday ? "ring-2 ring-primary" : ""}
          >
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm">
                {day}
                {isToday && (
                  <Badge className="ml-2 text-[10px]">Azi</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {dayExercises.length === 0 ? (
                <p className="text-xs text-muted-foreground">Zi de odihnă</p>
              ) : (
                <div className="space-y-2">
                  {dayExercises.map((entry, i) => {
                    const todayStr = new Date().toDateString();
                    const completedToday = entry.completions.some(
                      (c) => new Date(c).toDateString() === todayStr
                    );

                    return (
                      <div
                        key={i}
                        className="flex items-start gap-1.5 text-xs"
                      >
                        {completedToday ? (
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium leading-tight">
                            {entry.exerciseTitle}
                          </p>
                          {entry.sets && (
                            <p className="text-muted-foreground">
                              {entry.sets}x{entry.reps}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
