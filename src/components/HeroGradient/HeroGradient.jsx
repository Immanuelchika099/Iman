import HalftoneWave from "../HalftoneWave/HalftoneWave";
import "./HeroGradient.css";

function HeroGradient() {
  return (
    <div className="hero-gradient" aria-hidden="true">
      <HalftoneWave
        className="halftone-wave"
        speed={0.32}
        gridDensity={58}
        dotSize={0.7}
        opacity={0.34}
      />
      <div className="hero-gradient__veil" />
    </div>
  );
}

export default HeroGradient;
