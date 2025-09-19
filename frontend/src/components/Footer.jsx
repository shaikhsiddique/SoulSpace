import React from "react";
// import footerLogo from "../assets/footer-logo.svg";
import { FaDribbble, FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="py-12 bg-gray-100 px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-8">
        {/* cols-1 */}
        <div className="space-y-6 mr-14">
          <div className="flex items-center space-x-2">
            {/* <img
              src={footerLogo}
              className="w-32 h-auto"
              alt="logo of footer"
            /> */}
            <h2 className="font-medium text-3xl flex flex-col md:flex-row lg: space-x-8 sm:space-x-4 space-y-2 md:space-y-0 p-4 md:p-0">SoulSpace</h2>
          </div>
          <p className="text-para">
            SoulSpace - Your mental well-being companion. Find peace, clarity, and guidance on your journey to a healthier mind.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="bg-gray-200 text-primary rounded-full size-10 flex items-center justify-center hover:bg-primary hover:text-white"
            >
              <FaFacebook className="text-xl" />
            </a>
            <a
              href="#"
              className="bg-gray-200 text-primary rounded-full size-10 flex items-center justify-center hover:bg-primary hover:text-white"
            >
              <FaTwitter className="text-xl" />
            </a>
            <a
              href="#"
              className="bg-gray-200 text-primary rounded-full size-10 flex items-center justify-center hover:bg-primary hover:text-white"
            >
              <FaInstagram className="text-xl" />
            </a>
            <a
              href="#"
              className="bg-gray-200 text-primary rounded-full size-10 flex items-center justify-center hover:bg-primary hover:text-white"
            >
              <FaDribbble className="text-xl" />
            </a>
          </div>
        </div>
        {/* cols-2 */}
        <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
        <ul className="space-y-3">
            <li>
                <a href="#home" className="hover:underline text-gray-700">Home</a>
            </li>
            <li>
                <a href="#about" className="hover:underline text-gray-700">About Us</a>
            </li>
            <li>
                <a href="#services" className="hover:underline text-gray-700">Services</a>
            </li>
            <li>
                <a href="#contact" className="hover:underline text-gray-700">Contact Us</a>
            </li>
        </ul>
        </div>
        {/* cols-3 */}
        <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4">Support</h3>
        <ul className="space-y-3">
            <li>
                <a href="#" className="hover:underline text-gray-700">FAQ</a>
            </li>
            <li>
                <a href="#" className="hover:underline text-gray-700">Terms of Services</a>
            </li>
            <li>
                <a href="#" className="hover:underline text-gray-700">Privacy Policy</a>
            </li>
            <li>
                <a href="#contact" className="hover:underline text-gray-700">Support Center</a>
            </li>
        </ul>
        </div>
        {/* cols-4 */}
        <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
        <ul className="space-y-3">
            <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" />
                <p className ="text-gray-700">SoulSpace, Pune, Maharashtra, India</p>
            </li>
            <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-primary" />
                <p className ="text-gray-700">+123 456 7890</p>
            </li>
            <li className="flex items-center gap-2">
                <FaEnvelope className="text-primary" />
                <p className ="text-gray-700">getsoulspacehelp@gmail.com</p>
            </li>
        </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
