import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const JobSeekerProfile = () => {
  const { username } = useParams();
  const [jobSeekerDetails, setJobSeekerDetails] = useState(null);

  useEffect(() => {
    const fetchJobSeekerDetails = async () => {
      try {
        const response = await axios.get(`/api/job-seeker/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setJobSeekerDetails(response.data.jobSeekerDetails);
      } catch (error) {
        console.error("Error fetching job seeker details:", error);
      }
    };

    fetchJobSeekerDetails();
  }, [username]);

  if (!jobSeekerDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Job Seeker Profile</h2>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-center mb-4">
          Personal Information
        </h3>
        <div className="text-center">
          <p className="mb-2">
            <strong>Name:</strong> {jobSeekerDetails.firstName}{" "}
            {jobSeekerDetails.lastName}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {jobSeekerDetails.email}
          </p>{" "}
          <p className="mb-2">
            <strong>Phone Number:</strong> {jobSeekerDetails.phoneNumber}
          </p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-center mb-4">Skills</h3>
        <div className="text-center">
          <p className="mb-2">{jobSeekerDetails.skills}</p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-center mb-4">Work Experience</h3>
        <div className="text-center">
          <p className="mb-2">{jobSeekerDetails.workExperience}</p>
        </div>
      </div>
      {jobSeekerDetails.resumeUrl && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-center mb-4">Resume</h3>
          <div className="text-center">
            <a
              href={jobSeekerDetails.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Download Resume
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSeekerProfile;
