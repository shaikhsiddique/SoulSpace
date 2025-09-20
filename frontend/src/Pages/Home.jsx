import React, { useContext } from "react";
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

function Home() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Navbar />
      <Hero user={user} />
      <Services />
      <About />
      <WorkingStep />
      <Pricing />
      {/* <Testimonial /> */}
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;
