import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router";
import { motion } from "motion/react";
import { Smartphone, Laptop, Monitor, Tablet } from "lucide-react";
import { MasonryGrid } from "../components/MasonryGrid";
import { FilterDropdown } from "../components/FilterDropdown";
import { EmptyState } from "../components/EmptyState";
import { PageTransition } from "../components/PublicLayout";
import { dataService } from "../../lib/data";
import { DEVICE_LABELS, DeviceType, SortFilter, Wallpaper } from "../../lib/types";

const ICONS: Record<DeviceType, typeof Smartphone> = {
  mobile: Smartphone,
  laptop: Laptop,
  desktop: Monitor,
  tablet: Tablet,
};

const VALID: DeviceType[] = ["mobile", "laptop", "desktop", "tablet"];

export function DevicePage() {
  const { device } = useParams<{ device: string }>();
  const [filter, setFilter] = useState<SortFilter>("latest");
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  const valid = VALID.includes(device as DeviceType);

  useEffect(() => {
    if (!valid) return;
    setLoading(true);
    dataService
      .listWallpapers({ device: device as DeviceType, filter })
      .then((w) => {
        setWallpapers(w);
        setLoading(false);
      });
  }, [device, filter, valid]);

  if (!valid) return <Navigate to="/" replace />;

  const dt = device as DeviceType;
  const Icon = ICONS[dt];

  return (
    <PageTransition>
      <section className="px-4 pt-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#ff8fc7] text-white shadow-[0_14px_30px_-10px_rgba(124,92,255,0.7)]">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {DEVICE_LABELS[dt]} Wallpapers
                </h1>
                <p className="mt-1 text-[var(--muted-foreground)]">
                  {loading ? "Loading…" : `${wallpapers.length} wallpapers`} crafted for{" "}
                  {DEVICE_LABELS[dt].toLowerCase()} screens.
                </p>
              </div>
            </div>
            <FilterDropdown value={filter} onChange={setFilter} />
          </motion.div>

          {!loading && wallpapers.length === 0 ? (
            <EmptyState
              title={`No ${DEVICE_LABELS[dt].toLowerCase()} wallpapers`}
              description="Try a different filter or check back later for new uploads."
            />
          ) : (
            <MasonryGrid wallpapers={wallpapers} loading={loading} />
          )}
        </div>
      </section>
    </PageTransition>
  );
}
