import type { Position } from "../types/token";

export function getImageProps(
  image: HTMLImageElement | null,
  scale: number,
  position: Position,
  tokenSize: number,
  tokenCenter: number,
) {
  if (!image) return null;

  const ratio = Math.min(
    tokenSize / image.width,
    tokenSize / image.height,
  );

  const width = image.width * ratio;
  const height = image.height * ratio;

  return {
    x: tokenCenter + position.x,
    y: tokenCenter + position.y,
    width,
    height,
    offsetX: width / 2,
    offsetY: height / 2,
    scaleX: scale / 100,
    scaleY: scale / 100,
  };
}