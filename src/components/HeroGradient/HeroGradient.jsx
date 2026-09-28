import ColorBends from "../ColorBends/ColorBends";
import "./HeroGradient.css";

function HeroGradient() {
  return (
    <div className="hero-gradient" aria-hidden="true">
      <ColorBends
        className="hero-gradient__bends"
        colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
        rotation={90}
        speed={0.2}
        scale={1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={1}
        noise={0.15}
        parallax={0.5}
        iterations={1}
        intensity={1.5}
        bandWidth={6}
        transparent
      />
      <div className="hero-gradient__veil" />
    </div>
  );
}

export default HeroGradient;
