// src/app/pages/admin/AdminUpload.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { UploadCloud, Image as ImageIcon, X, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { GradientButton, GlassPanel } from "../../components/Primitives";
import { dataService } from "../../../lib/data";
import { supabase } from "../../../lib/supabase";
import { DeviceType } from "../../../lib/types";

export function AdminUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [deviceType, setDeviceType] = useState<DeviceType>("mobile");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an image first");
    if (!title.trim()) return toast.error("Please enter a title");

    setUploading(true);
    const toastId = toast.loading("Uploading wallpaper...");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("wallpapers")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("wallpapers")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;
      const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      
      await dataService.createWallpaper({
        title,
        image_url: imageUrl,
        device_type: deviceType,
        resolution: "HD",
        tags: tagsArray,
        is_trending: false
      });

      toast.success("Wallpaper uploaded successfully!", { id: toastId });
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(error.message || "Failed to upload image", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-4"
      >
        <button
          onClick={() => navigate(-1)}
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/60 text-gray-700 backdrop-blur-md transition-colors hover:bg-white/80 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Wallpaper</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Add a new wallpaper to your database.
          </p>
        </div>
      </motion.div>

      <GlassPanel className="p-6 sm:p-8">
        <form onSubmit={handleUpload} className="space-y-6">
          
          {/* Image Upload Area */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Wallpaper Image</label>
            {!preview ? (
              <div className="relative flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 transition-colors hover:bg-gray-100/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <UploadCloud className="mb-3 h-10 w-10 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">Click or drag image to upload</p>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG or WEBP (Max 5MB)</p>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-black/5 flex items-center justify-center p-2">
                {/* Fixed: Removed fixed h-[300px] and used max-h-[500px] object-contain */}
                <img src={preview} alt="Preview" className="max-h-[500px] w-auto max-w-full object-contain rounded-xl" />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white backdrop-blur-md transition-colors hover:bg-black"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Neon Cyberpunk City"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Device Type */}
            <div className="space-y-2">
              <label htmlFor="deviceType" className="text-sm font-medium text-gray-700">Device Type</label>
              <select
                id="deviceType"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as DeviceType)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              >
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
                <option value="laptop">Laptop</option>
                <option value="tablet">Tablet</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. neon, dark, city, night"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <GradientButton
              type="submit"
              disabled={uploading}
              className="w-full justify-center py-3"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Publish Wallpaper
                </>
              )}
            </GradientButton>
          </div>
        </form>
      </GlassPanel>
    </div>
  );
}