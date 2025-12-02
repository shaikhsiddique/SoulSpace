import React, { useContext, useEffect } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import { WorkingStep } from "../components/WorkingStep";
import Pricing from "../components/Pricing";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


// ✅ Import UserContext
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";




function Home() {
  const naviagte = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(()=>{
    if(user.tests.length === 0){
    naviagte('/assesment')
    }
  },[])

  return (
    <div>
      <Navbar />
      <Hero user={user} />
      <Services />
      <About />
      <WorkingStep />
      <Pricing />
  
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;
