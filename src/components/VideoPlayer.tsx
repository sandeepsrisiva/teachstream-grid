import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Video } from '@/types/video';

interface VideoPlayerProps {
  video: Video;
  onBack: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onBack }) => {
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Videos
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{video.title}</CardTitle>
          <p className="text-muted-foreground">
            Added on {new Date(video.created_at).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <iframe
              src={getEmbedUrl(video.video_url)}
              title={video.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};