import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, Trophy, Play } from 'lucide-react';
import { dummyApi } from '@/services/dummyApi';
import { Quiz, QuizSubmission } from '@/types/quiz';
import { Video as VideoType } from '@/types/video';
import { useAuth } from '@/contexts/AuthContext';
import { QuizTaker } from '@/components/QuizTaker';
import { VideoPlayer } from '@/components/VideoPlayer';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [quizzesData, videosData, submissionsData] = await Promise.all([
          dummyApi.getQuizzes(),
          dummyApi.getVideos(),
          dummyApi.getQuizSubmissions()
        ]);
        
        setQuizzes(quizzesData);
        setVideos(videosData);
        
        // Filter submissions for current student
        const studentSubmissions = submissionsData.filter(s => s.student_id === user?.id);
        setSubmissions(studentSubmissions);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, [user?.id]);

  const completedQuizzes = submissions.length;
  const averageScore = submissions.length > 0 
    ? Math.round(submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length)
    : 0;

  const getQuizStatus = (quizId: string) => {
    const submission = submissions.find(s => s.quiz_id === quizId);
    return submission ? { completed: true, score: submission.score } : { completed: false };
  };

  if (selectedQuiz) {
    return (
      <QuizTaker 
        quiz={selectedQuiz} 
        onComplete={(score) => {
          setSelectedQuiz(null);
          // Refresh submissions
          dummyApi.getQuizSubmissions().then(data => {
            const studentSubmissions = data.filter(s => s.student_id === user?.id);
            setSubmissions(studentSubmissions);
          });
        }}
        onBack={() => setSelectedQuiz(null)}
      />
    );
  }

  if (selectedVideo) {
    return (
      <VideoPlayer 
        video={selectedVideo}
        onBack={() => setSelectedVideo(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Quizzes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Quizzes</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedQuizzes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videos.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="quizzes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quizzes">Take Quizzes</TabsTrigger>
          <TabsTrigger value="videos">Watch Videos</TabsTrigger>
          <TabsTrigger value="results">My Results</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle>Available Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((quiz) => {
                  const status = getQuizStatus(quiz.id);
                  return (
                    <Card key={quiz.id} className="relative">
                      <CardHeader>
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {quiz.questions.length} questions
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                            {status.completed ? (
                              <span className="text-sm text-green-600 font-medium">
                                Completed - Score: {status.score}%
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                Not attempted
                              </span>
                            )}
                          </div>
                          <Button 
                            onClick={() => setSelectedQuiz(quiz)}
                            variant={status.completed ? "secondary" : "default"}
                          >
                            {status.completed ? "Retake Quiz" : "Start Quiz"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>Available Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <Card key={video.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Added on {new Date(video.created_at).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => setSelectedVideo(video)}
                        className="w-full"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.length > 0 ? (
                  submissions.map((submission) => {
                    const quiz = quizzes.find(q => q.id === submission.quiz_id);
                    return (
                      <div key={`${submission.quiz_id}-${submission.submitted_at}`} 
                           className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{quiz?.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{submission.score}%</div>
                          <div className="text-sm text-muted-foreground">
                            {submission.score >= 70 ? 'Passed' : 'Failed'}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground">No quiz results yet. Take a quiz to see your scores!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};