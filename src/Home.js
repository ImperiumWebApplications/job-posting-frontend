import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = (props) => {
  const [profileType, setProfileType] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // State to store user details
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          // Simulate fetching user details from local state (for demonstration)
          setUserDetails(response.data.userDetails);
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
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const response = await axios.post(
        `http://localhost:5002/api/profile/${profileType}`,
        formData, // Directly pass formData without converting to an object
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": undefined, // Let the browser set the Content-Type
          },
        }
      );
      console.log(response.data.message);
      setIsRegistered(true); // Update registration status

      // Fetch user details from the server to update local state with complete details
      const userDetailsResponse = await axios.get(
        "http://localhost:5002/api/user-details",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUserDetails(userDetailsResponse.data.userDetails);
    } catch (error) {
      console.error("Error submitting profile or fetching details:", error);
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

  return renderUserProfile(userDetails);
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

const renderUserProfile = (userDetails) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Profile Details</h1>
      {userDetails && (
        <>
          <div>
            <strong>Username:</strong> {userDetails.username || "N/A"}
          </div>
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
                <strong>Work Experience:</strong> {userDetails.workExperience}
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
    </div>
  );
};

export default Home;
