import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../utilities/animationVarients";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import team1 from "/images/Sneha.jpg";
import team2 from "/images/Shreya.jpg";
import team3 from "/images/Chaitrali.jpg";
import team4 from "/images/Anushree.jpg";

const teamMembers = [
  {
    name: "Sneha Kedar",
    role: "Web Developer",
    image: team1,
    linkedin: "#",
    github: "#",
    instagram: "#",
  },
  {
    name: "Shreya Joshi",
    role: "UI/UX Designer",
    image: team2,
    linkedin: "#",
    github: "#",
    instagram: "#",
  },
  {
    name: "Chaitrali Jedhe",
    role: "Project Manager",
    image: team3,
    linkedin: "#",
    github: "#",
    instagram: "#",
  },
  {
    name: "Anushree Khot",
    role: "Backend Developer",
    image: team4,
    linkedin: "#",
    github: "#",
    instagram: "#",
  },
];

const OurTeam = () => {
  return (
    <div id="team" className="bg-[#f7f8fc] py-12">
      <div className="container mx-auto py-20">
        <motion.div
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold font-secondary mb-3">
            Meet Our Team
          </h2>
          <p className="text-lg md:w-2/3 mb-12 mx-auto">
            A team of dedicated professionals working together to bring mental
            wellness to everyone.
          </p>
        </motion.div>
        <motion.div
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.7 }}
          className="flex flex-col md:w-4/5 mx-auto md:flex-row md:gap-12 gap-8"
        >
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg p-8 flex-1 text-center group shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative mx-auto w-40 h-40 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full rounded-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="text-white size-7 hover:text-blue-500" />
                  </a>
                  <a href={member.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub className="text-white size-7 hover:text-gray-500" />
                  </a>
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="text-white size-7 hover:text-pink-500" />
                  </a>
                </div>
              </div>
              <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default OurTeam;
