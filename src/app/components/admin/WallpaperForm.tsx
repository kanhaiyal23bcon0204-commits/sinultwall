// File: src/app/components/admin/WallpaperForm.tsx
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { UploadCloud, Loader2, X, Check } from "lucide-react";
import { GradientButton, GlassPanel } from "../Primitives";
import { DEVICE_ORDER, DEVICE_LABELS, DeviceType, Wallpaper } from "../../../lib/types";
import { slugify } from "../../../lib/data";

export interface WallpaperFormValues {
  title: string;
  devices: DeviceType[];
  image_url: string;
  resolution: string;
  tags: string[];
  is_trending: boolean;
}

export function WallpaperForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Wallpaper;
  submitLabel: string;
  onSubmit: (v: WallpaperFormValues) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [devices, setDevices] = useState<DeviceType[]>(
    initial ? [initial.device_type] : [],
  );
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [resolution, setResolution] = useState(initial?.resolution ?? "");
  const [tagsText, setTagsText] = useState(initial?.tags.join(", ") ?? "");
  const [trending, setTrending] = useState(initial?.is_trending ?? false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setDevices([initial.device_type]);
      setImageUrl(initial.image_url);
      setResolution(initial.resolution);
      setTagsText(initial.tags.join(", "));
      setTrending(initial.is_trending);
    }
  }, [initial]);

  // Auto-detect the image resolution from its natural dimensions.
  useEffect(() => {
    if (!imageUrl) {
      setResolution("");
      return;
    }
    const img = new Image();
    img.onload = () => setResolution(`${img.naturalWidth} × ${img.naturalHeight}`);
    img.src = imageUrl;
  }, [imageUrl]);

  const slug = slugify(title) || "untitled";

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleDevice = (d: DeviceType) =>
    setDevices((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || devices.length === 0) return;
    setSaving(true);
    await onSubmit({
      title: title.trim(),
      devices,
      image_url: imageUrl,
      resolution,
      tags: tagsText
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean),
      is_trending: trending,
    });
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      {/* Image */}
      <GlassPanel className="p-6">
        <label className="mb-2 block text-sm font-medium">Wallpaper image</label>
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFile(e.dataTransfer.files?.[0]);
          }}
          className="group relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[var(--border)] bg-white/50 transition-colors hover:border-[var(--primary)]"
        >
          {imageUrl ? (
            <>
              
              <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" loading="lazy" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageUrl("");
                }}
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl bg-white/85 text-[var(--foreground)] backdrop-blur-md"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 px-6 text-center text-[var(--muted-foreground)]">
              <UploadCloud className="h-8 w-8 text-[var(--primary)]" />
              <span className="font-medium text-[var(--foreground)]">Click or drop an image</span>
              <span className="text-xs">PNG, JPG up to ~10MB</span>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        {resolution && (
          <p className="mt-3 text-xs text-[var(--muted-foreground)]">
            Detected resolution: <strong className="text-[var(--foreground)]">{resolution}</strong>
          </p>
        )}
      </GlassPanel>

      {/* Fields */}
      <div className="space-y-4">
        <Field label="Title">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Neon Dusk Skyline"
            className="w-full bg-transparent outline-none"
          />
        </Field>
        <div className="px-1 text-xs text-[var(--muted-foreground)]">
          Slug: <code className="rounded bg-[var(--muted)] px-1.5 py-0.5">/{slug}</code>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium">
            Devices{" "}
            <span className="font-normal text-[var(--muted-foreground)]">
              (select one or more)
            </span>
          </span>
          <div className="flex flex-wrap gap-2">
            {DEVICE_ORDER.map((d) => {
              const active = devices.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDevice(d)}
                  className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-transparent bg-gradient-to-r from-[var(--primary)] to-[#a06bff] text-white shadow-[0_10px_24px_-12px_rgba(124,92,255,0.7)]"
                      : "border-white/60 bg-white/60 text-[var(--secondary-foreground)] hover:bg-white/80"
                  }`}
                >
                  {active && <Check className="h-3.5 w-3.5" />}
                  {DEVICE_LABELS[d]}
                </button>
              );
            })}
          </div>
          {initial && devices.length > 1 && (
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              Editing applies to the first selected device.
            </p>
          )}
        </div>

        <Field label="Tags (comma separated)">
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="neon, city, vaporwave"
            className="w-full bg-transparent outline-none"
          />
        </Field>

        <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/60 bg-white/60 px-4 py-3.5">
          <span>
            <span className="block font-medium">Mark as trending</span>
            <span className="text-xs text-[var(--muted-foreground)]">
              Trending wallpapers appear on the homepage feed.
            </span>
          </span>
          <button
            type="button"
            onClick={() => setTrending((v) => !v)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              trending ? "bg-[var(--primary)]" : "bg-[var(--switch-background)]"
            }`}
          >
            <motion.span
              layout
              className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
              style={{ left: trending ? 24 : 4 }}
            />
          </button>
        </label>

        <GradientButton
          type="submit"
          size="lg"
          className="w-full"
          disabled={saving || !imageUrl || devices.length === 0}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            submitLabel
          )}
        </GradientButton>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <div className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--ring)]">
        {children}
      </div>
    </label>
  );
}