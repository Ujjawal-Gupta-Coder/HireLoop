export type SerializedConversation = {
  id: string;
  interviewId: string;
  speaker: "INTERVIEWER" | "CANDIDATE";
  message: string;
  questionNumber: number | null;
  createdAt: string;
};

export type SerializedInterviewHistory = {
  id: string;
  userId: string;
  type: string; // e.g. "TECHNICAL_INTERVIEW"
  role: string; // e.g. "FULL_STACK_DEVELOPER"
  experience: string; // e.g. "MID_LEVEL"
  difficulty: string; // e.g. "MEDIUM"
  skills: string[];
  sessionType: string; // e.g. "STANDARD"
  context: string | null;
  creditsUsed: number;
  totalQuestions: number;
  answered: number;
  status: "RUNNING" | "COMPLETED" | "ABANDONED";
  timeElapsed: number; // in seconds
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  conversations: SerializedConversation[];
};

export type HistoryStats = {
  totalInterviews: number;
  completedInterviews: number;
  completionRate: number;
  totalTimeElapsed: number; // in seconds
  totalQuestionsAnswered: number;
};

export type StatusFilterType = "ALL" | "COMPLETED" | "RUNNING" | "ABANDONED";
export type TrackFilterType =
  | "ALL"
  | "TECHNICAL_INTERVIEW"
  | "CODING_INTERVIEW"
  | "SYSTEM_DESIGN_INTERVIEW"
  | "BEHAVIORAL_INTERVIEW"
  | "MIXED_INTERVIEW";
export type DifficultyFilterType = "ALL" | "EASY" | "MEDIUM" | "HARD";
export type SortOptionType =
  | "NEWEST"
  | "OLDEST"
  | "LONGEST_DURATION"
  | "MOST_QUESTIONS";
export type ViewModeType = "grid" | "table";
