import React, { useContext, useEffect, useRef, useState } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import { WorkingStep } from "../components/WorkingStep";
import Pricing from "../components/Pricing";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";


import gsap from "gsap";

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

 
  // Redirect user
  useEffect(() => {
    if (!user || !user.tests || user.tests.length === 0) {
      navigate("/assesment");
    }
  }, [user]);


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
