// src/app/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { AnimatedHero } from "../components/AnimatedHero";
import { MasonryGrid } from "../components/MasonryGrid";
import { PageTransition } from "../components/PublicLayout";
import { dataService } from "../../lib/data";
import { Wallpaper, DEVICE_LABELS, DeviceType } from "../../lib/types";
import { useActiveDevices } from "../../lib/use-active-devices";

export function HomePage() {
  const [allWallpapers, setAllWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { devices: activeDevices } = useActiveDevices();
  const [selectedFilters, setSelectedFilters] = useState<DeviceType[]>([]);

  useEffect(() => {
    dataService.listWallpapers({ filter: "most_downloaded" }).then((data) => {
      setAllWallpapers(data);
      setLoading(false);
    });
  }, []);

  const toggleFilter = (device: DeviceType) => {
    setSelectedFilters(prev => 
      prev.includes(device) 
        ? prev.filter(d => d !== device)
        : [...prev, device]
    );
  };

  const displayedWallpapers = selectedFilters.length > 0
    ? allWallpapers.filter(w => selectedFilters.includes(w.device_type))
    : allWallpapers;

  return (
    <PageTransition>
      <AnimatedHero />
      
      <section className="px-4 pt-4 pb-20">
        <div className="mx-auto max-w-6xl">
          
          {/* Multi-Select Filters */}
          {activeDevices.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
              {activeDevices.map(device => {
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
          )}

          <MasonryGrid wallpapers={displayedWallpapers} loading={loading} />
        </div>
      </section>
    </PageTransition>
  );
}