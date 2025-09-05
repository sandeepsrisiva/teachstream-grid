import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Video } from 'lucide-react';
import { dummyApi } from '@/services/dummyApi';
import { Video as VideoType } from '@/types/video';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const VideoManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    video_url: ''
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const data = await dummyApi.getVideos();
      setVideos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', video_url: '' });
    setEditingVideo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const videoData = {
        title: formData.title,
        video_url: formData.video_url,
        created_by: user?.id || '1'
      };

      if (editingVideo) {
        await dummyApi.updateVideo(editingVideo.id, videoData);
        toast({
          title: "Success",
          description: "Video updated successfully",
        });
      } else {
        await dummyApi.createVideo(videoData);
        toast({
          title: "Success",
          description: "Video added successfully",
        });
      }

      await loadVideos();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save video",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (video: VideoType) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      video_url: video.video_url
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (videoId: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await dummyApi.deleteVideo(videoId);
        toast({
          title: "Success",
          description: "Video deleted successfully",
        });
        await loadVideos();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete video",
          variant: "destructive",
        });
      }
    }
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Video Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.video_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    YouTube URLs will be automatically converted to embed format
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingVideo ? 'Update Video' : 'Add Video'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.length > 0 ? (
            videos.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <iframe
                        src={getEmbedUrl(video.video_url)}
                        title={video.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Added on {new Date(video.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(video)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(video.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No videos added yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};