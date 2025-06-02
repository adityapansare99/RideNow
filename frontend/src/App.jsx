import React, { useContext } from "react";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start.jsx";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home.jsx";
import UserProtectedWrapper from "./pages/UserProtectedWrapper.jsx";
import UserLogout from "./pages/UserLogout.jsx";
import CaptainHome from "./pages/CaptainHome.jsx";
import CaptainProtectedWrapper from "./pages/CaptainProtectedWrapper.jsx";
import CaptainLogout from "./pages/CaptainLogout.jsx";
import Riding from "./pages/Riding.jsx";
import CaptainRiding from "./pages/CaptainRiding.jsx";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/riding" element={<Riding />} />
        <Route path="/captain-login" element={<CaptainLogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route
          path="/home"
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/user/logout"
          element={
            <UserProtectedWrapper>
              <UserLogout />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/captain-home"
          element={
            <CaptainProtectedWrapper>
              <CaptainHome />
            </CaptainProtectedWrapper>
          }
        />
        <Route
          path="/captain/logout"
          element={
            <CaptainProtectedWrapper>
              <CaptainLogout />
            </CaptainProtectedWrapper>
          }
        />
        <Route path="/captain-riding" element={<CaptainRiding />} />
      </Routes>
    </div>
  );
};

export default App;
