import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Services from "./components/Services";
import About from "./components/About";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Testimonial from "./components/Testimonial";
import { WorkingStep } from "./components/WorkingStep";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <Router>
      <div className="font-primary overflow-x-hidden">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Services />
                <About />
                <WorkingStep />
                <Pricing />
                <Testimonial />
                <Contact />
              </>
            }
          />

          <Route path="/chatbot" element={<Chatbot />}/>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
