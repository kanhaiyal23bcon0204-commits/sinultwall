// src/app/components/WallpaperCard.tsx
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Wallpaper } from "../../lib/types";

export function WallpaperCard({ wallpaper, index = 0 }: { wallpaper: Wallpaper; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Check if user is on mobile/touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 18 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (isTouchDevice) return; // Disable 3D tilt on mobile for better performance
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
    setHover(false);
  };

  const handleCardClick = () => {
    navigate(`/wallpaper/${wallpaper.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.4) }}
      style={{ perspective: 1000 }}
    >
      <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}>
        <div
          ref={ref}
          onClick={handleCardClick}
          onMouseMove={onMove}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={reset}
          className="group relative block overflow-hidden rounded-[1.4rem] border border-white/60 bg-white shadow-[0_18px_45px_-22px_rgba(80,60,160,0.55)] transition-shadow duration-300 hover:shadow-[0_30px_70px_-25px_rgba(124,92,255,0.6)] cursor-pointer"
        >
          <div className="relative overflow-hidden w-full h-full">
            <img
              src={wallpaper.image_url}
              alt={wallpaper.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
            />
            {/* Saare text, gradients, aur badges yahan se hata diye gaye hain */}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}