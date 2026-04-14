import type {
  User,
  ClientProfile,
  Exercise,
  VideoAnnotation,
  TreatmentPlan,
  PlanExercise,
  ExerciseCompletion,
  ExerciseSchedule,
  ProgressEntry,
  ProgressPhoto,
  SessionNote,
  Message,
  Notification,
} from "@/generated/prisma/client";

export type UserWithProfile = User & {
  clientProfile: ClientProfile | null;
};

export type ExerciseWithAnnotations = Exercise & {
  annotations: VideoAnnotation[];
};

export type PlanExerciseWithDetails = PlanExercise & {
  exercise: Exercise & { annotations: VideoAnnotation[] };
  completions: ExerciseCompletion[];
  schedule: ExerciseSchedule[];
};

export type TreatmentPlanWithExercises = TreatmentPlan & {
  exercises: PlanExerciseWithDetails[];
  clientProfile: ClientProfile & { user: User };
};

export type ClientWithProfile = User & {
  clientProfile: ClientProfile & {
    assignedPlans: (TreatmentPlan & {
      exercises: (PlanExercise & {
        completions: ExerciseCompletion[];
      })[];
    })[];
  };
};

export type {
  User,
  ClientProfile,
  Exercise,
  VideoAnnotation,
  TreatmentPlan,
  PlanExercise,
  ExerciseCompletion,
  ExerciseSchedule,
  ProgressEntry,
  ProgressPhoto,
  SessionNote,
  Message,
  Notification,
};
