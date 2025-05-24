import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captainData, setCaptainData] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();
    setCaptainData({
      email: email,
      password: password,
    });

    console.log(captainData);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <h2 className="w-16 mb-8 text-4xl font-medium text-black">Uber</h2>
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 w-full rounded px-4 py-2 text-lg placeholder:text-base"
            required
            type="email"
            placeholder="email@example.com"
          />
          <h3 className="text-lg font-medium mb-2">Enter password</h3>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-7  w-full rounded px-4 py-2 text-lg placeholder:text-base"
            required
            type="password"
            placeholder="password"
          />
          <button className="bg-[#111] text-white font-semibold mb-3 w-full rounded px-4 py-2 text-lg placeholder:text-base">
            Login
          </button>
        </form>
        <p className="text-center">
          Join a fleet? 
          <Link to="/captain-signup" className="text-blue-600"> Register as a Captain
          </Link>
        </p>
      </div>

      <div>
        <Link
          to="/login"
          className="flex item-center justify-center bg-[#d5622d] text-white font-semibold mb-5 w-full rounded px-4 py-2 text-lg placeholder:text-base"
        >Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
