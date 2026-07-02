// src/app/components/admin/WallpaperTable.tsx
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Pencil, Trash2, Flame } from "lucide-react";
import { DEVICE_LABELS, Wallpaper } from "../../../lib/types";
import { formatCount, timeAgo } from "../../../lib/format";

export function WallpaperTable({
  wallpapers,
  onDelete,
  onToggleTrending,
}: {
  wallpapers: Wallpaper[];
  onDelete: (w: Wallpaper) => void;
  onToggleTrending: (w: Wallpaper) => void;
}) {
  const navigate = useNavigate();

  if (wallpapers.length === 0)
    return (
      <div className="rounded-3xl border border-white/60 bg-white/60 p-12 text-center text-[var(--muted-foreground)]">
        No wallpapers yet. Upload your first one.
      </div>
    );

  return (
    <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/65 backdrop-blur-xl">
      <div className="hidden grid-cols-[1.6fr_0.8fr_0.9fr_0.8fr_0.9fr_auto] gap-4 border-b border-[var(--border)] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] md:grid">
        <span>Wallpaper</span>
        <span>Device</span>
        <span>Resolution</span>
        <span>Downloads</span>
        <span>Added</span>
        <span className="text-right">Actions</span>
      </div>
      {wallpapers.map((w, i) => (
        <motion.div
          key={w.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.03 }}
          className="grid grid-cols-2 items-center gap-4 border-b border-[var(--border)] px-5 py-3.5 last:border-0 md:grid-cols-[1.6fr_0.8fr_0.9fr_0.8fr_0.9fr_auto]"
        >
          <div className="col-span-2 flex items-center gap-3 md:col-span-1">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--muted)]">
              <img src={w.image_url} alt={w.title} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate font-semibold">{w.title}</div>
              <div className="truncate text-xs text-[var(--muted-foreground)]">/{w.slug}</div>
            </div>
          </div>
          <span className="text-sm">{DEVICE_LABELS[w.device_type]}</span>
          <span className="text-sm text-[var(--muted-foreground)]">{w.resolution}</span>
          <span className="text-sm font-semibold">{formatCount(w.downloads)}</span>
          <span className="text-sm text-[var(--muted-foreground)]">{timeAgo(w.created_at)}</span>
          <div className="col-span-2 flex justify-end gap-1.5 md:col-span-1">
            <IconBtn
              title={w.is_trending ? "Unmark trending" : "Mark trending"}
              active={w.is_trending}
              onClick={() => onToggleTrending(w)}
            >
              <Flame className="h-4 w-4" />
            </IconBtn>
            <IconBtn title="Edit" onClick={() => navigate(`/admin/edit/${w.id}`)}>
              <Pencil className="h-4 w-4" />
            </IconBtn>
            <IconBtn title="Delete" danger onClick={() => onDelete(w)}>
              <Trash2 className="h-4 w-4" />
            </IconBtn>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  active,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-xl border border-white/60 transition-colors ${
        active
          ? "bg-[var(--accent)] text-[#c43a83]"
          : danger
            ? "bg-white/60 text-[var(--destructive)] hover:bg-[var(--accent)]"
            : "bg-white/60 text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]"
      }`}
    >
      {children}
    </button>
  );
}