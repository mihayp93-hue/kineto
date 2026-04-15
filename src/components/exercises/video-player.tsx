"use client";

import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toEmbedUrl, isDirectVideoUrl } from "@/lib/video-url";

export { toEmbedUrl, getVideoThumbnail } from "@/lib/video-url";

interface Annotation {
  id: string;
  timestampSec: number;
  note: string;
}

interface VideoPlayerProps {
  url: string;
  annotations?: Annotation[];
}

export function VideoPlayer({ url, annotations = [] }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(
    null
  );

  function handleTimeUpdate() {
    const currentTime = videoRef.current?.currentTime ?? 0;
    const current = annotations.find(
      (a) =>
        Math.abs(a.timestampSec - currentTime) < 1.5 &&
        a.id !== activeAnnotation?.id
    );
    if (current) {
      setActiveAnnotation(current);
    } else if (
      activeAnnotation &&
      Math.abs(activeAnnotation.timestampSec - currentTime) > 3
    ) {
      setActiveAnnotation(null);
    }
  }

  function seekTo(seconds: number) {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  }

  // Check if URL is a direct video file or an embeddable URL
  const isDirectVideo = isDirectVideoUrl(url);
  const embedUrl = isDirectVideo ? url : toEmbedUrl(url);

  return (
    <div>
      <div className="aspect-video bg-black rounded-t-lg overflow-hidden relative">
        {isDirectVideo ? (
          <video
            ref={videoRef}
            src={url}
            controls
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
          />
        ) : (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {activeAnnotation && (
          <div className="absolute bottom-16 left-4 right-4 bg-black/80 text-white p-3 rounded-lg text-sm animate-in fade-in">
            <span className="font-mono text-xs text-primary mr-2">
              {formatTimestamp(activeAnnotation.timestampSec)}
            </span>
            {activeAnnotation.note}
          </div>
        )}
      </div>

      {annotations.length > 0 && (
        <div className="p-3 border-t bg-muted/50">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Adnotări (apasă pentru a sări)
          </p>
          <div className="flex flex-wrap gap-2">
            {annotations.map((annotation) => (
              <button
                key={annotation.id}
                onClick={() => seekTo(annotation.timestampSec)}
                className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded border hover:bg-muted transition-colors"
              >
                <Badge
                  variant="secondary"
                  className="text-[10px] font-mono px-1"
                >
                  {formatTimestamp(annotation.timestampSec)}
                </Badge>
                <span className="line-clamp-1 max-w-[200px]">
                  {annotation.note}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

