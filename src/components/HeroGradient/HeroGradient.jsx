import ColorBends from "../ColorBends/ColorBends";
import "./HeroGradient.css";

function HeroGradient() {
  return (
    <div className="hero-gradient" aria-hidden="true">
      <ColorBends
        className="hero-gradient__bends"
        colors={["#02050a", "#06152a", "#0b2948"]}
        rotation={90}
        speed={0.16}
        scale={1}
        frequency={0.9}
        warpStrength={0.85}
        mouseInfluence={0.65}
        parallax={0.3}
        noise={0.025}
        iterations={1}
        intensity={0.72}
        bandWidth={5}
        transparent
      />
      <div className="hero-gradient__veil" />
    </div>
  );
}

export default HeroGradient;
