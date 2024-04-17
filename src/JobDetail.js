import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tags, setTags] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/api/jobs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setJob(response.data.job);
        setJobTitle(response.data.job.job_title);
        setJobDescription(response.data.job.job_description);
        setTags(response.data.job.tags);
        setBudget(response.data.job.budget);
        setDuration(response.data.job.duration);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5002/api/jobs/${id}`,
        {
          jobTitle,
          jobDescription,
          tags,
          budget,
          duration,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIsEditing(false);
      navigate("/post-job");
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Job Details</h2>
      {isEditing ? (
        <div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <label htmlFor="jobTitle" className="block font-bold mb-2">
              Job Title:
            </label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <label htmlFor="jobDescription" className="block font-bold mb-2">
              Job Description:
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <label htmlFor="tags" className="block font-bold mb-2">
              Tags:
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <label htmlFor="budget" className="block font-bold mb-2">
              Budget:
            </label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <label htmlFor="duration" className="block font-bold mb-2">
              Duration (in days):
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-center mb-4">
              {job.job_title}
            </h3>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-center mb-4">Description</h3>
            <div className="text-center">
              <p className="mb-2">{job.job_description}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-center mb-4">Tags</h3>
            <div className="text-center">
              <p className="mb-2">{job.tags}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-center mb-4">Budget</h3>
            <div className="text-center">
              <p className="mb-2">{job.budget}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-center mb-4">Duration</h3>
            <div className="text-center">
              <p className="mb-2">{job.duration} days</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
