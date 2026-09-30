import{useLayoutEffect,useRef}from"react";
import gsap from"gsap";
import{ScrollTrigger}from"gsap/ScrollTrigger";
import WireframeBall from"../WireframeBall/WireframeBall";
import"./Intersection.css";
gsap.registerPlugin(ScrollTrigger);

const statement="I combine design, technology, and AI to build digital experiences that are clear, useful, and built to last — with thoughtful interactions, solid engineering, and intelligent features that make the final product genuinely better to use.";

function Intersection(){
  const root=useRef(null);
  const stage=useRef(null);

  useLayoutEffect(()=>{
    const ctx=gsap.context(()=>{
      const q=gsap.utils.selector(root.current);
      const orb=q(".intersection__ball");
      const labels=q(".intersection__circle-label");
      const intro=q(".intersection__intro");
      const reveal=q(".intersection__reveal");
      const words=q(".intersection__statement-word");
      const about=q(".intersection__about-button");

      gsap.set(intro,{opacity:0,y:30});
      gsap.set(orb,{scale:.72,opacity:0,y:35});
      gsap.set(labels,{opacity:0,y:16});
      gsap.set(reveal,{autoAlpha:0});
      gsap.set(words,{opacity:0,filter:"blur(16px)",y:18});
      gsap.set(about,{opacity:0,y:20});

      const tl=gsap.timeline({
        scrollTrigger:{trigger:root.current,start:"top top",end:"+=430%",pin:stage.current,scrub:.75,anticipatePin:1}
      });

      tl.to(intro,{opacity:1,y:0,duration:.8,ease:"power3.out"})
        .to(orb,{scale:1,opacity:1,y:0,duration:1.25,ease:"power4.out"},"<.15")
        .to(labels,{opacity:1,y:0,duration:.7,ease:"power3.out",stagger:.16},"-=.55")
        .to(orb,{scale:1.035,duration:.65,ease:"sine.inOut"})
        .to(labels,{y:-4,duration:.55,ease:"sine.inOut",stagger:.08},"<")
        .to(orb,{scale:.86,opacity:.18,y:-10,duration:1.1,ease:"power3.inOut"})
        .to(labels,{opacity:0,y:-18,duration:.65,ease:"power3.inOut",stagger:.06},"<.05")
        .to(reveal,{autoAlpha:1,duration:.5,ease:"power2.out"})
        .to(words,{opacity:1,filter:"blur(0px)",y:0,duration:.8,ease:"power3.out",stagger:.035})
        .to(about,{opacity:1,y:0,duration:.55,ease:"power3.out"},"-=.35");
    },root);
    return()=>ctx.revert();
  },[]);

  return <section className="intersection" ref={root}>
    <div className="intersection__visual" ref={stage}>
      <div className="intersection__intro"><h2>I BUILD DIGITAL EXPERIENCES AT THE <em>INTERSECTION</em> OF</h2></div>
      <div className="intersection__stage">
        <div className="intersection__ball">
          <WireframeBall color="#8b8b8b"/>
          <span className="intersection__circle-label intersection__circle-label--aesthetic">AESTHETIC</span>
          <span className="intersection__circle-label intersection__circle-label--performance">PERFORMANCE</span>
          <span className="intersection__circle-label intersection__circle-label--strategy">STRATEGY</span>
        </div>
      </div>
      <div className="intersection__reveal">
        <p className="intersection__statement">{statement.split(" ").map((word,i)=><span className="intersection__statement-word" key={i}>{word}{i<statement.split(" ").length-1?" ":""}</span>)}</p>
        <a className="intersection__about-button" href="/about" onClick={e=>{e.preventDefault();window.history.pushState({},"","/about");window.scrollTo(0,0);window.dispatchEvent(new PopStateEvent("popstate"))}}>ABOUT ME <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span></a>
      </div>
    </div>
  </section>
}
export default Intersection;