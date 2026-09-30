import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/projects";
import "./SelectedWork.css";
import BlinkingSquares from "../BlinkingSquares/BlinkingSquares";
import ThinkingDots from "../ThinkingDots/ThinkingDots";

gsap.registerPlugin(ScrollTrigger);

function ExternalIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4 11 13M19 14v5H5V5h5"/></svg>;
}

function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .6a11.7 11.7 0 0 0-3.7 22.8c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6.2 0c2.4-1.6 3.4-1.2 3.4-1.2.6 1.7.2 3 .1 3.3.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.7 11.7 0 0 0 12 .6Z"/></svg>;
}

function ProjectCard({ project, index }) {
  const card = useRef(null);
  const image = useRef(null);
  const info = useRef(null);

  function enter() {
    gsap.to(card.current, { y: -6, duration: 0.7, ease: "power4.out" });
    gsap.to(image.current, { scale: 1.055, duration: 1.1, ease: "power3.out" });
    gsap.to(info.current, { y: -3, duration: 0.7, ease: "power4.out" });
    gsap.to(card.current.querySelector(".work-card__top"), { y: -8, autoAlpha: 1, duration: 0.45, ease: "power3.out" });
    gsap.to(card.current.querySelector(".work-card__bottom"), { y: -5, duration: 0.55, ease: "power3.out" });
  }

  function leave() {
    gsap.to(card.current, { y: 0, duration: 0.7, ease: "power4.out" });
    gsap.to(image.current, { scale: 1, duration: 1.1, ease: "power3.out" });
    gsap.to(info.current, { y: 0, duration: 0.7, ease: "power4.out" });
    gsap.to(card.current.querySelector(".work-card__top"), { y: 0, duration: 0.4, ease: "power3.out" });
    gsap.to(card.current.querySelector(".work-card__bottom"), { y: 0, duration: 0.5, ease: "power3.out" });
  }

  return (
    <article ref={card} className="work-card" data-work-card onMouseEnter={enter} onMouseLeave={leave}>
      <a className="work-card__visual" href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.name}`}>
        <img ref={image} src={project.previewImage} alt={`${project.name} website homepage`} />
        <div className="work-card__shade" />
        <div className="work-card__top"><span>0{index + 1} / {project.year}</span><span>{project.type}</span></div>
        <div className="work-card__bottom"><h3>{project.name}</h3><span className="work-card__arrow"><ExternalIcon /></span></div>
      </a>
      <div ref={info} className="work-card__info">
        <p>{project.description}</p>
        <div className="work-card__links">
          {project.repoUrl && <a className="work-card__icon" href={project.repoUrl} target="_blank" rel="noreferrer" aria-label={`${project.name} GitHub repository`}><GitHubIcon /></a>}
          <a className="work-card__view" href={project.liveUrl} target="_blank" rel="noreferrer">VIEW PROJECT <span>↗</span></a>
        </div>
      </div>
    </article>
  );
}

function SelectedWork() {
  const section = useRef(null);

  const track = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 71rem)", () => {
        const cards = gsap.utils.toArray("[data-work-card]");
        const distance = () => Math.max(0, track.current.scrollWidth - window.innerWidth);

        gsap.set(cards, { opacity: 0, y: 70, clipPath: "inset(8% 0 4% 0)" });
        cards.forEach((card) => {
          gsap.set(card.querySelector("img"), { scale: 1.12 });
          gsap.set(card.querySelector(".work-card__info"), { y: 24, opacity: 0 });
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        timeline
          .to(cards, { opacity: 1, y: 0, clipPath: "inset(0% 0 0% 0)", duration: 0.25, stagger: 0.07, ease: "power3.out" }, 0)
          .to(cards.map((card) => card.querySelector("img")), { scale: 1, duration: 0.3, stagger: 0.07, ease: "power2.out" }, 0)
          .to(cards.map((card) => card.querySelector(".work-card__info")), { y: 0, opacity: 1, duration: 0.22, stagger: 0.07, ease: "power2.out" }, 0.1)
          .to(track.current, { x: () => -distance(), duration: 1, ease: "none" }, 0.08);

        return () => timeline.scrollTrigger?.kill();
      });

      mm.add("(max-width: 70.99rem)", () => {
        const cards = gsap.utils.toArray("[data-work-card]");

        cards.forEach((card) => {
          const image = card.querySelector("img");
          const shade = card.querySelector(".work-card__shade");
          const top = card.querySelector(".work-card__top");
          const bottom = card.querySelector(".work-card__bottom");
          const info = card.querySelector(".work-card__info");

          gsap.set(card, { opacity: 1, y: 0, clearProps: "clipPath" });
          gsap.set(image, { scale: 1.08, yPercent: 4 });
          gsap.set(shade, { opacity: 0.35 });
          gsap.set(top, { y: 22, autoAlpha: 0 });
          gsap.set(bottom, { y: 35 });
          gsap.set(info, { y: 28, opacity: 0 });

          const intro = gsap.timeline({
            scrollTrigger: { trigger: card, start: "top 88%", end: "top 38%", scrub: 1.15 }
          });

          intro
            .to(card, { y: 0, ease: "power3.out", duration: 1 }, 0)
            .to(image, { scale: 1.02, yPercent: 0, ease: "power2.out", duration: 1 }, 0)
            .to(shade, { opacity: 1, ease: "none", duration: 0.8 }, 0)
            .to(top, { y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.7 }, 0.2)
            .to(bottom, { y: 0, ease: "power3.out", duration: 0.85 }, 0.12)
            .to(info, { y: 0, opacity: 1, ease: "power2.out", duration: 0.8 }, 0.3);
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="selected-work" ref={section}>
      <ThinkingDots className="selected-work__thinking" />
      <div className="selected-work__squares">
        <BlinkingSquares
          direction="right"
          gridSize={58}
          squareSize={0.48}
          fadeStart={0.58}
          fadeEnd={1}
          falloff={1.6}
          minBrightness={0.28}
          twinkleSpeed={0.7}
          twinkleStrength={0.55}
          intensity={0.65}
          opacity={0.42}
          squareColor="#3451B2"
          backgroundColor="transparent"
          dpr={1.5}
        />
      </div>

      <div className="selected-work__viewport"><div className="section-inner">
        <div className="work-head">
          <div><span className="section-kicker">SELECTED WORK</span><h2>SELECTED<br /><em>WORK.</em></h2></div>
          <a className="github-link" href="https://github.com/Immanuelchika099" target="_blank" rel="noreferrer" aria-label="IMAN GitHub"><GitHubIcon /></a>
        </div>

        <div className="work-scroll"><div className="work-track" ref={track}>{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}<a className="all-projects-button" href="https://github.com/Immanuelchika099" target="_blank" rel="noreferrer">VIEW ALL PROJECTS <span>↗</span></a></div></div>
      </div></div>
    </section>
  );
}

export default SelectedWork;