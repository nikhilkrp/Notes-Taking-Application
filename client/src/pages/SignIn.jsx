import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import bgImage from '../assets/bg-1.png'

export default function SignIn() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const sendOTP = async () => {
    setLoading(true);
    setError("");
    try {
      await API.post("/api/auth/send-otp", { name, email });

      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/api/auth/verify-otp", { name, email, otp });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id:import.meta.env.VITE_API_KEY,
        callback: handleGoogleResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await API.post("/auth/google", { token: response.credential });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login failed:", err);
      setError("Google login failed. Try again.");
    }
  };


  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 font-sans relative">

   
      <div className="flex flex-col md:flex-row items-center justify-center md:absolute md:top-4 md:left-4 gap-2 md:gap-4 mb-6 md:mb-0">
        <SunIcon />
        <span className="text-2xl sm:text-3xl md:text-2xl lg:text-3xl font-bold">HD</span>
      </div>

  
      <div className="flex flex-col p-4 sm:p-6 md:p-10 lg:p-14 w-full sm:w-[90%] md:w-[60%] lg:w-[55%] xl:w-[50%] items-center md:items-start">
        <h1 className="mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-left">
          Sign In
        </h1>
        <p className="font-semibold text-gray-500 mb-6 sm:mb-8 md:mb-8 text-sm sm:text-base md:text-lg lg:text-xl text-center md:text-left">
          Please login to continue to your account.
        </p>

     
        {error && <p className="text-red-500 mb-2 text-xs sm:text-sm md:text-base lg:text-base">{error}</p>}

        <form className="flex flex-col space-y-4 w-full sm:w-[95%] md:w-[60%] lg:w-[70%] xl:w-[60%]">

     
          {step === 1 && (
            <>
              <div>
                <label htmlFor="name" className="text-sm sm:text-base md:text-base lg:text-lg font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jonas Kharwald"
                  className="w-full p-2 sm:p-3 md:p-3 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-sm sm:text-base md:text-base lg:text-lg"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm sm:text-base md:text-base lg:text-lg font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jonas_kahnwald@gmail.com"
                  className="w-full p-2 sm:p-3 md:p-3 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-sm sm:text-base md:text-base lg:text-lg"
                />
              </div>
              <button
                type="button"
                onClick={sendOTP}
                className="w-full bg-blue-600 text-white p-2 sm:p-3 md:p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 text-sm sm:text-base md:text-base lg:text-lg"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm mb-2">Or continue with</p>
                <div id="googleBtn" className="flex justify-center"></div>
              </div>
            </>
          )}

         
          {step === 2 && (
            <div>
              <label htmlFor="otp" className="text-sm sm:text-base md:text-base lg:text-lg font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                placeholder="Enter your OTP"
                className="w-full p-2 sm:p-3 md:p-3 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-sm sm:text-base md:text-base lg:text-lg"
              />
              <button
                type="button"
                onClick={verifyOTP}
                className="w-full bg-green-500 text-white p-2 sm:p-3 md:p-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300 text-sm sm:text-base md:text-base lg:text-lg mt-2 sm:mt-3"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

     
          <div
            onClick={() => navigate("/signup")}
            className="mt-4 sm:mt-6 text-center text-gray-500 text-xs sm:text-sm md:text-base lg:text-base font-semibold cursor-pointer"
          >
            Need an account?{" "}
            <span className="text-blue-700 underline font-semibold">Create One</span>
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