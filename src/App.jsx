import { useEffect, useState } from "react";
import Preloader from "./components/Preloader/Preloader";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Marquee from "./components/Marquee/Marquee";
import Intersection from "./components/Intersection/Intersection";
import SelectedWork from "./components/SelectedWork/SelectedWork";
import About from "./components/About/About";
import Services from "./components/Services/Services";
import Tech from "./components/Tech/Tech";
import Availability from "./components/Availability/Availability";
import ScrollMarquee from "./components/ScrollMarquee/ScrollMarquee";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import StartProject from "./components/StartProject/StartProject";
import "./App.css";
function App(){
  const [path,setPath]=useState(window.location.pathname);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{const onPop=()=>setPath(window.location.pathname);window.addEventListener("popstate",onPop);return()=>window.removeEventListener("popstate",onPop)},[]);
  useEffect(()=>{
    document.documentElement.classList.toggle("is-loading",loading);
    const fallback=window.setTimeout(()=>setLoading(false),2200);
    return()=>{window.clearTimeout(fallback);document.documentElement.classList.remove("is-loading")};
  },[loading]);
  if(path==="/start-a-project") return <div className="site-shell"><Navbar/><StartProject/><Footer/></div>;
  return <div className="site-shell">
    {loading&&<Preloader onComplete={()=>setLoading(false)}/>}
    <Navbar/>
    <main><Hero/><Marquee/><Intersection/><SelectedWork/><About/><Services/><Tech/><Availability/><ScrollMarquee/><Contact/></main>
    <Footer/>
  </div>
}
export default App;