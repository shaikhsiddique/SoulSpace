import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utilities/animationVarients";

const packages = [
  {
    name: "Bronze Package",
    price: "$99",
    description:
      "Ideal for individuals beginning their mental wellness journey with essential resources.",
    features: [
      "Access to guided meditation exercises",
      "Weekly wellness tips and insights",
      "Community support group access",
    ],
    futureScope: "Upcoming AI-driven personalized recommendations."
  },
  {
    name: "Silver Package",
    price: "$199",
    description:
      "Perfect for individuals seeking structured guidance with interactive support.",
    features: [
      "All Bronze Package features",
      "Monthly guided meditation & breathing sessions",
      "Personalized wellness roadmap",
      "Access to expert-led mental health workshops",
    ],
    futureScope: "Integration with wearable health trackers."
  },
  {
    name: "Gold Package",
    price: "$299",
    description:
      "For those looking for comprehensive mental wellness support with premium access.",
    features: [
      "All Silver Package features",
      "Weekly one-on-one counseling sessions",
      "Advanced mental wellness analytics",
      "24/7 expert support & emergency consultations",
    ],
    futureScope: "Exploring VR therapy for immersive relaxation sessions."
  },
];

const Pricing = () => {
  const handleScrollToContact = () => {
    const targetElement = document.getElementById("contact");
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      });
    }
  };
  return (
    <div id="pricing" className="bg-[#f7f8fc] pt-32">
      <div className="container mx-auto px-8">
        <motion.div
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView={'show'}
          viewport={{ once: false, amount: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold font-secondary mb-3">
            Our Pricing Options
          </h2>
          <p className="text-lg md:w-2/3 mb-12 mx-auto">
            Choose a plan that aligns with your mental wellness goals and enjoy expert guidance.
          </p>
        </motion.div>
        <div className="flex flex-col md:w-5/6 mx-auto md:flex-row gap-8 pb-12">
          {packages.map((pkg, index) => (
            <motion.div
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              whileInView={'show'}
              viewport={{ once: false, amount: 0.7 }}
              key={index}
              className="bg-white rounded-lg p-6 flex-1 shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-4">{pkg.name}</h3>
              <hr className="w-24 border text-primary border-primary" />
              <p className="text-3xl font-bold mb-4">
                {pkg.price}
                <span className="text-lg font-normal">/one-time</span>
              </p>
              <p className="text-lg mb-8">{pkg.description}</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 italic mb-4">{pkg.futureScope}</p>
              <button
                onClick={handleScrollToContact}
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
