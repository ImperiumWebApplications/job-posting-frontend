import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profileType, setProfileType] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    const validationErrors = {};
    if (!username) {
      validationErrors.username = "Username is required";
    }
    if (!password) {
      validationErrors.password = "Password is required";
    }
    if (!profileType) {
      validationErrors.profileType = "Profile type is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post(`/api/register`, {
        username,
        password,
        profileType,
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      // Handle registration error
      validationErrors.registrationError = error.response.data.message;
      setErrors(validationErrors);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
      if (value) {
        setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
      }
    }
    if (name === "password") {
      setPassword(value);
      if (value) {
        setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
      }
    }
    if (name === "profileType") {
      setProfileType(value);
      setErrors((prevErrors) => ({ ...prevErrors, profileType: "" }));
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {errors.registrationError && (
          <p className="text-red-500 text-xs italic">
            {errors.registrationError}
          </p>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.username ? "border-red-500" : ""
            }`}
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleInputChange}
          />
          {errors.username && (
            <p className="text-red-500 text-xs italic">{errors.username}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
              errors.password ? "border-red-500" : ""
            }`}
            id="password"
            name="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">{errors.password}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Profile Type
          </label>
          <div className="flex items-center">
            <input
              type="radio"
              id="employer"
              name="profileType"
              value="employer"
              checked={profileType === "employer"}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="employer">Employer</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="jobSeeker"
              name="profileType"
              value="jobSeeker"
              checked={profileType === "jobSeeker"}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="jobSeeker">Job Seeker</label>
          </div>
          {errors.profileType && (
            <p className="text-red-500 text-xs italic">{errors.profileType}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
