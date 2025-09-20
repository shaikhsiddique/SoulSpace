import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios.js';
import { UserContext } from '../context/UserContext.jsx';
import gsap from 'gsap';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(UserContext);
  const messageRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('/user/signup', formData)
      .then((res) => {
        console.log(res);
        setUser(res.data.user);
        localStorage.setItem('Auth-Token', res.data.token);
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        messageRef.current.textContent =
          err.response?.data?.details || err.response?.data?.error || 'Signup failed';
        gsap.to(messageRef.current, { opacity: 1, duration: 0.2 });
      });

    setFormData({ username: '', email: '', phone: '', password: '' });
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black h-screen w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-700 shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col items-center"
      >
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h1>
        <h2
          ref={messageRef}
          className="text-center text-red-500 mb-4 font-semibold text-sm opacity-0"
        ></h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="p-3 rounded-lg bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none w-full"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-3 rounded-lg bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none w-full"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="p-3 rounded-lg bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none w-full"
          required
        />

        <div className="relative w-full">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 pr-10 rounded-lg bg-gray-800 text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none w-full"
            required
          />
          <i
            className={`${showPassword ? 'ri-eye-off-fill' : 'ri-eye-fill'} absolute text-xl right-3 top-[40%] transform -translate-y-1/2 text-gray-400 cursor-pointer`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition w-full"
        >
          Sign Up
        </button>

        <Link
          to="/login"
          className="text-sm text-gray-300 mt-4 hover:text-blue-400 transition text-center"
        >
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}

export default SignUp;
