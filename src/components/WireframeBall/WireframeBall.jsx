import { useEffect, useRef } from "react";
import * as THREE from "three";

function WireframeBall({ className = "", color = "#8b8b8b" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const group = new THREE.Group();
    group.rotation.set(0.2, -0.25, 0);
    scene.add(group);

    const baseColor = new THREE.Color(color);

    // Dense triangular wireframe — intentionally kept lightweight so three
    // instances can animate together inside the pinned Intersection section.
    const geometry = new THREE.IcosahedronGeometry(1.28, 3);
    const edges = new THREE.EdgesGeometry(geometry, 8);

    const material = new THREE.LineBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0.58,
      depthWrite: false
    });

    const wireframe = new THREE.LineSegments(edges, material);
    group.add(wireframe);

    // A second, tighter shell gives the ball the layered/raymarched feeling
    // without adding another heavy render pass.
    const innerGeometry = new THREE.IcosahedronGeometry(0.92, 2);
    const innerEdges = new THREE.EdgesGeometry(innerGeometry, 10);
    const innerMaterial = new THREE.LineBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0.16,
      depthWrite: false
    });

    const innerWireframe = new THREE.LineSegments(innerEdges, innerMaterial);
    innerWireframe.rotation.set(0.35, 0.55, 0.15);
    group.add(innerWireframe);

    // Soft central volume behind the wireframe.
    const glowGeometry = new THREE.SphereGeometry(0.98, 24, 24);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0.018,
      depthWrite: false
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const size = Math.max(1, Math.min(rect.width, rect.height));

      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };

    resize();

    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    const clock = new THREE.Clock();
    let frame = 0;

    const tick = () => {
      const t = clock.getElapsedTime();

      group.rotation.x = 0.2 + t * 0.16;
      group.rotation.y = -0.25 + t * 0.28;
      group.rotation.z = Math.sin(t * 0.22) * 0.08;

      innerWireframe.rotation.x = t * -0.11;
      innerWireframe.rotation.y = t * 0.18;
      innerWireframe.rotation.z = t * 0.07;

      const pulse = 1 + Math.sin(t * 1.1) * 0.018;
      glow.scale.setScalar(pulse);

      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();

      geometry.dispose();
      edges.dispose();
      material.dispose();

      innerGeometry.dispose();
      innerEdges.dispose();
      innerMaterial.dispose();

      glowGeometry.dispose();
      glowMaterial.dispose();

      renderer.dispose();
    };
  }, [color]);

  return (
    <div className={`wireframe-ball ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default WireframeBall;
