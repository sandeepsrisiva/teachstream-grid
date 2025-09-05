import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, Users } from 'lucide-react';
import { dummyApi } from '@/services/dummyApi';
import { Quiz, QuizSubmission } from '@/types/quiz';
import { Video as VideoType } from '@/types/video';
import { QuizManager } from '@/components/QuizManager';
import { VideoManager } from '@/components/VideoManager';
import { useAuth } from '@/contexts/AuthContext';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [quizzesData, videosData, submissionsData] = await Promise.all([
          dummyApi.getQuizzes(),
          dummyApi.getVideos(),
          dummyApi.getQuizSubmissions()
        ]);
        
        // Filter data created by this teacher
        const teacherQuizzes = quizzesData.filter(q => q.created_by === user?.id);
        const teacherVideos = videosData.filter(v => v.created_by === user?.id);
        
        setQuizzes(teacherQuizzes);
        setVideos(teacherVideos);
        setSubmissions(submissionsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, [user?.id]);

  const totalSubmissions = submissions.filter(s => 
    quizzes.some(q => q.id === s.quiz_id)
  ).length;

  const averageScore = submissions.length > 0 
    ? Math.round(submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Quizzes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="quizzes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quizzes">Manage Quizzes</TabsTrigger>
          <TabsTrigger value="videos">Manage Videos</TabsTrigger>
          <TabsTrigger value="results">Quiz Results</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes">
          <QuizManager />
        </TabsContent>

        <TabsContent value="videos">
          <VideoManager />
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.length > 0 ? (
                  submissions.map((submission) => {
                    const quiz = quizzes.find(q => q.id === submission.quiz_id);
                    if (!quiz) return null;
                    
                    return (
                      <div key={`${submission.quiz_id}-${submission.student_id}`} 
                           className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{quiz.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Student ID: {submission.student_id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{submission.score}%</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground">No quiz submissions yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};