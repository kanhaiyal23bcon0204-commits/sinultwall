// src/app/pages/DetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Download, Maximize2, Tag, Share2, Check } from "lucide-react";
import { DownloadButton } from "../components/DownloadButton";
import { MasonryGrid } from "../components/MasonryGrid";
import { GlassPanel, Pill } from "../components/Primitives";
import { Loader } from "../components/Skeletons";
import { EmptyState } from "../components/EmptyState";
import { PageTransition } from "../components/PublicLayout";
import { dataService } from "../../lib/data";
import { DEVICE_LABELS, Wallpaper } from "../../lib/types";
import { formatCount } from "../../lib/format";

export function DetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [similar, setSimilar] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    dataService.getWallpaperBySlug(slug).then((w) => {
      if (!w) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setWallpaper(w);
      // Sirf real similar wallpapers fetch honge
      dataService.getSimilar(w).then(setSimilar);
      setLoading(false);
    });
  }, [slug]);

  const handleShare = async () => {
    const shareData = {
      title: `${wallpaper?.title} - SinultWall`,
      text: "Check out this premium wallpaper I found!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <Loader label="Loading wallpaper" />;

  if (notFound || !wallpaper)
    return (
      <div className="px-4 pt-24">
        <EmptyState
          title="Wallpaper not found"
          description="This wallpaper may have been removed."
          action={
            <Link to="/" className="text-sm font-semibold text-[var(--primary)]">
              Back to home
            </Link>
          }
        />
      </div>
    );

  return (
    <PageTransition>
      <section className="px-4 pt-10 pb-20">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 rounded-xl bg-white/60 px-3.5 py-2 text-sm font-medium backdrop-blur-md transition-colors hover:bg-white/80 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_40px_90px_-40px_rgba(80,60,160,0.7)]"
            >
              <img
                src={wallpaper.image_url}
                alt={wallpaper.title}
                loading="lazy"
                className="h-full max-h-[72vh] w-full object-cover"
              />
              <a
                href={wallpaper.image_url}
                target="_blank"
                rel="noreferrer"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-[var(--foreground)] opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
                aria-label="Open full size"
              >
                <Maximize2 className="h-4 w-4" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GlassPanel className="p-7">
                {wallpaper.is_trending && (
                  <Pill className="mb-4 bg-[var(--accent)] text-[var(--accent-foreground)]">
                    🔥 Trending
                  </Pill>
                )}
                <h1 className="text-3xl font-bold leading-tight tracking-tight">
                  {wallpaper.title}
                </h1>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Stat label="Device" value={DEVICE_LABELS[wallpaper.device_type]} />
                  <Stat label="Resolution" value={wallpaper.resolution} />
                  <Stat
                    label="Downloads"
                    value={formatCount(wallpaper.downloads)}
                    icon={<Download className="h-3.5 w-3.5" />}
                  />
                  <Stat label="Format" value="JPG · High-res" />
                </div>

                {wallpaper.tags.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      <Tag className="h-3.5 w-3.5" /> Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {wallpaper.tags.map((t) => (
                        <Pill key={t}>#{t}</Pill>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-7 flex flex-wrap gap-4 items-center">
                  <div className="flex-grow">
                    <DownloadButton
                      wallpaper={wallpaper}
                      onDownloaded={(w) => setWallpaper({ ...w })}
                    />
                  </div>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-5 py-[14px] text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 cursor-pointer"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                    {copied ? "Copied!" : "Share"}
                  </button>
                </div>
              </GlassPanel>
            </motion.div>
          </div>

          {similar.length > 0 && (
            <div className="mt-20 border-t border-gray-200/60 pt-10">
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">More like this</h2>
              <MasonryGrid wallpapers={similar} />
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/50 px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </div>
      <div className="mt-1 flex items-center gap-1.5 font-semibold">
        {icon}
        {value}
      </div>
    </div>
  );
}