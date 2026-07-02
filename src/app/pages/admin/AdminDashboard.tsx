// src/app/pages/admin/AdminDashboard.tsx
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
} from "recharts";
import { Images, Download, Flame, MonitorSmartphone, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { StatisticsCard } from "../../components/admin/StatisticsCard";
import { WallpaperTable } from "../../components/admin/WallpaperTable";
import { GradientButton, GlassPanel } from "../../components/Primitives";
import { Loader } from "../../components/Skeletons";
import { dataService } from "../../../lib/data";
import { DEVICE_LABELS, Wallpaper, DeviceType } from "../../../lib/types";
import { useActiveDevices } from "../../../lib/use-active-devices";
import { formatCount, timeAgo } from "../../../lib/format";

type StatsResult = Awaited<ReturnType<typeof dataService.getStats>>;
const BARS = ["#7c5cff", "#ff8fc7", "#74b9ff", "#b06bff"];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { refresh: refreshDevices } = useActiveDevices();
  const [stats, setStats] = useState<StatsResult | null>(null);
  const [recentWallpapers, setRecentWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [s, list] = await Promise.all([
      dataService.getStats(),
      dataService.listWallpapers({ filter: "latest" }),
    ]);
    setStats(s);
    setRecentWallpapers(list.slice(0, 5)); 
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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

  if (loading || !stats) return <Loader label="Loading dashboard" />;

  const chartData = stats.byDevice.map((d: any) => ({
    name: DEVICE_LABELS[d.device as DeviceType],
    downloads: d.downloads,
  }));

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Overview of your wallpaper collection.
          </p>
        </div>
        <GradientButton onClick={() => navigate("/admin/upload")}>
          <Plus className="h-4 w-4" /> Upload
        </GradientButton>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div 
          onClick={() => navigate('/admin/wallpapers')} 
          className="cursor-pointer transition-transform active:scale-95 hover:-translate-y-1"
        >
          <StatisticsCard index={0} label="Wallpapers" value={stats.totalWallpapers} icon={Images} accent="linear-gradient(135deg,#7c5cff,#a06bff)" />
        </div>

        <div className="opacity-90">
          <StatisticsCard index={1} label="Total downloads" value={formatCount(stats.totalDownloads)} icon={Download} accent="linear-gradient(135deg,#74b9ff,#5aa0ff)" />
        </div>

        <div 
          onClick={() => navigate('/admin/wallpapers?filter=trending')} 
          className="cursor-pointer transition-transform active:scale-95 hover:-translate-y-1"
        >
          <StatisticsCard index={2} label="Trending" value={stats.trendingCount} icon={Flame} accent="linear-gradient(135deg,#ff8fc7,#ff6fa8)" />
        </div>

        <div className="cursor-pointer transition-transform active:scale-95 hover:-translate-y-1">
          <StatisticsCard index={3} label="Active devices" value={stats.deviceCount} icon={MonitorSmartphone} accent="linear-gradient(135deg,#b06bff,#9b59ff)" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <GlassPanel className="p-6">
          <h2 className="text-lg font-semibold">Downloads by device</h2>
          <div className="mt-4 h-64">
            {stats.totalDownloads === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--border)] text-center text-sm text-[var(--muted-foreground)]">
                <span>No download data yet.</span>
                <span className="text-xs">Upload wallpapers and analytics will appear here.</span>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap={28}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="#837ca0" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#837ca0" tickFormatter={formatCount} />
                <Tooltip
                  cursor={{ fill: "rgba(124,92,255,0.06)" }}
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid rgba(124,92,255,0.15)",
                    boxShadow: "0 20px 50px -20px rgba(80,60,160,0.4)",
                  }}
                  formatter={(v: number) => [formatCount(v), "Downloads"]}
                />
                <Bar dataKey="downloads" radius={[10, 10, 10, 10]}>
                  {chartData.map((entry: any, i: number) => (
                    <Cell key={`cell-${entry?.name || i}`} fill={BARS[i % BARS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <h2 className="text-lg font-semibold">Recent downloads</h2>
          <div className="mt-4 space-y-3">
            {stats.recentLogs.length === 0 && (
              <p className="text-sm text-[var(--muted-foreground)]">No downloads logged yet.</p>
            )}
            {stats.recentLogs.map((log: any) => {
              // FIXED: Changed 'wallpapers' to 'recentWallpapers' and explicitly typed 'x' as 'Wallpaper'
              const w = recentWallpapers.find((x: Wallpaper) => x.id === log.wallpaper_id);
              return (
                <div key={log.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium">{w?.title ?? "Wallpaper"}</span>
                  <span className="shrink-0 text-xs text-[var(--muted-foreground)]">
                    {timeAgo(log.downloaded_at)}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassPanel>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Wallpapers</h2>
            <button 
                onClick={() => navigate('/admin/wallpapers')} 
                className="flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline"
            >
                View all <ArrowRight className="h-4 w-4" />
            </button>
        </div>
        <WallpaperTable
          wallpapers={recentWallpapers}
          onDelete={handleDelete}
          onToggleTrending={handleToggle}
        />
      </div>
    </div>
  );
}