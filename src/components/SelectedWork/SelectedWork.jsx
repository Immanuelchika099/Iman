import{useLayoutEffect,useRef}from"react";import gsap from"gsap";import{projects}from"../../data/projects";import"./SelectedWork.css";
function ProjectCard({project,index}){
 const card=useRef(null);
 function enter(){gsap.to(card.current,{y:-10,duration:.55,ease:"power3.out"});gsap.to(card.current.querySelector("img"),{scale:1.045,duration:.8,ease:"power3.out"})}
 function leave(){gsap.to(card.current,{y:0,duration:.55,ease:"power3.out"});gsap.to(card.current.querySelector("img"),{scale:1,duration:.8,ease:"power3.out"})}
 return <article ref={card} className="work-card" onMouseEnter={enter} onMouseLeave={leave}>
   <a className="work-card__visual" href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.name}`}>
     {project.previewImage?<img src={project.previewImage} alt={`${project.name} website homepage`}/>:<div className="work-card__fallback"><strong>{project.name}</strong><span>{project.type}</span></div>}
     <div className="work-card__shade"/>
     <div className="work-card__top"><span>0{index+1} / 2026</span><span>{project.type}</span></div>
     <div className="work-card__bottom"><div><span className="work-card__eyebrow">{project.type}</span><h3>{project.name}</h3></div><span className="work-card__arrow">↗</span></div>
   </a>
   <div className="work-card__info"><p>{project.description}</p><div className="work-card__links">{project.repoUrl&&<a href={project.repoUrl} target="_blank" rel="noreferrer">GITHUB ↗</a>}<a href={project.liveUrl} target="_blank" rel="noreferrer">VIEW PROJECT ↗</a></div></div>
 </article>
}
function SelectedWork(){
 const section=useRef(null);
 useLayoutEffect(()=>{const ctx=gsap.context(()=>{gsap.from(".work-card",{y:60,opacity:0,duration:.9,stagger:.12,ease:"power3.out",scrollTrigger:{trigger:section.current,start:"top 78%",once:true}})},section);return()=>ctx.revert()},[]);
 return <section id="work" className="selected-work" ref={section}><div className="section-inner"><div className="work-head"><div><span className="section-kicker">03 / SELECTED WORK</span><h2>SELECTED<br/><em>WORK.</em></h2></div><a className="github-link" href="https://github.com/Immanuelchika099" target="_blank" rel="noreferrer"><span className="github-mark">●</span> GITHUB ↗</a></div><div className="work-grid">{projects.map((project,i)=><ProjectCard key={project.id} project={project} index={i}/>)}</div></div></section>
}
export default SelectedWork;