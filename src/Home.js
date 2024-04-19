import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

const Home = ({ onProfileUpdate }) => {
  const [profileType, setProfileType] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const response = await axios.get(`/api/user-details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setIsRegistered(response.data.isRegistered);
        setProfileType(response.data.profileType);
        if (response.data.isRegistered) {
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

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);

    // Validation rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    // Validation errors object
    const validationErrors = {};

    if (profileType === "employer") {
      if (!formData.get("companyName")) {
        validationErrors.companyName = "Company Name is required";
      }
      if (!formData.get("address")) {
        validationErrors.address = "Address is required";
      }
    } else if (profileType === "jobSeeker") {
      if (!formData.get("firstName")) {
        validationErrors.firstName = "First Name is required";
      }
      if (!formData.get("lastName")) {
        validationErrors.lastName = "Last Name is required";
      }
      if (!formData.get("email")) {
        validationErrors.email = "Email is required";
      } else if (!emailRegex.test(formData.get("email"))) {
        validationErrors.email = "Invalid email format";
      }
      if (!formData.get("phoneNumber")) {
        validationErrors.phoneNumber = "Phone Number is required";
      } else if (!phoneRegex.test(formData.get("phoneNumber"))) {
        validationErrors.phoneNumber = "Invalid phone number format";
      }
      if (!formData.get("skills")) {
        validationErrors.skills = "Skills are required";
      }
    }

    // If there are validation errors, update the errors state and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `/api/profile/${profileType}`,
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

      // Fetch user profile after creating the profile
      const userDetailsResponse = await axios.get(`/api/user-details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserDetails(userDetailsResponse.data.userDetails);
      onProfileUpdate(userDetailsResponse.data);
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

    // Validation rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    // Validation errors object
    const validationErrors = {};

    if (profileType === "employer") {
      if (!formData.get("companyName")) {
        validationErrors.companyName = "Company Name is required";
      }
      if (!formData.get("address")) {
        validationErrors.address = "Address is required";
      }
    } else if (profileType === "jobSeeker") {
      if (!formData.get("firstName")) {
        validationErrors.firstName = "First Name is required";
      }
      if (!formData.get("lastName")) {
        validationErrors.lastName = "Last Name is required";
      }
      if (!formData.get("email")) {
        validationErrors.email = "Email is required";
      } else if (!emailRegex.test(formData.get("email"))) {
        validationErrors.email = "Invalid email format";
      }
      if (!formData.get("phoneNumber")) {
        validationErrors.phoneNumber = "Phone Number is required";
      } else if (!phoneRegex.test(formData.get("phoneNumber"))) {
        validationErrors.phoneNumber = "Invalid phone number format";
      }
      if (!formData.get("skills")) {
        validationErrors.skills = "Skills are required";
      }
    }

    // If there are validation errors, update the errors state and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`/api/update-user`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": undefined,
        },
      });

      const userDetailsResponse = await axios.get(`/api/user-details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUserDetails(userDetailsResponse.data.userDetails);
      onProfileUpdate(userDetailsResponse.data);
      setIsEditMode(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
        <div className="bg-blue-500 text-white text-center py-4 mb-8">
          <h1 className="text-3xl font-bold">Welcome to My App</h1>
        </div>
        {profileType && (
          <div className="bg-teal-500 text-white text-center py-4 mb-8">
            <h1 className="text-3xl font-bold">
              Please register a{" "}
              {profileType === "jobSeeker" ? "job seeker" : "employer"} profile
            </h1>
          </div>
        )}
        {profileType === "employer" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className={`p-2 border rounded w-full ${
                errors.companyName ? "border-red-500" : ""
              }`}
              name="companyName"
              placeholder="Company Name"
              required
            />
            {errors.companyName && (
              <p className="text-red-500">{errors.companyName}</p>
            )}
            <textarea
              className={`p-2 border rounded w-full ${
                errors.address ? "border-red-500" : ""
              }`}
              name="address"
              placeholder="Address"
              required
            />
            {errors.address && <p className="text-red-500">{errors.address}</p>}
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
              className={`p-2 border rounded w-full ${
                errors.firstName ? "border-red-500" : ""
              }`}
              name="firstName"
              placeholder="First Name"
              required
            />
            {errors.firstName && (
              <p className="text-red-500">{errors.firstName}</p>
            )}
            <input
              className={`p-2 border rounded w-full ${
                errors.lastName ? "border-red-500" : ""
              }`}
              name="lastName"
              placeholder="Last Name"
              required
            />
            {errors.lastName && (
              <p className="text-red-500">{errors.lastName}</p>
            )}
            <input
              className={`p-2 border rounded w-full ${
                errors.email ? "border-red-500" : ""
              }`}
              name="email"
              placeholder="Email"
              required
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
            <input
              className={`p-2 border rounded w-full ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
              name="phoneNumber"
              maxLength={10}
              placeholder="Phone Number"
              required
            />
            {errors.phoneNumber && (
              <p className="text-red-500">{errors.phoneNumber}</p>
            )}
            <input
              className={`p-2 border rounded w-full ${
                errors.skills ? "border-red-500" : ""
              }`}
              name="skills"
              placeholder="Skills (comma separated)"
              required
            />
            {errors.skills && <p className="text-red-500">{errors.skills}</p>}
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-blue-500 text-white text-center py-4 mb-8">
        <h1 className="text-3xl font-bold">Welcome to My App</h1>
      </div>
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
                    className={`p-2 border rounded w-full ${
                      errors.companyName ? "border-red-500" : ""
                    }`}
                    name="companyName"
                    placeholder="Company Name"
                    defaultValue={userDetails.companyName}
                    required
                  />
                  {errors.companyName && (
                    <p className="text-red-500">{errors.companyName}</p>
                  )}
                  <textarea
                    className={`p-2 border rounded w-full ${
                      errors.address ? "border-red-500" : ""
                    }`}
                    name="address"
                    placeholder="Address"
                    defaultValue={userDetails.address}
                    required
                  />
                  {errors.address && (
                    <p className="text-red-500">{errors.address}</p>
                  )}
                </>
              )}
              {profileType === "jobSeeker" && (
                <>
                  <input
                    className={`p-2 border rounded w-full ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    name="firstName"
                    placeholder="First Name"
                    defaultValue={userDetails.firstName}
                    required
                  />
                  {errors.firstName && (
                    <p className="text-red-500">{errors.firstName}</p>
                  )}
                  <input
                    className={`p-2 border rounded w-full ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    name="lastName"
                    placeholder="Last Name"
                    defaultValue={userDetails.lastName}
                    required
                  />
                  {errors.lastName && (
                    <p className="text-red-500">{errors.lastName}</p>
                  )}
                  <input
                    className={`p-2 border rounded w-full ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    name="email"
                    placeholder="Email"
                    defaultValue={userDetails.email}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email}</p>
                  )}
                  <input
                    className={`p-2 border rounded w-full ${
                      errors.phoneNumber ? "border-red-500" : ""
                    }`}
                    name="phoneNumber"
                    maxLength={10}
                    placeholder="Phone Number"
                    defaultValue={userDetails.phoneNumber}
                    required
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500">{errors.phoneNumber}</p>
                  )}
                  <input
                    className={`p-2 border rounded w-full ${
                      errors.skills ? "border-red-500" : ""
                    }`}
                    name="skills"
                    placeholder="Skills (comma separated)"
                    defaultValue={userDetails.skills}
                    required
                  />
                  {errors.skills && (
                    <p className="text-red-500">{errors.skills}</p>
                  )}
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
                <>
                  <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-center mb-4">
                      Company Details
                    </h3>
                    <div className="text-center">
                      <p className="mb-2">
                        <strong>Company Name:</strong> {userDetails.companyName}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-center mb-4">
                      Company Address
                    </h3>
                    <div className="text-center">
                      <p className="mb-2">{userDetails.address}</p>
                    </div>
                  </div>
                </>
              )}
              {userDetails.firstName && (
                <>
                  <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-center mb-4">
                      Personal Information
                    </h3>
                    <div className="text-center">
                      <p className="mb-2">
                        <strong>Name:</strong> {userDetails.firstName}{" "}
                        {userDetails.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-center mb-4">
                      Email
                    </h3>
                    <div className="text-center">
                      <p className="mb-2">{userDetails.email}</p>
                    </div>
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-center mb-4">
                      Phone Number
                    </h3>
                    <div className="text-center">
                      <p className="mb-2">{userDetails.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-center mb-4">
                      Skills
                    </h3>
                    <div className="text-center">
                      <p>{userDetails.skills}</p>
                    </div>
                  </div>
                  <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-center mb-4">
                      Work Experience
                    </h3>
                    <div className="text-center">
                      <p>{userDetails.workExperience}</p>
                    </div>
                  </div>
                  {userDetails.resume_url && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                      <h3 className="text-xl font-bold text-center mb-4">
                        Resume
                      </h3>
                      <div className="text-center">
                        <a
                          href={userDetails.resume_url}
                          className="text-blue-500 hover:text-blue-700 underline"
                        >
                          Download Resume
                        </a>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
