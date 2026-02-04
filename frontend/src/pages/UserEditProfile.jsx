import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const UserEditProfile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});

  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        setUserData(response.data.data.user);
        console.log("User profile data:", response.data);
      }

      if (!response.data.success) {
        console.log(response.data);
        navigate("/login");
      }
    } catch (error) {
      console.log("Error fetching user profile:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      setFirstname(userData?.fullname?.firstname || "");
      setLastname(userData?.fullname?.lastname || "");
      setImage(userData?.image || "");
    }
  }, [userData]);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const fileInputRef = useRef(null);

  // Handle profile photo change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendOtp = async () => {
    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/Generate-otp`,
        {
          mobile: userData.mobile,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status !== 200) {
        throw new Error(response.data.message);
      }

      if (response.status === 200) {
        setIsOtpSent(true);
        setOtpLoading(false);
        alert(`OTP sent to ${userData.phone}`);
      }
    } catch (error) {
      setOtpLoading(false);
      setOtpError("Failed to send OTP. Please try again.");
      console.error("OTP send error:", error);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/verify-otp`,
        { mobile: userData.mobile, otp: otp },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }

      if (response.status === 200) {
        setIsOtpVerified(true);
        setOtpLoading(false);
        alert("OTP verified successfully!");
      }
    } catch (error) {
      setOtpLoading(false);
      setOtpError("Invalid OTP. Please try again.");
      console.error("OTP verification error:", error);
    }
  };

  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      alert("Please verify OTP first");
      return;
    }

    if (password && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/edit-profile`,
        {
          firstname: firstname,
          lastname: lastname,
          password: password,
          mobile: userData.mobile,
          image: image,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status !== 200) {
        throw new Error(response.data.message);
      }

      if (response.status === 200) {
        alert("Profile updated successfully!");
        navigate("/home");
      }
      
    } catch (error) {
      alert("Failed to update profile");
      console.error("Profile update error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      alert('Please type "DELETE" to confirm');
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/users/delete-user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status !== 200) {
        throw new Error(response.data.message);
      }

      if (response.status === 200) {
        localStorage.removeItem("token");
        alert("Account deleted successfully");
        navigate("/login");
      }
    } catch (error) {
      alert("Failed to delete account");
      console.error("Account deletion error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-b from-gray-50 to-white flex-col">
      {/* Header */}
      <div className="relative h-15 sm:h-20 md:h-20 mb-4 bg-cover bg-center">
        <div className="relative z-10 pt-6 px-4 sm:pt-8 sm:px-6 md:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              RideNow
            </h1>
            <p className="text-gray-900 text-xs sm:text-sm mt-1 font-light">
              Your ride, your way
            </p>
          </div>
          <Link
            to="/home"
            className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm"
          >
            <i className="text-lg font-medium ri-home-5-line"></i>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="space-y-3 mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Edit Profile
            </h2>
            <p className="text-gray-500 text-sm sm:text-base font-light">
              Update your personal information
            </p>
          </div>

          {/* Profile Photo Section */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative">
              <img
                src={photoPreview || image}
                alt="Profile"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-black text-white p-2.5 rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95"
              >
                <i className="ri-camera-line text-lg"></i>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500 mt-3 font-light">
              Click camera icon to change photo
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="flex gap-3">
                <input
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                  value={firstname}
                  className="w-1/2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  type="text"
                  required
                  placeholder="First name"
                />
                <input
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                  value={lastname}
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
                type="email"
                value={userData?.email}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-500 cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={userData?.mobile}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-500 cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password (Optional)
              </label>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                name="password"
                value={password}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Confirm your new password"
              />
            </div>

            <div className="pt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                  Verify Your Identity
                </h3>

                {!isOtpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {otpLoading ? "Sending..." : "Send OTP to Mobile"}
                  </button>
                ) : !isOtpVerified ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="Enter 6-digit OTP"
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      maxLength={6}
                    />
                    {otpError && (
                      <p className="text-red-500 text-sm">{otpError}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {otpLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="w-full text-blue-600 text-sm hover:underline font-medium"
                    >
                      Resend OTP
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-green-600 py-2">
                    <i className="ri-checkbox-circle-fill text-2xl mr-2"></i>
                    <span className="font-semibold">
                      OTP Verified Successfully
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isOtpVerified}
              className="group w-full flex items-center justify-center bg-black hover:bg-gray-900 text-white font-semibold py-3.5 sm:py-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                Update Profile
              </span>
            </button>
          </form>

          <div className="flex items-center space-x-3 pt-8">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-xs font-medium">
              Danger Zone
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="group w-full flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3.5 rounded-lg transition-all duration-200 border border-red-200 active:scale-95"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                Delete Account
              </span>
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-alert-line text-3xl text-red-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Delete Account
              </h3>
              <p className="text-gray-500 text-sm">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold text-red-600">DELETE</span> to
                confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE"}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEditProfile;
