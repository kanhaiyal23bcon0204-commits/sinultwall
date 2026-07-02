export type DeviceType = "mobile" | "laptop" | "desktop" | "tablet";

export const DEVICE_LABELS: Record<DeviceType, string> = {
  mobile: "Mobile",
  laptop: "Laptop",
  desktop: "Desktop",
  tablet: "Tablet",
};

export const DEVICE_ORDER: DeviceType[] = ["mobile", "laptop", "desktop", "tablet"];

export interface Wallpaper {
  id: string;
  title: string;
  slug: string;
  device_type: DeviceType;
  image_url: string;
  resolution: string;
  tags: string[];
  downloads: number;
  is_trending: boolean;
  created_at: string;
}

export interface DownloadLog {
  id: string;
  wallpaper_id: string;
  device_type: DeviceType;
  downloaded_at: string;
}

export type SortFilter = "latest" | "trending" | "most_downloaded";

export const SORT_LABELS: Record<SortFilter, string> = {
  latest: "Latest",
  trending: "Trending",
  most_downloaded: "Most Downloaded",
};
