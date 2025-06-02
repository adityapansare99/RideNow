import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [captainData, setCaptainData] = useState({});

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehiclePlate, setvehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");

  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicletype: vehicleType,
      },
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/register`,
      captainData
    );

    if (response.status === 200) {
      const data = response.data.data;
      setCaptain(data.user);
      localStorage.setItem("token", data.accesstoken);
      navigate("/captain-home");
    }

    setEmail("");
    setPassword("");
    setFirstname("");
    setLastname("");
    setVehicleColor("");
    setVehicleType("");
    setvehiclePlate("");
    setVehicleCapacity("");
  };
  return (
    <div>
      <div className="p-7 h-screen flex flex-col justify-between">
        <div>
          <h2 className="w-16 mb-8 text-4xl font-medium text-black">Uber</h2>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <h3 className="text-lg font-medium mb-2">
              What's our Captain's name
            </h3>
            <div className="flex gap-4 mb-6">
              <input
                className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg placeholder:text-base"
                type="text"
                required
                placeholder="First name"
                value={firstname}
                onChange={(e) => {
                  setFirstname(e.target.value);
                }}
              />

              <input
                className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg placeholder:text-base"
                type="text"
                placeholder="Last name"
                value={lastname}
                onChange={(e) => {
                  setLastname(e.target.value);
                }}
              />
            </div>

            <h3 className="text-lg font-medium mb-2">
              What's our Captain's email
            </h3>
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

            <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
            <div className="flex gap-4 mb-7">
              <input
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="text"
                placeholder="Vehicle Color"
                value={vehicleColor}
                onChange={(e) => {
                  setVehicleColor(e.target.value);
                }}
              />
              <input
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="text"
                placeholder="Vehicle Plate"
                value={vehiclePlate}
                onChange={(e) => {
                  setvehiclePlate(e.target.value);
                }}
              />
            </div>
            <div className="flex gap-4 mb-7">
              <input
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="number"
                placeholder="Vehicle Capacity"
                value={vehicleCapacity}
                onChange={(e) => {
                  setVehicleCapacity(e.target.value);
                }}
              />
              <div className="w-1/2 px-4">
                <select
                  required
                  className="w-full rounded-xl bg-[#eeeeee] px-1 py-3 border border-gray-300 text-base placeholder:text-sm "
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="" disabled>
                    Select Vehicle Type
                  </option>
                  <option value="car">Car</option>
                  <option value="auto">Auto</option>
                  <option value="moto">Moto</option>
                </select>
              </div>
            </div>

            <button className="bg-[#111] text-white font-semibold mb-3 w-full rounded px-4 py-2 text-lg placeholder:text-base">
              Create Captain Account
            </button>
          </form>
          <p className="text-center mb-10">
            Already have an account?
            <Link to="/captain-login" className="text-blue-600">
              {" "}
              Login here
            </Link>
          </p>
        </div>

        <div>
          <p className="text-[10px] leading-tight mb-4">
            This site is protected by reCAPTCHA and the{" "}
            <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
