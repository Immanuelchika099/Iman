import { useEffect, useRef } from "react";
import "./ThinkingDots.css";

function ThinkingDots({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let dpr = 1;

    const dots = Array.from({ length: 150 }, (_, i) => ({
      seed: i * 17.731,
      radius: 0.45 + (i % 4) * 0.18,
      drift: 0.35 + (i % 7) * 0.055,
      phase: (i % 31) * 0.37,
      spread: 0.25 + (i % 11) / 11 * 0.7
    }));

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    const draw = (time) => {
      const t = time * 0.001;
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.72;
      const cy = height * 0.34;
      const maxX = Math.min(width * 0.34, 34 * 16);
      const maxY = height * 0.42;

      dots.forEach((dot) => {
        const angle = dot.seed + t * dot.drift;
        const cloudX = Math.sin(t * 0.32 + dot.phase) * width * 0.025;
        const cloudY = Math.cos(t * 0.27 + dot.phase) * height * 0.04;

        const x = cx + Math.cos(angle) * maxX * dot.spread + cloudX;
        const y = cy + Math.sin(angle * 1.17) * maxY * dot.spread + cloudY;

        const edge = Math.min(
          1,
          Math.min(
            x / Math.max(1, width * 0.28),
            (width - x) / Math.max(1, width * 0.18),
            y / Math.max(1, height * 0.55),
            (height - y) / Math.max(1, height * 0.28)
          )
        );

        const breathe = 0.45 + (Math.sin(t * 1.2 + dot.phase) + 1) * 0.2;
        const alpha = Math.max(0, Math.min(0.42, edge * breathe));

        if (alpha <= 0) return;

        ctx.beginPath();
        ctx.arc(x, y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 165, 205, ${alpha})`;
        ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`thinking-dots ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default ThinkingDots;
