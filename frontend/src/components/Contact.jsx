import React, { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { RiPsychotherapyLine } from "react-icons/ri";
import { PiCaretCircleDoubleUpBold } from "react-icons/pi";
import { FaClinicMedical } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeIn } from "../utilities/animationVarients";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCountry("");
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, email, phone, country, message };
    if (!data) {
      alert("Please fill out all fields");
      return;
    }
    setShowModal(true);
    resetForm();
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div id="contact" className="bg-heroBg flex items-center justify-center py-28 px-8">
      <div className="container mx-auto">
        <div className="md:w-4/5 mx-auto grid grid-cols-1 md:grid-cols-2 items-center md:gap-12 gap-8">
          {/* left side */}
          <motion.div
            variants={fadeIn('right', 0.2)}
            initial="hidden"
            whileInView={'show'}
            viewport={{once: false, amount: 0.7}}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold font-secondary mb-4 text-white">
              Report an Issue
            </h2>
            <p className="text-white">
              If you are facing any issues with the SoulSpace app or website, please use the form to report your complaint. We value your feedback and will work to resolve any problems as soon as possible.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center rounded-full bg-[#ffffff1a] p-3">
                  <FaUserAlt className="text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">User Experience Issues</h3>
                  <p>
                    Facing difficulties in navigation or accessibility? Let us know.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center rounded-full bg-[#ffffff1a] p-3">
                  <RiPsychotherapyLine className="text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">AI Chatbot Issues</h3>
                  <p>
                    If the chatbot responses are inaccurate or unhelpful, report it here.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center rounded-full bg-[#ffffff1a] p-3">
                  <PiCaretCircleDoubleUpBold className="text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Technical Problems</h3>
                  <p>
                    Facing crashes, slow performance, or other bugs? We are here to help.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center rounded-full bg-[#ffffff1a] p-3">
                  <FaClinicMedical className="text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Content Concerns</h3>
                  <p>
                    Found any inaccurate information? Help us improve SoulSpace.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          {/* right side */}
          <motion.div
            variants={fadeIn('left', 0.2)}
            initial="hidden"
            whileInView={'show'}
            viewport={{once: false, amount: 0.7}}
            className="space-y-8 bg-white shadow-xl rounded-md p-5"
          >
            <h3 className="text-2xl font-bold mb-4">Submit Your Complaint</h3>
            <form onSubmit={handleSubmit} className="space-y-8" action="https://api.web3forms.com/submit">
            <input type="hidden" name="access_key" value="827bf10f-cbcd-4786-aa51-cbf35db354d1 " />
              <div className="flex sm:flex-row flex-col gap-4">
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  value={name}
                  placeholder="Name"
                  className="w-full p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary shadow"
                />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary shadow"
                />
              </div>
              <div className="flex sm:flex-row flex-col gap-4">
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  type="number"
                  placeholder="Contact Number"
                  className="w-full p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary shadow"
                />
                <input
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                  type="text"
                  placeholder="Country"
                  className="w-full p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary shadow"
                />
              </div>
              <textarea
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                className="w-full p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary shadow"
                rows="5"
                placeholder="Describe the issue you are facing..."
              ></textarea>
              <button
                type="submit"
                className="w-full p-3 bg-primary text-white rounded-md hover:bg-primary/80"
              >
                Submit Complaint
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
