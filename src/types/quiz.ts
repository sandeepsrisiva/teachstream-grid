export interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  created_by: string;
  created_at: string;
}

export interface QuizSubmission {
  quiz_id: string;
  student_id: string;
  answers: Record<string, string>;
  score: number;
  submitted_at: string;
}