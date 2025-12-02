import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import serviceImg1 from "../assets/service1.webp";
import serviceImg2 from "../assets/service2.webp";
import serviceImg3 from "../assets/service3.webp";
import serviceImg4 from "../assets/service4.webp";
import { motion } from "framer-motion";
import { fadeIn } from "../utilities/animationVarients";
import { Link } from "react-router-dom";


const Services = () => {
  return (
    <div id="services" className="bg-[#f7f8fc]">
      <div className="pt-28 px-4 container mx-auto">
        <motion.div
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.7 }}
          className="text-center space-y-5"
        >
          <h2 className="text-4xl font-bold font-secondary text-heroBg">
            How We Can Support You
          </h2>
          <p className="md:w-1/2 mx-auto">
            Explore our personalized services designed to enhance your mental well-being and overall peace of mind.
          </p>
        </motion.div>
        
        <div className="py-12 md:w-4/5 mx-auto">
          <Tabs>
            <motion.TabList
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="flex flex-wrap justify-between items-center md:gap-8 gap-4"
            >
              <Tab className=" cursor-pointer hover:underline underline-offset-2">Mental Health Assessment</Tab>
              <Tab className=" cursor-pointer hover:underline underline-offset-2">Podcast & Book Recommendations</Tab>
              <Tab className=" cursor-pointer hover:underline underline-offset-2">Meditation & Yoga Guidance</Tab>
              <Tab className=" cursor-pointer hover:underline underline-offset-2">Expressive Journaling</Tab>
            </motion.TabList>

            <TabPanel>
              <div className="flex flex-col md:flex-row gap-8 mt-8">
                <motion.div
                  variants={fadeIn("right", 0.2)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.7 }}
                  className="md:w-1/2 bg-white rounded-lg p-12 font-secondary"
                >
                  <h2 className="text-3xl font-semibold text-primary mb-4">
                    Mental Health Assessment
                  </h2>
                  <p className="mb-8">
                    Our quick mental health assessment helps you gain insights into your emotional well-being. Answer a few simple questions to receive a personalized report that can guide you toward the right support and resources.
                  </p>
                  <Link className=" hover:underline text-primary text-sm hover:scale-125" to={'/assesment'}>
                  Start Now
                  </Link>
                </motion.div>
                <motion.div
                  variants={fadeIn("left", 0.2)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.7 }}
                  className="md:w-1/2"
                >
                  <img
                    src={serviceImg1}
                    alt="service img"
                    className="w-full h-[450px] rounded-2xl object-cover"
                  />
                </motion.div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="flex flex-col md:flex-row gap-8 mt-8">
                <motion.div
                  variants={fadeIn("right", 0.2)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.7 }}
                  className="md:w-1/2 bg-white rounded-lg p-12 font-secondary"
                >
                  <h2 className="text-3xl font-semibold text-primary mb-4">
                    Podcast & Book Recommendations
                  </h2>
                  <p className="mb-8">
                    Discover handpicked podcasts and books focused on mental health, personal growth, and mindfulness. These resources can provide guidance, comfort, and inspiration tailored to your needs.
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeIn("left", 0.2)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.7 }}
                 className="md:w-1/2">
                  <img
                    src={serviceImg2}
                    alt="service img"
                    className="w-full h-[450px] rounded-2xl object-cover"
                  />
                </motion.div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="flex flex-col md:flex-row gap-8 mt-8">
                <motion.div
                  variants={fadeIn("right", 0.2)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.7 }}
                className="md:w-1/2 bg-white rounded-lg p-12 font-secondary">
                  <h2 className="text-3xl font-semibold text-primary mb-4">
                    Meditation & Yoga Guidance
                  </h2>
                  <p className="mb-8">
                    Learn simple meditation techniques and yoga poses designed to promote relaxation, reduce stress, and improve overall mental clarity. Incorporate these practices into your routine for a balanced mind and body.
                  </p>
                </motion.div>
                <motion.div
                  variants={fadeIn("left", 0.2)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.7 }}
                className="md:w-1/2">
                  <img
                    src={serviceImg3}
                    alt="service img"
                    className="w-full h-[450px] rounded-2xl object-cover"
                  />
                </motion.div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="flex flex-col md:flex-row gap-8 mt-8">
                <motion.div
                  variants={fadeIn("right", 0.2)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.7 }}
                 className="md:w-1/2 bg-white rounded-lg p-12 font-secondary">
                  <h2 className="text-3xl font-semibold text-primary mb-4">
                    Expressive Journaling
                  </h2>
                  <p className="mb-8">
                    Sometimes, writing down your thoughts can be the best therapy. Our journaling space lets you express your feelings freely without saving them, allowing you to release stress and gain clarity.
                  </p>
                  <Link className=" hover:underline text-primary text-sm hover:scale-125" to={'/journel'}>
                  Start Now
                  </Link>
                </motion.div>
                <motion.div
                  variants={fadeIn("left", 0.2)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.7 }}
                className="md:w-1/2">
                  <img
                    src={serviceImg4}
                    alt="service img"
                    className="w-full h-[450px] rounded-2xl object-cover"
                  />
                </motion.div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Services;
