import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utilities/animationVarients";

export const WorkingStep = () => {
  return (
    <div className="relative bg-cover bg-center py-12 bg-workingImg">
      <div className="absolute inset-0 bg-heroBg bg-opacity-85"></div>
      <div className="relative container mx-auto px-4 py-20">
        <motion.div
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView={'show'}
          viewport={{once: false, amount: 0.7}}
          className="text-white text-center mb-20"
        >
          <h2 className="text-4xl font-bold font-secondary mb-4">
            How It Works
          </h2>
          <p className="text-lg md:w-1/2 w-full mx-auto">
            Your mental wellness journey starts here. Follow these steps to gain clarity, receive guidance, and improve your overall well-being.
          </p>
        </motion.div>
        <div className="flex flex-col md:w-4/5 mx-auto md:flex-row gap-8">
          <motion.div
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            whileInView={'show'}
            viewport={{once: false, amount: 0.7}}
            className="relative bg-white text-center rounded-lg p-6 flex-1"
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white size-14 rounded-full flex items-center justify-center">
              1
            </div>
            <h3 className="text-lg font-bold mt-8">Self-Reflection & Assessment</h3>
            <p className="my-2 text-heroBg">
              Begin by understanding your thoughts and emotions. Take our mental health assessment test or chat with our AI-powered assistant to gain insights into your well-being.
            </p>
          </motion.div>
          <motion.div
            variants={fadeIn('down', 0.2)}
            initial="hidden"
            whileInView={'show'}
            viewport={{once: false, amount: 0.7}}
            className="relative bg-white text-center rounded-lg p-6 flex-1"
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white size-14 rounded-full flex items-center justify-center">
              2
            </div>
            <h3 className="text-lg font-bold mt-8">Personalized Guidance & Resources</h3>
            <p className="my-2 text-heroBg">
              Get tailored recommendations, mindfulness exercises, and guided meditation practices. Our AI chatbot and curated resources help you build emotional resilience.
            </p>
          </motion.div>
          <motion.div
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            whileInView={'show'}
            viewport={{once: false, amount: 0.7}}
            className="relative bg-white text-center rounded-lg p-6 flex-1"
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white size-14 rounded-full flex items-center justify-center">
              3
            </div>
            <h3 className="text-lg font-bold mt-8">Progress & Well-being Tracking</h3>
            <p className="my-2 text-heroBg">
              Track your growth with self-reflection tools and habit-building techniques. Stay motivated with mindfulness exercises and wellness challenges designed for long-term improvement.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
