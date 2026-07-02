// src/app/components/MasonryGrid.tsx
import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { WallpaperCard } from "./WallpaperCard";
import { Wallpaper } from "../../lib/types";

export function MasonryGrid({
  wallpapers,
  loading = false,
}: {
  wallpapers: Wallpaper[];
  loading?: boolean;
}) {
  const INITIAL_LOAD = 8; 
  const LOAD_MORE = 4;    

  const [displayCount, setDisplayCount] = useState(INITIAL_LOAD);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for real Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < wallpapers.length && !isFetchingNextPage) {
          setIsFetchingNextPage(true);
          
          setTimeout(() => {
            setDisplayCount((prev) => prev + LOAD_MORE);
            setIsFetchingNextPage(false);
          }, 500); 
        }
      },
      { threshold: 0.1, rootMargin: "100px" } 
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [displayCount, wallpapers.length, isFetchingNextPage]);

  // Nayi search/category aane par count reset karein
  useEffect(() => {
    setDisplayCount(INITIAL_LOAD);
  }, [wallpapers]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (wallpapers.length === 0) return null;

  const visibleWallpapers = wallpapers.slice(0, displayCount);

  return (
    <div className="w-full pb-10">
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4 space-y-6">
        {visibleWallpapers.map((w, i) => (
          <div key={w.id} className="break-inside-avoid">
            <WallpaperCard wallpaper={w} index={i} />
          </div>
        ))}
      </div>

      {/* Scroll Detector */}
      <div ref={bottomRef} className="mt-8 flex h-16 w-full items-center justify-center">
        {isFetchingNextPage && displayCount < wallpapers.length && (
          <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm backdrop-blur-md">
            <Loader2 className="h-4 w-4 animate-spin text-[var(--primary)]" />
            Loading more...
          </div>
        )}
      </div>
    </div>
  );
}