import{useLayoutEffect,useRef}from"react";import gsap from"gsap";import{ScrollTrigger}from"gsap/ScrollTrigger";import"./Intersection.css";gsap.registerPlugin(ScrollTrigger);

const statement="I combine design, technology, and AI to build digital experiences that are clear, useful, and built to last — with thoughtful interactions, solid engineering, and intelligent features that make the final product genuinely better to use.";
const icons=[
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V5h14v14H5Z"/><path d="M5 12h14M12 5v14"/></svg>,
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 3 12l4 8M17 4l4 8-4 8M14 3l-4 18"/></svg>,
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16M7 7l10 10M17 7 7 17"/></svg>
];

function Intersection(){
  const root=useRef(null);
  const stage=useRef(null);

  useLayoutEffect(()=>{
    const ctx=gsap.context(()=>{
      const q=gsap.utils.selector(root.current);
      const circles=q(".intersection__circle");
      const labels=q(".intersection__circle-label");
      const iconsEl=q(".intersection__icon");
      const intro=q(".intersection__intro");
      const reveal=q(".intersection__reveal");
      const words=q(".intersection__statement-word");
      const about=q(".intersection__about-button");

      gsap.set(intro,{opacity:0,y:30});
      gsap.set(circles,{scale:.72,opacity:.18});
      gsap.set(circles[0],{x:-70,y:-35});
      gsap.set(circles[1],{x:70,y:35});
      gsap.set(circles[2],{x:0,y:70});
      gsap.set(labels,{opacity:.35});
      gsap.set(iconsEl,{opacity:.2,y:8,scale:.82});
      gsap.set(reveal,{autoAlpha:0});
      gsap.set(words,{opacity:0,filter:"blur(16px)",y:18});
      gsap.set(about,{opacity:0,y:20});

      const floatTweens=iconsEl.map((icon,i)=>gsap.to(icon,{y:i===1?-5:-7,rotation:i===0?4:i===1?-4:5,duration:2.6+i*.35,ease:"sine.inOut",repeat:-1,yoyo:true,paused:true}));

      const tl=gsap.timeline({
        scrollTrigger:{trigger:root.current,start:"top top",end:"+=520%",pin:stage.current,scrub:.7,anticipatePin:1}
      });

      tl.to(intro,{opacity:1,y:0,duration:.7,ease:"power3.out"})
        .to(circles[0],{scale:1,opacity:.72,x:-80,y:-80,duration:1,ease:"power3.out"},"<")
        .to(circles[1],{scale:1,opacity:.72,x:80,y:80,duration:1,ease:"power3.out"},"<")
        .to(circles[2],{scale:1,opacity:.72,x:0,y:80,duration:1,ease:"power3.out"},"<")
        .to(labels[0],{opacity:1,duration:.4},"<.35")
        .to(iconsEl[0],{opacity:1,y:0,scale:1,duration:.45},"<")
        .call(()=>floatTweens[0].play())
        .to(labels[0],{opacity:.35,duration:.3},"<")
        .to(iconsEl[0],{opacity:.2,y:8,scale:.82,duration:.3},"<")
        .to(circles[0],{scale:.9,x:-115,y:-115,opacity:.35,duration:.7},"<")
        .to(circles[1],{scale:1.08,x:115,y:115,opacity:.9,duration:.7},"<")
        .to(labels[1],{opacity:1,duration:.4},"<.25")
        .to(iconsEl[1],{opacity:1,y:0,scale:1,duration:.45},"<")
        .call(()=>floatTweens[1].play())
        .to(labels[1],{opacity:.35,duration:.3},"<")
        .to(iconsEl[1],{opacity:.2,y:8,scale:.82,duration:.3},"<")
        .to(circles[1],{scale:.9,x:120,y:120,opacity:.35,duration:.7},"<")
        .to(circles[2],{scale:1.08,x:0,y:115,opacity:.9,duration:.7},"<")
        .to(labels[2],{opacity:1,duration:.4},"<.25")
        .to(iconsEl[2],{opacity:1,y:0,scale:1,duration:.45},"<")
        .call(()=>floatTweens[2].play())
        .to(labels[2],{opacity:.35,duration:.3},"<")
        .to(iconsEl[2],{opacity:.2,y:8,scale:.82,duration:.3},"<")
        .to(circles,{scale:1,opacity:.58,x:0,y:0,duration:1,ease:"power3.inOut"})
        .to(reveal,{autoAlpha:1,duration:.45,ease:"power2.out"})
        .to(words,{opacity:1,filter:"blur(0px)",y:0,duration:.8,ease:"power3.out",stagger:.035})
        .to(about,{opacity:1,y:0,duration:.55,ease:"power3.out"},"-=.35");
    },root);
    return()=>ctx.revert();
  },[]);

  return <section className="intersection" ref={root}>
    <div className="intersection__visual" ref={stage}>
      <div className="intersection__intro"><h2>I BUILD DIGITAL EXPERIENCES AT THE <em>INTERSECTION</em> OF</h2></div>
      <div className="intersection__stage">
        <div className="intersection__circle intersection__circle--one"><span className="intersection__icon">{icons[0]}</span><span className="intersection__circle-label">AESTHETIC</span></div>
        <div className="intersection__circle intersection__circle--two"><span className="intersection__icon">{icons[1]}</span><span className="intersection__circle-label">PERFORMANCE</span></div>
        <div className="intersection__circle intersection__circle--three"><span className="intersection__icon">{icons[2]}</span><span className="intersection__circle-label">STRATEGY</span></div>
        <div className="intersection__center-mark" aria-hidden="true"><span/></div>
      </div>
      <div className="intersection__reveal">
        <span className="intersection__reveal-kicker">THE RESULT</span>
        <p className="intersection__statement">{statement.split(" ").map((word,i)=><span className="intersection__statement-word" key={i}>{word}{i<statement.split(" ").length-1?" ":""}</span>)}</p>
        <a className="intersection__about-button" href="/about" onClick={e=>{e.preventDefault();window.history.pushState({}, "","/about");window.scrollTo(0,0);window.dispatchEvent(new PopStateEvent("popstate"))}}>ABOUT ME <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span></a>
      </div>
    </div>
  </section>
}
export default Intersection;