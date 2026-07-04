// src/app/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { AnimatedHero } from "../components/AnimatedHero";
import { MasonryGrid } from "../components/MasonryGrid";
import { PageTransition } from "../components/PublicLayout";
import { dataService } from "../../lib/data";
import { Wallpaper, DEVICE_LABELS, DeviceType } from "../../lib/types";

export function HomePage() {
  const [allWallpapers, setAllWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<DeviceType[]>([]);
  
  // State to control how many wallpapers to show initially (Load More feature)
  const [visibleCount, setVisibleCount] = useState(12);

  // Hardcoded array so all 4 device buttons (including Tablet) ALWAYS appear
  const ALL_DEVICES: DeviceType[] = ["mobile", "laptop", "tablet", "desktop"];

  useEffect(() => {
    dataService.listWallpapers({ filter: "most_downloaded" }).then((data) => {
      setAllWallpapers(data);
      setLoading(false);
    });
  }, []);

  const toggleFilter = (device: DeviceType) => {
    // Reset to 12 wallpapers whenever a new filter is clicked
    setVisibleCount(12);
    setSelectedFilters(prev => 
      prev.includes(device) 
        ? prev.filter(d => d !== device)
        : [...prev, device]
    );
  };

  // Filter wallpapers based on selected categories
  const displayedWallpapers = selectedFilters.length > 0
    ? allWallpapers.filter(w => selectedFilters.includes(w.device_type))
    : allWallpapers;

  // Slice the array to only show the specified visible count
  const visibleWallpapers = displayedWallpapers.slice(0, visibleCount);

  return (
    <PageTransition>
      <AnimatedHero />
      
      <section className="px-4 pt-4 pb-20">
        <div className="mx-auto max-w-6xl">
          
          {/* Multi-Select Filters */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            {ALL_DEVICES.map(device => {
              const isSelected = selectedFilters.includes(device);
              return (
                <button
                  key={device}
                  onClick={() => toggleFilter(device)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 border ${
                    isSelected
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  {DEVICE_LABELS[device]}
                </button>
              );
            })}
          </div>

          {/* Pass the sliced visibleWallpapers to the grid instead of all of them */}
          <MasonryGrid wallpapers={visibleWallpapers} loading={loading} />

          {/* Load More Button */}
          {!loading && visibleCount < displayedWallpapers.length && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="rounded-xl bg-black px-8 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:shadow-lg active:scale-95"
              >
                Load More Wallpapers
              </button>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}