import { useState } from "react";
import { Download, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GradientButton } from "./Primitives";
import { dataService } from "../../lib/data";
import { Wallpaper } from "../../lib/types";

export function DownloadButton({
  wallpaper,
  onDownloaded,
}: {
  wallpaper: Wallpaper;
  onDownloaded?: (w: Wallpaper) => void;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleDownload = async () => {
    if (state === "loading") return;
    setState("loading");
    try {
      // Fetch the image so we can trigger a real file download.
      const res = await fetch(wallpaper.image_url, { mode: "cors" });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${wallpaper.slug}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in a new tab if blob download is blocked.
      window.open(wallpaper.image_url, "_blank");
    }

    const updated = await dataService.registerDownload(wallpaper.id);
    if (updated) onDownloaded?.(updated);

    const { default: confetti } = await import("canvas-confetti");
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#7c5cff", "#ff8fc7", "#74b9ff", "#b06bff"],
    });
    toast.success("Wallpaper downloaded", { description: wallpaper.title });
    setState("done");
    setTimeout(() => setState("idle"), 2200);
  };

  return (
    <GradientButton size="lg" onClick={handleDownload} className="w-full sm:w-auto">
      {state === "loading" ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" /> Preparing…
        </>
      ) : state === "done" ? (
        <>
          <Check className="h-5 w-5" /> Downloaded
        </>
      ) : (
        <>
          <Download className="h-5 w-5" /> Download wallpaper
        </>
      )}
    </GradientButton>
  );
}
