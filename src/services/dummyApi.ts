import { User, LoginCredentials, AuthResponse } from '@/types/auth';
import { Quiz, Question, QuizSubmission } from '@/types/quiz';
import { Video } from '@/types/video';

// Dummy data
const dummyUsers: User[] = [
  { id: '1', username: 'admin', role: 'admin', email: 'admin@eduportal.com', name: 'Admin User' },
  { id: '2', username: 'teacher1', role: 'teacher', email: 'teacher1@eduportal.com', name: 'John Teacher' },
  { id: '3', username: 'student1', role: 'student', email: 'student1@eduportal.com', name: 'Jane Student', course: 'Computer Science' },
  { id: '4', username: 'student2', role: 'student', email: 'student2@eduportal.com', name: 'Bob Student', course: 'Mathematics' },
];

const dummyQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'JavaScript Basics',
    created_by: '2',
    created_at: '2024-01-01',
    questions: [
      {
        id: '1',
        question_text: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var x = 5;', 'variable x = 5;', 'declare x = 5;', 'x := 5;'],
        correct_answer: 'var x = 5;'
      },
      {
        id: '2',
        question_text: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'add()', 'append()', 'insert()'],
        correct_answer: 'push()'
      }
    ]
  },
  {
    id: '2',
    title: 'React Fundamentals',
    created_by: '2',
    created_at: '2024-01-02',
    questions: [
      {
        id: '3',
        question_text: 'What is a React component?',
        options: ['A function that returns JSX', 'A JavaScript object', 'A CSS class', 'An HTML element'],
        correct_answer: 'A function that returns JSX'
      }
    ]
  }
];

const dummyVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction to Programming',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    created_by: '2',
    created_at: '2024-01-01'
  },
  {
    id: '2',
    title: 'JavaScript Tutorial',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    created_by: '2',
    created_at: '2024-01-02'
  }
];

let quizSubmissions: QuizSubmission[] = [
  {
    quiz_id: '1',
    student_id: '3',
    answers: { '1': 'var x = 5;', '2': 'push()' },
    score: 100,
    submitted_at: '2024-01-03'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dummyApi = {
  // Auth APIs
  async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    await delay(500);
    
    const user = dummyUsers.find(u => u.username === credentials.username);
    
    // Simple password validation (in real app, this would be secure)
    const validCredentials = [
      { username: 'admin', password: 'admin123' },
      { username: 'teacher1', password: 'teacher123' },
      { username: 'student1', password: 'student123' },
      { username: 'student2', password: 'student123' }
    ];
    
    const isValid = validCredentials.some(
      cred => cred.username === credentials.username && cred.password === credentials.password
    );
    
    if (user && isValid) {
      return {
        token: `dummy_token_${user.id}_${Date.now()}`,
        user
      };
    }
    
    return null;
  },

  async logout(): Promise<boolean> {
    await delay(200);
    return true;
  },

  // Quiz APIs
  async getQuizzes(): Promise<Quiz[]> {
    await delay(300);
    return [...dummyQuizzes];
  },

  async createQuiz(quiz: Omit<Quiz, 'id' | 'created_at'>): Promise<Quiz> {
    await delay(500);
    const newQuiz: Quiz = {
      ...quiz,
      id: (dummyQuizzes.length + 1).toString(),
      created_at: new Date().toISOString()
    };
    dummyQuizzes.push(newQuiz);
    return newQuiz;
  },

  async updateQuiz(quizId: string, quiz: Partial<Quiz>): Promise<Quiz | null> {
    await delay(500);
    const index = dummyQuizzes.findIndex(q => q.id === quizId);
    if (index !== -1) {
      dummyQuizzes[index] = { ...dummyQuizzes[index], ...quiz };
      return dummyQuizzes[index];
    }
    return null;
  },

  async deleteQuiz(quizId: string): Promise<boolean> {
    await delay(300);
    const index = dummyQuizzes.findIndex(q => q.id === quizId);
    if (index !== -1) {
      dummyQuizzes.splice(index, 1);
      return true;
    }
    return false;
  },

  async submitQuiz(submission: Omit<QuizSubmission, 'score' | 'submitted_at'>): Promise<QuizSubmission> {
    await delay(500);
    const quiz = dummyQuizzes.find(q => q.id === submission.quiz_id);
    if (!quiz) throw new Error('Quiz not found');

    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      if (submission.answers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const result: QuizSubmission = {
      ...submission,
      score,
      submitted_at: new Date().toISOString()
    };

    quizSubmissions.push(result);
    return result;
  },

  async getQuizSubmissions(): Promise<QuizSubmission[]> {
    await delay(300);
    return [...quizSubmissions];
  },

  // Video APIs
  async getVideos(): Promise<Video[]> {
    await delay(300);
    return [...dummyVideos];
  },

  async createVideo(video: Omit<Video, 'id' | 'created_at'>): Promise<Video> {
    await delay(500);
    const newVideo: Video = {
      ...video,
      id: (dummyVideos.length + 1).toString(),
      created_at: new Date().toISOString()
    };
    dummyVideos.push(newVideo);
    return newVideo;
  },

  async updateVideo(videoId: string, video: Partial<Video>): Promise<Video | null> {
    await delay(500);
    const index = dummyVideos.findIndex(v => v.id === videoId);
    if (index !== -1) {
      dummyVideos[index] = { ...dummyVideos[index], ...video };
      return dummyVideos[index];
    }
    return null;
  },

  async deleteVideo(videoId: string): Promise<boolean> {
    await delay(300);
    const index = dummyVideos.findIndex(v => v.id === videoId);
    if (index !== -1) {
      dummyVideos.splice(index, 1);
      return true;
    }
    return false;
  },

  // User management APIs
  async getUsers(): Promise<User[]> {
    await delay(300);
    return [...dummyUsers];
  },

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    await delay(500);
    const newUser: User = {
      ...user,
      id: (dummyUsers.length + 1).toString()
    };
    dummyUsers.push(newUser);
    return newUser;
  },

  async updateUser(userId: string, user: Partial<User>): Promise<User | null> {
    await delay(500);
    const index = dummyUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      dummyUsers[index] = { ...dummyUsers[index], ...user };
      return dummyUsers[index];
    }
    return null;
  },

  async deleteUser(userId: string): Promise<boolean> {
    await delay(300);
    const index = dummyUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      dummyUsers.splice(index, 1);
      return true;
    }
    return false;
  }
};