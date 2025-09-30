import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import bgImage from "../assets/bg-1.png";



const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default function SignUp() {
  const [form, setForm] = useState({ email: "", name: "", dob: "" });
  const [otp, setOTP] = useState("");
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });


  const sendOTP = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/api/auth/send-otp", { email: form.email, name: form.name });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
    }
    setLoading(false);
  };

  const verifyOTP = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/api/auth/verify-otp", { email: form.email, name:form.name, otp});
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 font-sans relative">

      
      <div className="flex  md:flex-row items-center justify-center md:absolute md:top-4 md:left-4 gap-2 md:gap-4 mb-2 md:mb-0">
        <SunIcon />
        <span className="text-2xl sm:text-3xl md:text-2xl lg:text-3xl font-bold">HD</span>
      </div>

   
      <div className="flex flex-col p-4 sm:p-6 md:p-10 lg:p-14 w-full sm:w-[90%] md:w-[60%] lg:w-[55%] xl:w-[50%] items-center md:items-start">
        <h1 className="mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-left">
          Sign Up
        </h1>
        <p className="font-semibold text-gray-500 mb-6 sm:mb-8 md:mb-8 text-sm sm:text-base md:text-lg lg:text-xl text-center md:text-left">
          Sign up to enjoy the features of HD
        </p>

        <form className="flex flex-col space-y-4 w-full sm:w-[95%] md:w-[60%] lg:w-[70%] xl:w-[60%]">

          <label htmlFor="name" className="text-sm sm:text-base md:text-base lg:text-lg font-medium text-gray-700">
            Your Name
          </label>
          <input
            name="name"
            onChange={handleChange}
            type="text"
            id="name"
            placeholder="Jonas Kharwald"
            className="w-full p-2 sm:p-3 md:p-3 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-sm sm:text-base md:text-base lg:text-lg"
          />
          <label htmlFor="dob" className="text-sm sm:text-base md:text-base lg:text-lg font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            onChange={handleChange} 
            className="w-full p-2 sm:p-3 md:p-3 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-sm sm:text-base md:text-base lg:text-lg"
          />

          <label htmlFor="email" className="text-sm sm:text-base md:text-base lg:text-lg font-medium text-gray-700">
            Email
          </label>
          <input
            name="email"
            onChange={handleChange}
            type="email"
            id="email"
            placeholder="jonas_kahnwald@gmail.com"
            className="w-full p-2 sm:p-3 md:p-3 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-sm sm:text-base md:text-base lg:text-lg"
          />

          {step === 1 && (
            <button
              onClick={sendOTP}
              className="w-full bg-blue-600 text-white p-2 sm:p-3 md:p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 text-sm sm:text-base md:text-base lg:text-lg"
              disabled={loading}
            >
              {loading ? "Sending..." : "Get OTP"}
            </button>
          )}

          {step === 2 && (
            <>
              <label htmlFor="otp" className="text-sm sm:text-base md:text-base lg:text-lg font-medium text-gray-700">
                OTP
              </label>
              <input
                value={otp}
                onChange={e => setOTP(e.target.value)}
                type="text"
                id="otp"
                placeholder="123456"
                className="w-full p-2 sm:p-3 md:p-3 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-sm sm:text-base md:text-base lg:text-lg"
              />
              <button
                onClick={verifyOTP}
                className="w-full bg-green-500 text-white p-2 sm:p-3 md:p-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300 text-sm sm:text-base md:text-base lg:text-lg mt-2 sm:mt-3"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {error && (
            <p className="text-red-500 mt-2 text-xs sm:text-sm md:text-base lg:text-base">
              {error}
            </p>
          )}

          <div className="mt-4 sm:mt-6 text-center text-gray-500 text-xs sm:text-sm md:text-base lg:text-base">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/signin")}
              className="underline text-blue-600 font-semibold cursor-pointer"
            >
              Sign In
            </span>
          </div>
        </form>
      </div>
      <div className="hidden md:flex w-full md:w-[40%] lg:w-[45%] xl:w-[50%] justify-center">
        <img
          src={bgImage}
          alt="Abstract decorative wave pattern"
          className="h-[50vh] sm:h-[60vh] md:h-[80vh] lg:h-[90vh] xl:h-[100vh] p-2 sm:p-4 rounded-3xl object-cover"
        />
      </div>
    </div>
  );
}
