// src/lib/data.ts
import { supabase } from "./supabase";
import { DeviceType, SortFilter, Wallpaper } from "./types";

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const dataService = {
  async listWallpapers(opts?: { device?: DeviceType; filter?: SortFilter }): Promise<Wallpaper[]> {
    let query = supabase.from("wallpapers").select("*");
    
    if (opts?.device) {
      query = query.eq("device_type", opts.device);
    }
    
    if (opts?.filter === "trending") {
      query = query.eq("is_trending", true).order("downloads", { ascending: false });
    } else if (opts?.filter === "most_downloaded") {
      query = query.order("downloads", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }
    
    const { data, error } = await query;
    if (error) console.error("Error fetching wallpapers:", error);
    return (data as Wallpaper[]) || [];
  },

  async getTrending(limit = 12): Promise<Wallpaper[]> {
    const { data } = await supabase.from("wallpapers")
      .select("*")
      .eq("is_trending", true)
      .order("downloads", { ascending: false })
      .limit(limit);
    return (data as Wallpaper[]) || [];
  },

  async getActiveDevices(): Promise<DeviceType[]> {
    const { data } = await supabase.from("wallpapers").select("device_type");
    if (!data) return [];
    const set = new Set(data.map((w) => w.device_type));
    return ["mobile", "laptop", "desktop", "tablet"].filter((d) => set.has(d)) as DeviceType[];
  },

  async getWallpaperBySlug(slug: string): Promise<Wallpaper | null> {
    const { data } = await supabase.from("wallpapers").select("*").eq("slug", slug).single();
    return data as Wallpaper | null;
  },

  async getWallpaperById(id: string): Promise<Wallpaper | null> {
    const { data } = await supabase.from("wallpapers").select("*").eq("id", id).single();
    return data as Wallpaper | null;
  },

  async getSimilar(wallpaper: Wallpaper, limit = 6): Promise<Wallpaper[]> {
    const { data } = await supabase.from("wallpapers")
      .select("*")
      .eq("device_type", wallpaper.device_type)
      .neq("id", wallpaper.id)
      .limit(limit);
    return (data as Wallpaper[]) || [];
  },

  async registerDownload(id: string): Promise<Wallpaper | null> {
    // 1. Current download count nikalna
    const { data: w } = await supabase.from("wallpapers").select("downloads").eq("id", id).single();
    if (!w) return null;
    
    // 2. Count + 1 karke save karna
    const { data: updated } = await supabase.from("wallpapers")
      .update({ downloads: w.downloads + 1 })
      .eq("id", id)
      .select()
      .single();
    return updated as Wallpaper | null;
  },

  // ---- Admin Specific Methods ----
  async createWallpaper(input: Omit<Wallpaper, "id" | "slug" | "downloads" | "created_at"> & { slug?: string }): Promise<Wallpaper> {
    const slug = input.slug || slugify(input.title);
    const { data, error } = await supabase.from("wallpapers")
      .insert([{ ...input, slug, downloads: 0 }])
      .select()
      .single();
      
    if (error) console.error("Create error:", error);
    return data as unknown as Wallpaper;
  },

  async updateWallpaper(id: string, patch: Partial<Wallpaper>): Promise<Wallpaper | null> {
    if (patch.title && !patch.slug) patch.slug = slugify(patch.title);
    const { data } = await supabase.from("wallpapers").update(patch).eq("id", id).select().single();
    return data as Wallpaper | null;
  },

  async deleteWallpaper(id: string): Promise<void> {
    await supabase.from("wallpapers").delete().eq("id", id);
  },

  async getStats() {
    const { data: list } = await supabase.from("wallpapers").select("device_type, is_trending, downloads");
    const wallpapersList = list || [];
    
    const totalDownloads = wallpapersList.reduce((s, w) => s + (w.downloads || 0), 0);
    
    return {
      totalWallpapers: wallpapersList.length,
      totalDownloads,
      trendingCount: wallpapersList.filter((w) => w.is_trending).length,
      deviceCount: new Set(wallpapersList.map((w) => w.device_type)).size,
      latest: [], // Full detail fetch heavy hoga, admin dashboard me abhi blank theek hai
      mostDownloaded: [], 
      recentLogs: [],
      byDevice: (["mobile", "laptop", "desktop", "tablet"] as DeviceType[]).map((d) => ({
        device: d,
        count: wallpapersList.filter((w) => w.device_type === d).length,
        downloads: wallpapersList.filter((w) => w.device_type === d).reduce((s, w) => s + (w.downloads || 0), 0),
      })),
    };
  }
};