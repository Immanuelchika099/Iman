import ColorBends from "../ColorBends/ColorBends";
import "./HeroGradient.css";

function HeroGradient() {
  return (
    <div className="hero-gradient" aria-hidden="true">
      <ColorBends
        colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
        rotation={72}
        speed={0.42}
        scale={2.4}
        frequency={1.1}
        warpStrength={0.98}
        mouseInfluence={1}
        noise={0.21}
        parallax={0.5}
        iterations={1}
        intensity={0.2}
        bandWidth={6}
        transparent
        autoRotate={0}
        color="#3B82F6"
      />
    </div>
  );
}

export default HeroGradient;
