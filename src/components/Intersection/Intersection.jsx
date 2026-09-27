import{useLayoutEffect,useRef}from"react";
import gsap from"gsap";
import{ScrollTrigger}from"gsap/ScrollTrigger";
import"./Intersection.css";
gsap.registerPlugin(ScrollTrigger);

function Intersection(){
 const root=useRef(null);

 useLayoutEffect(()=>{
  const ctx=gsap.context(()=>{
   const visual=root.current.querySelector(".intersection__visual");
   const graphic=root.current.querySelector(".intersection__graphic");
   const labels=gsap.utils.toArray(".intersection__label");
   const reveal=root.current.querySelector(".intersection__reveal");
   const words=gsap.utils.toArray(".intersection__statement-word");
   const about=root.current.querySelector(".intersection__about-button");

   gsap.set(visual,{opacity:0,y:40});
   gsap.set(graphic,{opacity:0,scale:.86,rotate:-5});
   gsap.set(labels,{opacity:0,y:24});
   gsap.set(words,{opacity:0,filter:"blur(14px)",y:"2rem"});
   gsap.set(about,{autoAlpha:0,y:"2rem"});

   const introTl=gsap.timeline({
    scrollTrigger:{
     trigger:root.current,
     start:"top 78%",
     once:true
    }
   });

   introTl.to(visual,{opacity:1,y:0,duration:1,ease:"power4.out"})
    .to(graphic,{opacity:1,scale:1,rotate:0,duration:1.15,ease:"power4.out"},"-=.7")
    .to(labels,{opacity:1,y:0,duration:.7,stagger:.12,ease:"power3.out"},"-=.7");

   const revealTl=gsap.timeline({
    scrollTrigger:{
     trigger:reveal,
     start:"top 75%",
     once:true
    }
   });

   revealTl.to(words,{
    opacity:1,
    filter:"blur(0px)",
    y:0,
    duration:.8,
    ease:"power3.out",
    stagger:.035
   }).to(about,{
    autoAlpha:1,
    y:0,
    duration:.65,
    ease:"power3.out",
    pointerEvents:"auto"
   },"-=.2");
  },root);

  return()=>ctx.revert()
 },[]);

 return <section className="intersection" ref={root}>
  <div className="intersection__visual">
   <div className="intersection__copy">
    <span className="intersection__kicker">02 / APPROACH</span>
    <h2>I BUILD WEBSITES<br/>AT THE <em>INTERSECTION</em> OF:</h2>
   </div>

   <div className="intersection__graphic-wrap">
    <img
     className="intersection__graphic"
     src="https://cdn.prod.website-files.com/677fb4d34764579513f06df6/67d4075ace25276ca5db0c0a_circle-intersect.svg"
     alt=""
     aria-hidden="true"
    />

    <span className="intersection__label intersection__label--aesthetic">aesthetic</span>
    <span className="intersection__label intersection__label--performance">performance</span>
    <span className="intersection__label intersection__label--strategy">strategy</span>
   </div>
  </div>

  <div className="intersection__reveal">
   <p className="intersection__statement">{`Where clear thinking meets thoughtful interaction, solid engineering, and intelligent technology. I design digital experiences that feel considered, move with purpose, and make complex things easier to understand.`.split(" ").map((word,i)=><span className="intersection__statement-word" key={i}>{word}{"\\u00a0"}</span>)}</p>

   <a className="intersection__about-button" href="/about" onClick={e=>{
    e.preventDefault();
    window.history.pushState({},"","/about");
    window.scrollTo(0,0);
    window.dispatchEvent(new PopStateEvent("popstate"))
   }}>
    ABOUT ME
    <span aria-hidden="true">
     <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
    </span>
   </a>
  </div>
 </section>
}

export default Intersection;