import { useEffect, useRef } from "react";
import * as THREE from "three";

function WireframeBall({ className = "", color = "#7894ff" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.z = 4.8;

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.IcosahedronGeometry(1.28, 2);
    const material = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.72
    });
    group.add(new THREE.Mesh(geometry, material));

    const coreGeometry = new THREE.IcosahedronGeometry(1.02, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    group.add(new THREE.Mesh(coreGeometry, coreMaterial));

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const size = Math.max(1, Math.min(rect.width, rect.height));
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    let frame = 0;
    const tick = () => {
      group.rotation.x += 0.0025;
      group.rotation.y += 0.0045;
      group.rotation.z += 0.001;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      renderer.dispose();
    };
  }, [color]);

  return <div className={`wireframe-ball ${className}`}><canvas ref={canvasRef} aria-hidden="true" /></div>;
}

export default WireframeBall;