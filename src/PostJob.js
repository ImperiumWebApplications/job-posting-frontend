import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostJob = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tags, setTags] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [durationError, setDurationError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/jobs_for_user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate budget
    if (isNaN(budget) || budget <= 0) {
      setBudgetError("Please enter a valid positive number for the budget.");
      return;
    }

    // Validate duration
    if (isNaN(duration) || duration <= 0) {
      setDurationError(
        "Please enter a valid positive number for the duration."
      );
      return;
    }

    try {
      await axios.post(
        "http://localhost:5002/api/jobs_for_user",
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

      setShowForm(false);
      fetchJobs();
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Posted Jobs</h2>
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white rounded-md px-4 py-2 mb-4"
      >
        Post New Job
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label htmlFor="jobTitle" className="block mb-1">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="jobDescription" className="block mb-1">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="tags" className="block mb-1">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="budget" className="block mb-1">
              Expected Budget ($)
            </label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => {
                setBudget(e.target.value);
                setBudgetError("");
              }}
              className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                budgetError && "border-red-500"
              }`}
              required
            />
            {budgetError && (
              <p className="text-red-500 text-sm mt-1">{budgetError}</p>
            )}
          </div>
          <div>
            <label htmlFor="duration" className="block mb-1">
              Duration (in days)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  setDurationError("");
                }}
                className={`w-24 border border-gray-300 rounded-md px-3 py-2 ${
                  durationError && "border-red-500"
                }`}
                required
              />
              <span className="ml-2">days</span>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md px-4 py-2"
          >
            Post Job
          </button>
        </form>
      )}
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Job Title</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.job_id}>
              <td className="border px-4 py-2">
                <Link
                  to={`/jobs/${job.job_id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {job.job_title}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostJob;
