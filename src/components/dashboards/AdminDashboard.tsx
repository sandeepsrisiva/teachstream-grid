import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Video, BarChart3 } from 'lucide-react';
import { dummyApi } from '@/services/dummyApi';
import { User } from '@/types/auth';
import { Quiz } from '@/types/quiz';
import { Video as VideoType } from '@/types/video';
import { QuizManager } from '@/components/QuizManager';
import { VideoManager } from '@/components/VideoManager';
import { UserManager } from '@/components/UserManager';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, quizzesData, videosData] = await Promise.all([
          dummyApi.getUsers(),
          dummyApi.getQuizzes(),
          dummyApi.getVideos()
        ]);
        setUsers(usersData);
        setQuizzes(quizzesData);
        setVideos(videosData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, []);

  const studentCount = users.filter(u => u.role === 'student').length;
  const teacherCount = users.filter(u => u.role === 'teacher').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videos.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="quizzes">Manage Quizzes</TabsTrigger>
          <TabsTrigger value="videos">Manage Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManager />
        </TabsContent>

        <TabsContent value="quizzes">
          <QuizManager />
        </TabsContent>

        <TabsContent value="videos">
          <VideoManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};