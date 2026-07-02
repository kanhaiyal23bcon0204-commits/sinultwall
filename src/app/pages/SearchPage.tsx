// src/app/pages/SearchPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Search } from "lucide-react";
import { MasonryGrid } from "../components/MasonryGrid";
import { EmptyState } from "../components/EmptyState";
import { Loader } from "../components/Skeletons";
import { PageTransition } from "../components/PublicLayout";
import { dataService } from "../../lib/data";
import { Wallpaper } from "../../lib/types";

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Agar query khali hai toh direct empty list set kardo
    if (!query.trim()) {
      setWallpapers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Database se saare wallpapers laakar filter karenge
    dataService.listWallpapers().then((allWallpapers) => {
      const lowerQuery = query.toLowerCase();
      
      const filtered = allWallpapers.filter((w) => {
        // Title me check karo
        const matchTitle = w.title.toLowerCase().includes(lowerQuery);
        // Tags me check karo (agar tags exist karte hain)
        const matchTags = w.tags?.some((t) => t.toLowerCase().includes(lowerQuery));
        
        return matchTitle || matchTags;
      });
      
      setWallpapers(filtered);
      setLoading(false);
    });
  }, [query]);

  return (
    <PageTransition>
      <section className="px-4 pt-10 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              onClick={() => navigate("/")}
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/60 text-gray-700 backdrop-blur-md transition-colors hover:bg-white/80 shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Search Results
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-gray-500">
                <Search className="h-4 w-4" />
                Showing results for <span className="font-semibold text-gray-900">"{query}"</span>
              </p>
            </div>
          </div>

          {loading ? (
            <Loader label="Searching wallpapers..." />
          ) : wallpapers.length === 0 ? (
            <div className="pt-10">
              <EmptyState
                title="No results found"
                description={`We couldn't find any wallpapers matching "${query}". Try searching with different keywords like "dark", "nature", or "anime".`}
                action={
                  <Link to="/" className="text-sm font-semibold text-[var(--primary)] hover:underline">
                    Clear search and go home
                  </Link>
                }
              />
            </div>
          ) : (
            <MasonryGrid wallpapers={wallpapers} loading={false} />
          )}
        </div>
      </section>
    </PageTransition>
  );
}