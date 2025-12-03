import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import axios from '../config/axios';
import PropTypes from 'prop-types';

function OtpInput({ onOtpSubmit }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [storedOtp, setStoredOtp] = useState('');
  const [userId, setUserId] = useState('');
  const messageRef = useRef(null);

  useEffect(() => {
    if (isOtpSent && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTime) => (prevTime <= 1 ? 0 : prevTime - 1));
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [isOtpSent, timer]);

  const sendOtp = async () => {
    try {
      const response = await axios.post('/user/send-otp', { email });

      setStoredOtp(response.data.otp);
      setUserId(response.data.userId);
      localStorage.setItem('resetUserId', response.data.userId);

      setIsOtpSent(true);
      setTimer(300);
      setMessage('OTP sent to your email!');
      gsap.to(messageRef.current, { opacity: 1, duration: 0.5 });
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred.');
      gsap.to(messageRef.current, { opacity: 1, duration: 0.5 });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp === storedOtp) {
      setMessage('OTP verified successfully!');
      gsap.to(messageRef.current, { opacity: 1, duration: 0.5 });
      onOtpSubmit();
    } else {
      setMessage('Invalid OTP, please try again.');
      gsap.to(messageRef.current, { opacity: 1, duration: 0.5 });
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black h-screen w-full flex items-center justify-center">
      <div className="bg-gray-700 shadow-lg rounded-lg p-8 w-96 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-white mb-6">Forgot Password</h1>

        {!isOtpSent ? (
          <div className="w-full space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-lg bg-gray-800 text-white focus:ring-2 outline-none w-full"
            />

            <button
              onClick={sendOtp}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <h2
              ref={messageRef}
              className="text-center text-green-500 mb-3 font-semibold text-sm opacity-0"
            >
              {message}
            </h2>

            {timer > 0 && (
              <div className="text-sm text-gray-300 mb-3 text-center">
                You can request a new OTP in {Math.floor(timer / 60)}:
                {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="p-3 rounded-lg bg-gray-800 text-white focus:ring-2 outline-none"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
              >
                Verify OTP
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

OtpInput.propTypes = {
  onOtpSubmit: PropTypes.func.isRequired,
};

export default OtpInput;
