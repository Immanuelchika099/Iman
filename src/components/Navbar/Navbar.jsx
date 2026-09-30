import{useLayoutEffect,useRef,useState}from"react";import gsap from"gsap";import"./Navbar.css";
const links=[["01","WORK","work"],["02","ABOUT","about"],["03","SERVICES","services"],["04","CONTACT","contact"]];
function Navbar(){
  const nav=useRef(null),menuPanel=useRef(null),menuItems=useRef([]),menuMeta=useRef(null),[open,setOpen]=useState(false);
  useLayoutEffect(()=>{
    const tl=gsap.timeline({delay:1.45});
    tl.fromTo(nav.current,{yPercent:-120,opacity:0},{yPercent:0,opacity:1,duration:1,ease:"power4.out"});
    return()=>tl.kill()
  },[]);
  useLayoutEffect(()=>{
    let lastY=0;
    let ticking=false;
    const threshold=5;
    const update=(y)=>{
      if(ticking)return;
      ticking=true;
      requestAnimationFrame(()=>{
        const currentY=Math.max(0,y);
        if(currentY<40){
          gsap.to(nav.current,{yPercent:0,opacity:1,duration:.45,ease:"power3.out",overwrite:true});
        }else if(currentY>lastY+threshold&&!open){
          gsap.to(nav.current,{yPercent:-110,opacity:0,duration:.5,ease:"power3.inOut",overwrite:true});
        }else if(currentY<lastY-threshold){
          gsap.to(nav.current,{yPercent:0,opacity:1,duration:.5,ease:"power3.out",overwrite:true});
        }
        lastY=currentY;
        ticking=false;
      });
    };
    const onLenisScroll=(event)=>update(event.detail?.scroll ?? 0);
    const onWindowScroll=()=>update(window.scrollY);
    window.addEventListener("iman-scroll",onLenisScroll);
    window.addEventListener("scroll",onWindowScroll,{passive:true});
    return()=>{
      window.removeEventListener("iman-scroll",onLenisScroll);
      window.removeEventListener("scroll",onWindowScroll);
    };
  },[open]);
  useLayoutEffect(()=>{
    if(!menuPanel.current)return;
    const items=menuItems.current.filter(Boolean);
    if(open){
      gsap.set(menuPanel.current,{autoAlpha:1,pointerEvents:"auto"});
      const tl=gsap.timeline();
      tl.fromTo(menuPanel.current,{clipPath:"circle(0% at calc(100% - 4rem) 3.4rem)"},{clipPath:"circle(150% at calc(100% - 4rem) 3.4rem)",duration:.9,ease:"power4.inOut"})
        .fromTo(items,{y:"4rem",opacity:0},{y:0,opacity:1,duration:.65,stagger:.09,ease:"power3.out"},"-=.45")
        .fromTo(menuMeta.current,{y:"2rem",opacity:0},{y:0,opacity:1,duration:.55,ease:"power3.out"},"-=.35");
      return()=>tl.kill()
    }
    const tl=gsap.timeline({onComplete:()=>gsap.set(menuPanel.current,{autoAlpha:0,pointerEvents:"none"})});
    tl.to(items,{y:"-2rem",opacity:0,duration:.3,stagger:.035,ease:"power2.in"})
      .to(menuPanel.current,{clipPath:"circle(0% at calc(100% - 4rem) 3.4rem)",duration:.65,ease:"power4.inOut"},"-=.12");
    return()=>tl.kill()
  },[open]);
  function goTo(id){setOpen(false);if(id==="about"){window.history.pushState({}, "", "/about");window.scrollTo(0,0);window.dispatchEvent(new PopStateEvent("popstate"));return}requestAnimationFrame(()=>{const target=document.getElementById(id);if(!target)return;const top=target.getBoundingClientRect().top+window.scrollY;window.scrollTo({top,behavior:"smooth"})})}
  return <><header ref={nav} className={open?"navbar is-open":"navbar"}>
    <div className="navbar__pill">
      <button className="navbar__brand" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>IMAN</button>
      <nav className="navbar__links">{links.map(([num,label,id])=><button key={id} onClick={()=>goTo(id)}>{label}</button>)}</nav>
      <div className="navbar__availability"><i/> AVAILABLE FOR SELECT PROJECTS</div>
      <button className="navbar__menu" onClick={()=>setOpen(v=>!v)} aria-label={open?"Close menu":"Open menu"} aria-expanded={open}><span/><span/></button>
    </div>

  </header>
  <div ref={menuPanel} className="navbar__menu-panel" aria-hidden={!open}>
    <div className="navbar__menu-content">
      <div className="navbar__menu-kicker"><span>IMAN / DIGITAL PRACTICE</span><span>MENU</span></div>
      <nav className="navbar__menu-links">
        {links.map(([num,label,id],i)=><button key={id} ref={el=>menuItems.current[i]=el} onClick={()=>goTo(id)}><span>{num}</span><strong>{label}</strong><em>↗</em></button>)}
      </nav>
      <div ref={menuMeta} className="navbar__menu-meta"><span>SOFTWARE ENGINEER · CREATIVE DEVELOPER · AI INTEGRATION</span><span>BUILD SOMETHING THAT MATTERS.</span></div>
    </div>
  </div>
  </>
}
export default Navbar;