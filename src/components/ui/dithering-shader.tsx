import { useEffect, useRef } from "react";

type DitheringShaderProps = {
  shape?: "wave";
  type?: "8x8";
  colorBack?: string;
  colorFront?: string;
  pxSize?: number;
  speed?: number;
  className?: string;
};

const bayer8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
];

export function DitheringShader({ colorBack = "#001122", colorFront = "#ff0088", pxSize = 3, speed = 0.6, className = "" }: DitheringShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    let frame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(bounds.width * ratio));
      height = Math.max(1, Math.round(bounds.height * ratio));
      canvas.width = width;
      canvas.height = height;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const render = (time: number) => {
      const cell = Math.max(2, pxSize * Math.min(window.devicePixelRatio || 1, 2));
      context.fillStyle = colorBack;
      context.fillRect(0, 0, width, height);
      context.fillStyle = colorFront;
      const tick = time * 0.001 * speed;
      for (let y = 0; y < height; y += cell) {
        for (let x = 0; x < width; x += cell) {
          const nx = x / width;
          const ny = y / height;
          const wave = 0.5 + 0.34 * Math.sin(nx * 15 + tick * 4 + Math.sin(ny * 8 - tick * 2) * 2.2);
          const falloff = Math.max(0, 1 - Math.abs(ny - 0.5) * 1.25);
          const threshold = (bayer8[((y / cell) & 7) * 8 + ((x / cell) & 7)] + 0.5) / 64;
          if (wave * falloff > threshold) context.fillRect(x, y, cell, cell);
        }
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [colorBack, colorFront, pxSize, speed]);

  return <canvas ref={canvasRef} className={`dithering-shader ${className}`} aria-hidden="true" />;
}
