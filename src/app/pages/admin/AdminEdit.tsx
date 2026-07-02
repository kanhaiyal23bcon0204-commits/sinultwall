import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { WallpaperForm } from "../../components/admin/WallpaperForm";
import { Loader } from "../../components/Skeletons";
import { EmptyState } from "../../components/EmptyState";
import { dataService } from "../../../lib/data";
import { useActiveDevices } from "../../../lib/use-active-devices";
import { Wallpaper } from "../../../lib/types";

export function AdminEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refresh } = useActiveDevices();
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    dataService.getWallpaperById(id).then((w) => {
      setWallpaper(w);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Loader label="Loading wallpaper" />;
  if (!wallpaper)
    return (
      <EmptyState
        title="Wallpaper not found"
        description="It may have already been deleted."
      />
    );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white/60 px-3.5 py-2 text-sm font-medium hover:bg-white/80"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </button>
        <h1 className="text-3xl font-bold tracking-tight">Edit wallpaper</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">Update details for “{wallpaper.title}”.</p>
      </motion.div>

      <WallpaperForm
        initial={wallpaper}
        submitLabel="Save changes"
        onSubmit={async (v) => {
          await dataService.updateWallpaper(wallpaper.id, {
            title: v.title,
            device_type: v.devices[0],
            image_url: v.image_url,
            resolution: v.resolution,
            tags: v.tags,
            is_trending: v.is_trending,
          });
          refresh();
          toast.success("Changes saved");
          navigate("/admin/dashboard");
        }}
      />
    </div>
  );
}
