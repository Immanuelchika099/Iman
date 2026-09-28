import { useEffect, useRef } from "react";
import "./HalftoneWave.css";

function HalftoneWave({
  className = "",
  speed = 0.28,
  gridDensity = 55,
  dotSize = 0.72,
  opacity = 0.42,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    let frameId;
    let resizeObserver;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function noise(x, y, t) {
      const waveA = Math.sin(x * 0.010 + t * 0.85);
      const waveB = Math.sin(y * 0.014 - t * 0.58);
      const waveC = Math.sin((x + y) * 0.007 + t * 0.42);
      const waveD = Math.sin(Math.hypot(x - width * 0.52, y - height * 0.42) * 0.018 - t * 0.72);

      return (waveA * 0.28 + waveB * 0.22 + waveC * 0.2 + waveD * 0.3 + 1) / 2;
    }

    function render() {
      context.clearRect(0, 0, width, height);

      const cell = Math.max(width / gridDensity, 0.8);
      const radius = cell * dotSize * 0.5;

      context.fillStyle = "rgba(255,255,255,1)";

      for (let y = cell * 0.5; y < height + cell; y += cell) {
        for (let x = cell * 0.5; x < width + cell; x += cell) {
          const value = noise(x, y, time);
          const falloff = Math.pow(value, 2.15);
          const r = radius * (0.16 + falloff * 0.84);

          if (r < 0.12) continue;

          context.globalAlpha = opacity * (0.2 + falloff * 0.8);
          context.beginPath();
          context.arc(x, y, r, 0, Math.PI * 2);
          context.fill();
        }
      }

      context.globalAlpha = 1;
      time += 0.008 * speed;
      frameId = requestAnimationFrame(render);
    }

    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
    };
  }, [gridDensity, dotSize, opacity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}

export default HalftoneWave;
