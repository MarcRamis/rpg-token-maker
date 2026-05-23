import { useEffect, useState } from "react";

export function useLoadedImage(src: string | null) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!src) {
      queueMicrotask(() => {
        if (!cancelled) setImage(null);
      });

      return () => {
        cancelled = true;
      };
    }

    const img = new window.Image();

    img.onload = () => {
      if (!cancelled) setImage(img);
    };

    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return image;
}