import { useEffect, useRef } from 'react';

const settings = {
  renderMode: 'characters', cellSize: 8, coverage: 100, density: 70, invert: false,
  charSet: ' .:-=+*#%@Ff', brightness: 100, contrast: 150, saturation: 120,
  grayscale: 80, edgeEmphasis: 30, tint: '#d83dff', tintOpacity: 0,
  pfx: { vignette: 38, scanLines: 40, chromatic: 15, bloom: 25, filmGrain: 30, glitch: 20, pixelate: 15, halftone: 30, filmDust: 66 },
  light: { x: .756, y: .644, radius: 100, intensity: 100 },
};

const clamp = value => Math.max(0, Math.min(255, value));

function adjustColor(r, g, b, luminance) {
  const contrast = settings.contrast / 100;
  r = ((r - 128) * contrast + 128) * (settings.brightness / 100);
  g = ((g - 128) * contrast + 128) * (settings.brightness / 100);
  b = ((b - 128) * contrast + 128) * (settings.brightness / 100);
  const gray = r * .299 + g * .587 + b * .114;
  const desaturate = settings.grayscale / 100;
  r = r * (1 - desaturate) + gray * desaturate;
  g = g * (1 - desaturate) + gray * desaturate;
  b = b * (1 - desaturate) + gray * desaturate;
  const saturation = settings.saturation / 100;
  return [clamp(gray + (r - gray) * saturation), clamp(gray + (g - gray) * saturation), clamp(gray + (b - gray) * saturation), luminance];
}

export default function AsciiWhoWeAre({ className = 'intro-ascii' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: true });
    const source = new Image();
    source.src = '/images/about/who-we-are-source.png';
    let frame = 0;
    let raf = 0;
    let imageData;
    let width = 0;
    let height = 0;

    const draw = time => {
      if (!imageData) return;
      const { data } = imageData;
      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = 'source-over';
      context.font = `${settings.cellSize + 2}px monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      for (let y = 0; y < height; y += settings.cellSize) {
        for (let x = 0; x < width; x += settings.cellSize) {
          const sx = Math.min(width - 1, x + (settings.cellSize >> 1));
          const sy = Math.min(height - 1, y + (settings.cellSize >> 1));
          const index = (sy * width + sx) * 4;
          const r = data[index], g = data[index + 1], b = data[index + 2];
          const lum = (r * .299 + g * .587 + b * .114) / 255;
          const wave = Math.sin(time * .00233 + x * .045 + y * .03) * .16;
          const edge = Math.abs(lum - ((data[index + 4] || r) * .299 + (data[index + 5] || g) * .587 + (data[index + 6] || b) * .114) / 255);
          const tone = Math.max(0, Math.min(1, lum + wave + edge * (settings.edgeEmphasis / 100)));
          if (((x / settings.cellSize) * 13 + (y / settings.cellSize) * 7 + frame) % 100 > settings.coverage) continue;
          const [cr, cg, cb] = adjustColor(r, g, b, tone);
          const charIndex = Math.floor((settings.invert ? tone : 1 - tone) * (settings.charSet.length - 1));
          context.fillStyle = `rgb(${cr},${cg},${cb})`;
          context.globalAlpha = .2 + tone * (settings.density / 100);
          context.fillText(settings.charSet[charIndex], x + settings.cellSize / 2, y + settings.cellSize / 2);
        }
      }
      context.restore();

      // The supplied rectangle mask reveals a quiet, unprocessed window of the source photo.
      context.save();
      context.beginPath();
      context.rect(width * .58, height * .56, width * .26, height * .19);
      context.clip();
      context.globalAlpha = .38;
      context.drawImage(source, 0, 0, width, height);
      context.restore();

      const glow = context.createRadialGradient(width * settings.light.x, height * settings.light.y, 0, width * settings.light.x, height * settings.light.y, settings.light.radius);
      glow.addColorStop(0, 'rgba(216,61,255,.3)'); glow.addColorStop(1, 'rgba(216,61,255,0)');
      context.fillStyle = glow; context.fillRect(0, 0, width, height);

      context.save();
      context.globalAlpha = settings.pfx.scanLines / 220;
      context.fillStyle = '#101010';
      for (let y = 0; y < height; y += 3) context.fillRect(0, y, width, 1);
      const vignette = context.createRadialGradient(width / 2, height / 2, Math.min(width, height) * .2, width / 2, height / 2, Math.max(width, height) * .72);
      vignette.addColorStop(0, 'rgba(0,0,0,0)'); vignette.addColorStop(1, `rgba(0,0,0,${settings.pfx.vignette / 100})`);
      context.globalAlpha = 1; context.fillStyle = vignette; context.fillRect(0, 0, width, height);
      context.globalAlpha = settings.pfx.filmGrain / 600;
      for (let i = 0; i < width * height / 48; i++) { context.fillStyle = Math.random() > .5 ? '#fff' : '#000'; context.fillRect(Math.random() * width, Math.random() * height, 1, 1); }
      context.globalAlpha = settings.pfx.filmDust / 650;
      context.fillStyle = '#fff';
      for (let i = 0; i < 16; i++) context.fillRect(Math.random() * width, Math.random() * height, 1, 1);
      context.restore();

      // Raster post-processing: soft bloom, RGB misregistration, intermittent tear,
      // coarse pixels, and a printed halftone layer.
      context.save();
      context.globalCompositeOperation = 'screen';
      context.globalAlpha = settings.pfx.bloom / 650;
      context.filter = 'blur(3px)';
      context.drawImage(canvas, 0, 0);
      context.filter = 'none';
      context.globalAlpha = settings.pfx.chromatic / 500;
      context.drawImage(canvas, -2, 0);
      context.globalCompositeOperation = 'source-over';
      context.globalAlpha = settings.pfx.pixelate / 450;
      context.fillStyle = '#f4f2eb';
      for (let y = 0; y < height; y += 12) for (let x = 0; x < width; x += 12) context.fillRect(x, y, 1, 1);
      context.globalAlpha = settings.pfx.halftone / 700;
      context.fillStyle = '#111';
      for (let y = 5; y < height; y += 9) for (let x = 5; x < width; x += 9) context.fillRect(x, y, 1.5, 1.5);
      if (Math.random() < settings.pfx.glitch / 1200) {
        const sliceY = Math.random() * height;
        const sliceHeight = 2 + Math.random() * 12;
        context.globalAlpha = .22;
        context.drawImage(canvas, 0, sliceY, width, sliceHeight, (Math.random() - .5) * 22, sliceY, width, sliceHeight);
      }
      context.restore();
      frame += 1;
      raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.floor(bounds.width * scale));
      height = Math.max(1, Math.floor(bounds.height * scale));
      canvas.width = width; canvas.height = height;
      const sample = document.createElement('canvas'); sample.width = width; sample.height = height;
      sample.getContext('2d').drawImage(source, 0, 0, width, height);
      imageData = sample.getContext('2d').getImageData(0, 0, width, height);
    };
    source.onload = () => { resize(); raf = requestAnimationFrame(draw); };
    const observer = new ResizeObserver(resize); observer.observe(canvas);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
