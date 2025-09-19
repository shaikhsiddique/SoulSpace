import React from "react";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { fadeIn } from "../utilities/animationVarients";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const About = () => {
  return (
    <div id="about" className="bg-[#f7f8fc] pb-18 pt-20">
      <div className="container mx-auto ">
        <div className="py-12 px-4 md:w-4/5 mx-auto flex flex-col md:flex-row items-center gap-8 ">
          {/* left side */}
          <motion.div
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.7 }}
            className="md:w-1/2 w-full mb-8 md:mb-0"
          >
            <div className="relative">
              <img
              src="/images/Chatbot.avif"
                className="w-full md:h-[450px] h-auto rounded-lg object-cover"
                alt="Chatbot Preview"
              />
            </div>
          </motion.div>
          {/* right side */}
          <motion.div
            variants={fadeIn("down", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.7 }}
            className="md:w-1/2 w-full"
          >
            <h2 className="text-3xl font-secondary font-bold mb-4 leading-snug">
              AI-Powered Mental Health Chatbot
            </h2>
            <p className="text-lg mb-12 md:pr-8">
              Need someone to talk to? Our AI chatbot is here to listen, offer
              guidance, and provide mental health support 24/7. Whether you're
              feeling overwhelmed, anxious, or simply need a moment of
              reflection, our chatbot offers a safe and supportive space to help
              you navigate your emotions.
            </p>
            <button className="bg-primary text-white py-3.5 px-8 font-medium rounded-md hover:bg-primary/90">
              <Link to="/chatbot" className="flex gap-1 items-center">
                <span>Try the Chatbot</span>
                <IoArrowForwardCircleSharp />
              </Link>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
