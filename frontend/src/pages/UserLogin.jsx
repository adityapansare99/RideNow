import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});

  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password,
    };

    const resopnse = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/login`,
      userData
    );

    if (resopnse.status === 200) {
      const data = resopnse.data.data;
      setUser(data.user);
      localStorage.setItem("token", data.accesstoken);
      navigate("/home");
    }

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
          New here?
          <Link to="/signup" className="text-blue-600">
            {" "}
            Create new Account
          </Link>
        </p>
      </div>

      <div>
        <Link
          to="/captain-login"
          className="flex item-center justify-center bg-[#10b461] text-white font-semibold mb-5 w-full rounded px-4 py-2 text-lg placeholder:text-base"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
