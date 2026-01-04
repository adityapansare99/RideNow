import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/userContext";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [mobile, setmobile] = useState("");
  const [otp, setotp] = useState("");
  const [otpField, setOtpField] = useState(false);
  const [userOtp, setUserOtp] = useState("");

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    if (otp.toString() !== userOtp.toString()) {
      alert("Invalid otp");
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const newUser = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      mobile: mobile
    };

    const resopnse = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/register`,
      newUser
    );

    if (resopnse.status === 200) {
      const data = resopnse.data.data;
      setUser(data.user);
      localStorage.setItem("token", data.accesstoken);
      navigate("/home");
    }

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  const otpHandler = async () => {
    if (mobile.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/otp`,
        { mobile }
      );

      if (response.status === 200) {
        alert("otp sent successfully");
        setotp(response.data.data);
        setOtpField(true);
        console.log("generated otp:", response.data.data);
        return;
      }
    } catch (error) {
      console.log("otp error:", error);
      alert("failed to send otp. Try again");
      return;
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-b from-gray-50 to-white flex-col">
      <div className="relative h-15 sm:h-20 md:h-20 mb-4 bg-cover bg-center">
        <div className="relative z-10 pt-6 px-4 sm:pt-8 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            RideNow
          </h1>
          <p className="text-gray-900 text-xs sm:text-sm mt-1 font-light">
            Your ride, your way
          </p>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="space-y-3 mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-light">
              Join us and start your journey
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="flex gap-3">
                <input
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-1/2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  type="text"
                  required
                  placeholder="First name"
                />
                <input
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-1/2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  type="text"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                type="email"
                required
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                type="password"
                required
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex gap-2">
                <input
                  value={mobile}
                  onChange={(e) => setmobile(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  type="number"
                  required
                  placeholder="9xxxxxxxx"
                />
                <button
                  type="button"
                  onClick={otpHandler}
                  className="px-4 py-3 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg transition-all duration-200 text-sm whitespace-nowrap"
                >
                  Send OTP
                </button>
              </div>
            </div>

            {otpField && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  value={userOtp}
                  onChange={(e) => setUserOtp(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  type="number"
                  required
                  placeholder="Enter OTP"
                />
              </div>
            )}

            <button
              type="submit"
              className="group w-full flex items-center justify-center bg-black hover:bg-gray-900 text-white font-semibold py-3.5 sm:py-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 mt-6"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                Create Account
              </span>
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs sm:text-sm font-light mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black font-semibold hover:underline transition-all"
            >
              Sign in
            </Link>
          </p>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              to="/captain-signup"
              className="group w-full flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                Sign up as Captain
              </span>
            </Link>
          </div>

          <p className="text-[10px] leading-tight mt-6 text-gray-400">
            This site is protected by reCAPTCHA and the{" "}
            <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
