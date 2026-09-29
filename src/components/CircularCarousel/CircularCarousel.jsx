import { useEffect, useMemo, useRef, useState } from "react";
import "./CircularCarousel.css";

function CircularCarousel({
  items = [],
  preset = "cylinder",
  intro = "rise",
  cardWidth = 294,
  aspectRatio = 1,
  speed = 14,
  captions = false,
}) {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const rafRef = useRef(null);
  const dragRef = useRef({ active: false, x: 0, rotation: 0 });
  const [rotation, setRotation] = useState(0);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);

  const count = items.length;
  const angle = count ? 360 / count : 0;

  const geometry = useMemo(() => {
    const radius = Math.max(cardWidth * 0.58, (cardWidth / 2) / Math.tan(Math.PI / Math.max(count, 3)) * 0.72);
    if (preset === "wheel") return { radius: radius * 0.82, axis: "y", shape: "wheel" };
    if (preset === "panorama") return { radius: radius * 1.2, axis: "y", shape: "panorama" };
    return { radius, axis: "y", shape: "cylinder" };
  }, [cardWidth, count, preset]);

  useEffect(() => {
    if (!count) return undefined;

    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(64, now - last);
      last = now;

      if (!dragRef.current.active) {
        setRotation((value) => value + (speed * dt) / 1000);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [count, speed]);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), intro === "rise" ? 80 : 0);
    return () => window.clearTimeout(timer);
  }, [intro]);

  useEffect(() => {
    if (!count) return;
    const normalized = ((-rotation % 360) + 360) % 360;
    const next = Math.round(normalized / angle) % count;
    setActive(next);
  }, [rotation, angle, count]);

  function onPointerDown(event) {
    if (!rootRef.current) return;
    rootRef.current.setPointerCapture?.(event.pointerId);
    dragRef.current = { active: true, x: event.clientX, rotation };
    rootRef.current.dataset.dragging = "";
  }

  function onPointerMove(event) {
    if (!dragRef.current.active) return;
    const delta = event.clientX - dragRef.current.x;
    setRotation(dragRef.current.rotation + delta * 0.28);
  }

  function onPointerUp(event) {
    if (!dragRef.current.active) return;
    rootRef.current?.releasePointerCapture?.(event.pointerId);
    dragRef.current.active = false;
    rootRef.current?.removeAttribute("data-dragging");

    const snapped = Math.round(rotation / angle) * angle;
    setRotation(snapped);
  }

  function focusCard(index) {
    setRotation(-index * angle);
  }

  if (!count) return null;

  return (
    <div
      ref={rootRef}
      className="circular-carousel"
      data-ready={ready ? "" : undefined}
      data-draggable=""
      data-axis={geometry.axis}
      data-shape={geometry.shape}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="circular-carousel__view" ref={frameRef}>
        <div className="circular-carousel__stage">
          <div
            className="circular-carousel__camera"
            style={{ transform: "perspective(1100px) rotateX(-3deg)" }}
          >
            <div
              className="circular-carousel__ring"
              style={{
                transform: `rotateY(${rotation}deg)`,
              }}
            >
              {items.map((item, index) => (
                <button
                  type="button"
                  className="circular-carousel__card"
                  key={`${item.title}-${index}`}
                  onClick={() => focusCard(index)}
                  aria-label={`Focus ${item.title}`}
                  style={{
                    width: cardWidth,
                    height: cardWidth / aspectRatio,
                    transform: `rotateY(${index * angle}deg) translateZ(${geometry.radius}px)`,
                    marginLeft: -cardWidth / 2,
                    marginTop: -(cardWidth / aspectRatio) / 2,
                  }}
                >
                  <span className="circular-carousel__tile">
                    <span className="circular-carousel__frame" style={{ aspectRatio }}>
                      <img className="circular-carousel__photo" src={item.src} alt={item.alt || item.title} />
                      <span className="circular-carousel__shade" />
                      <span className="circular-carousel__inner" />
                    </span>
                    {captions && (
                      <span className="circular-carousel__caption">
                        <span className="circular-carousel__title">
                          <span>{item.title}</span>
                          {item.subtitle && <span className="circular-carousel__subtitle">{item.subtitle}</span>}
                        </span>
                        <span className="circular-carousel__count">
                          <span className="circular-carousel__digits">{String(index + 1).padStart(2, "0")}</span>
                          <span className="circular-carousel__slash">/</span>
                          <span className="circular-carousel__digits">{String(count).padStart(2, "0")}</span>
                        </span>
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <span className="circular-carousel__live" aria-live="polite">
        {items[active]?.title}
      </span>
    </div>
  );
}

export default CircularCarousel;
