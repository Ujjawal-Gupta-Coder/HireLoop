export type PerformanceLevel = "Poor" | "Weak" | "Average" | "Good" | "Excellent";

export type QuestionAnalysis = {
  questionNumber: number;
  question: string;
  answer: string;
  feedback: string;
  score: number; // 0 to 10
};

export type InterviewReportData = {
  id: string;
  interviewId: string;
  
  // Overall Score (0-100) & Performance Rating
  overallScore: number;
  performance: PerformanceLevel;

  // 5 parameters for overall score (0-100)
  confidenceScore: number;
  clarityScore: number;
  relevancyScore: number;
  depthScore: number;
  problemSolvingScore: number;

  // 3 Strengths, 3 Weaknesses, 3 AI Recommendations
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];

  // Communication overall score (0-100) & Performance Rating
  communicationScore: number;
  communicationPerformance: PerformanceLevel;

  // 5 parameters for communication score (0-100)
  commClarityScore: number;
  commGrammarScore: number;
  commVocabularyScore: number;
  commToneScore: number;
  commProfessionalismScore: number;

  // AI feedback for communication
  communicationFeedback: string;

  // Question-by-question analysis
  questionAnalyses: QuestionAnalysis[];

  // Executive AI Interview Summary
  summary: string;

  createdAt: string;
  updatedAt: string;
};

export type InterviewSessionInfo = {
  id: string;
  role: string;
  experience: string;
  difficulty: string;
  type: string;
  skills: string[];
  context?: string | null;
  status: string;
  totalQuestions: number;
  answered: number;
  userName: string,
  userEmail: string
  timeElapsed: number;
  createdAt: string;
};
