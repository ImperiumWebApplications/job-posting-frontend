import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

const Home = () => {
  const [profileType, setProfileType] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5002/api/user-details",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsRegistered(response.data.isRegistered);
        if (response.data.isRegistered) {
          setUserDetails(response.data.userDetails);
          setProfileType(response.data.userDetails.profileType);
        }
      } catch (error) {
        console.error("Error fetching registration status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrationStatus();
  }, []);

  const handleProfileSelection = (type) => {
    setProfileType(type);
  };

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const response = await axios.post(
        `http://localhost:5002/api/profile/${profileType}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": undefined,
          },
        }
      );
      console.log(response.data.message);
      setIsRegistered(true);

      const userDetailsResponse = await axios.get(
        "http://localhost:5002/api/user-details",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUserDetails(userDetailsResponse.data.userDetails);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error submitting profile or fetching details:", error);
    }
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      await axios.post("http://localhost:5002/api/update-user", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": undefined,
        },
      });

      const userDetailsResponse = await axios.get(
        "http://localhost:5002/api/user-details",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUserDetails(userDetailsResponse.data.userDetails);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to My App</h1>
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
        {profileType && renderForm(profileType, handleSubmit)}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Profile Details</h1>
      {userDetails && (
        <>
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold mr-2">
              {userDetails.username || "N/A"}
            </h2>
            {profileType && (
              <button onClick={handleEditProfile}>
                <FaEdit className="text-blue-500 hover:text-blue-700" />
              </button>
            )}
          </div>
          {isEditMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {profileType === "employer" && (
                <>
                  <input
                    className="p-2 border rounded w-full"
                    name="companyName"
                    placeholder="Company Name"
                    defaultValue={userDetails.companyName}
                    required
                  />
                  <textarea
                    className="p-2 border rounded w-full"
                    name="address"
                    placeholder="Address"
                    defaultValue={userDetails.address}
                    required
                  />
                </>
              )}
              {profileType === "jobSeeker" && (
                <>
                  <input
                    className="p-2 border rounded w-full"
                    name="firstName"
                    placeholder="First Name"
                    defaultValue={userDetails.firstName}
                    required
                  />
                  <input
                    className="p-2 border rounded w-full"
                    name="lastName"
                    placeholder="Last Name"
                    defaultValue={userDetails.lastName}
                    required
                  />
                  <input
                    className="p-2 border rounded w-full"
                    name="skills"
                    placeholder="Skills (comma separated)"
                    defaultValue={userDetails.skills}
                    required
                  />
                  <textarea
                    className="p-2 border rounded w-full"
                    name="workExperience"
                    placeholder="Work Experience"
                    defaultValue={userDetails.workExperience}
                  />
                  <input
                    type="file"
                    name="resume"
                    className="file:border file:border-gray-300 file:rounded file:p-2 w-full"
                  />
                </>
              )}
              <div>
                <button
                  type="submit"
                  className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {userDetails.companyName && (
                <div>
                  <p>
                    <strong>Company Name:</strong> {userDetails.companyName}
                  </p>
                  <p>
                    <strong>Address:</strong> {userDetails.address}
                  </p>
                </div>
              )}
              {userDetails.firstName && (
                <div>
                  <p>
                    <strong>Name:</strong> {userDetails.firstName}{" "}
                    {userDetails.lastName}
                  </p>
                  <p>
                    <strong>Skills:</strong> {userDetails.skills}
                  </p>
                  <p>
                    <strong>Work Experience:</strong>{" "}
                    {userDetails.workExperience}
                  </p>
                  {userDetails.resume_url && (
                    <p>
                      <strong>Resume:</strong>{" "}
                      <a
                        href={userDetails.resume_url}
                        className="text-blue-500 hover:text-blue-700 underline"
                      >
                        Download
                      </a>
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

const renderForm = (profileType, handleSubmit) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {profileType === "employer" && (
        <>
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
        </>
      )}
      {profileType === "jobSeeker" && (
        <>
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
        </>
      )}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default Home;
