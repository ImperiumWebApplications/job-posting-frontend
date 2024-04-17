import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [profileType, setProfileType] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const response = await axios.get("/api/check-registration", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setIsRegistered(response.data.isRegistered);
      } catch (error) {
        console.error("Error fetching registration status:", error);
      }
    };

    fetchRegistrationStatus();
  }, []);

  const handleProfileSelection = (type) => {
    setProfileType(type);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post(`/api/profile/${profileType}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(response.data.message);
      setIsRegistered(true); // Update registration status
    } catch (error) {
      console.error("Error submitting profile:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to My App</h1>
      {!isRegistered && (
        <div className="mb-4">
          <button
            onClick={() => handleProfileSelection("employer")}
            className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Employer Profile
          </button>
          <button
            onClick={() => handleProfileSelection("jobSeeker")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Job Seeker Profile
          </button>
        </div>
      )}
      {profileType === "employer" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="p-2 border rounded w-full"
            name="companyName"
            placeholder="Company Name"
            required
          />
          <textarea
            className="p-2 border rounded w-full"
            name="address"
            placeholder="Address"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      )}
      {profileType === "jobSeeker" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="p-2 border rounded w-full"
            name="firstName"
            placeholder="First Name"
            required
          />
          <input
            className="p-2 border rounded w-full"
            name="lastName"
            placeholder="Last Name"
            required
          />
          <input
            className="p-2 border rounded w-full"
            name="skills"
            placeholder="Skills (comma separated)"
            required
          />
          <textarea
            className="p-2 border rounded w-full"
            name="workExperience"
            placeholder="Work Experience"
          />
          <input
            type="file"
            name="resume"
            className="file:border file:border-gray-300 file:rounded file:p-2 w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default Home;
