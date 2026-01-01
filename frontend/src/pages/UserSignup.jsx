import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/userContext";
import Home from "./Home.jsx";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [userData, setUserData] = useState({});
  const [mobile, setmobile] = useState("");
  const [otp, setotp] = useState("");
  const [otpField, setOtpField] = useState(false);
  const [userOtp, setUserOtp] = useState("");

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    if(otp.toString() !== userOtp.toString()){
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

      if(response.status===200){
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
    <div>
      <div className="p-7 h-screen flex flex-col justify-between">
        <div>
          <h2 className="w-16 mb-8 text-4xl font-medium text-black">RideNow</h2>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <h3 className="text-lg font-medium mb-2">What's your name</h3>
            <div className="flex gap-4 mb-6">
              <input
                className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg placeholder:text-base"
                type="text"
                required
                placeholder="First name"
                value={firstname}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />

              <input
                className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg placeholder:text-base"
                type="text"
                placeholder="Last name"
                value={lastname}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>

            <h3 className="text-lg font-medium mb-2">What's your email</h3>
            <input
              className="bg-[#eeeeee] mb-6 w-full rounded px-4 py-2 text-lg placeholder:text-base"
              required
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <h3 className="text-lg font-medium mb-2">Enter password</h3>
            <input
              className="bg-[#eeeeee] mb-6  w-full rounded px-4 py-2 text-lg placeholder:text-base"
              required
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <h3 className="text-lg font-medium mb-2">Enter phone number</h3>
            <input
              className="bg-[#eeeeee]  w-full rounded px-4 py-2 text-lg placeholder:text-base"
              required
              type="number"
              placeholder="9xxxxxxxx"
              value={mobile}
              onChange={(e) => {
                setmobile(e.target.value);
              }}
            />

            <p
              onClick={() => {
                otpHandler();
              }}
              className="px-2 py-2 text-right text-blue-600"
            >
              Send otp
            </p>

            {otpField && (
              <div>
                <h3 className="text-lg font-medium mb-2">Enter otp</h3>
                <input
                  className="bg-[#eeeeee]  w-full mb-8 rounded px-4 py-2 text-lg placeholder:text-base"
                  required
                  type="number"
                  placeholder="xxxxxx"
                  value={userOtp}
                  onChange={(e) => {
                    setUserOtp(e.target.value);
                  }}
                />
              </div>
            )}

            <button className="bg-[#111] text-white font-semibold mb-3 w-full rounded px-4 py-2 text-lg placeholder:text-base">
              Create account
            </button>
          </form>
          <p className="text-center mb-6">
            Already have an account?
            <Link to="/login" className="text-blue-600">
              {" "}
              Login here
            </Link>
          </p>
        </div>

        <div>
          <p className="text-[10px] leading-tight mb-5">
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
