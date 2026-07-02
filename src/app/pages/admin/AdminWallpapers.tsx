// src/app/pages/admin/AdminWallpapers.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { WallpaperTable } from "../../components/admin/WallpaperTable";
import { Loader } from "../../components/Skeletons";
import { dataService } from "../../../lib/data";
import { Wallpaper } from "../../../lib/types";
import { useActiveDevices } from "../../../lib/use-active-devices";

export function AdminWallpapers() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter"); // agar URL me ?filter=trending hai
  const { refresh: refreshDevices } = useActiveDevices();
  
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const list = await dataService.listWallpapers({ filter: "latest" });
    
    if (filter === "trending") {
      setWallpapers(list.filter(w => w.is_trending));
    } else {
      setWallpapers(list);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleDelete = async (w: Wallpaper) => {
    if (!confirm(`Delete "${w.title}"? This cannot be undone.`)) return;
    await dataService.deleteWallpaper(w.id);
    toast.success("Wallpaper deleted");
    await load();
    refreshDevices();
  };

  const handleToggle = async (w: Wallpaper) => {
    await dataService.updateWallpaper(w.id, { is_trending: !w.is_trending });
    toast.success(w.is_trending ? "Removed from trending" : "Marked as trending");
    load();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {filter === "trending" ? "Trending Wallpapers" : "All Wallpapers"}
        </h1>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Manage and organize your entire wallpaper collection.
        </p>
      </div>

      {loading ? (
        <Loader label="Loading wallpapers..." />
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-white/50 p-6 shadow-sm backdrop-blur-md">
          <WallpaperTable
            wallpapers={wallpapers}
            onDelete={handleDelete}
            onToggleTrending={handleToggle}
          />
        </div>
      )}
    </div>
  );
}