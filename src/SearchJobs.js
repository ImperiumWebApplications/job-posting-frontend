import React, { useEffect, useState } from "react";
import axios from "axios";

const SearchJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Running code now with title filter");
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_ROOT_URL}/api/jobs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              job_title: titleFilter,
            },
          }
        );
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [titleFilter]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_ROOT_URL}/api/applied-jobs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsLoading(false);
        setAppliedJobs(response.data.appliedJobs);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleTitleFilterChange = (e) => {
    setTitleFilter(e.target.value);
  };

  const handleApplyJob = async (jobId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_API_ROOT_URL}/api/apply-job`,
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAppliedJobs([...appliedJobs, jobId]);
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  const isJobApplied = (jobId) => {
    return appliedJobs.includes(jobId);
  };
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Search Jobs</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by title"
          value={titleFilter}
          onChange={handleTitleFilterChange}
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
        />
      </div>
      <ul>
        {jobs.map((job) => (
          <li key={job.job_id} className="mb-8">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">{job.job_title}</h3>
              <div className="mb-4">
                <strong>Description:</strong>
                <p>{job.job_description}</p>
              </div>
              <div className="mb-4">
                <strong>Tags:</strong>
                <p>{job.tags}</p>
              </div>
              <div className="mb-4">
                <strong>Budget:</strong>
                <p>{job.budget}</p>
              </div>
              <div>
                <strong>Duration:</strong>
                <p>{job.duration} days</p>
              </div>
              <div className="mt-4">
                {isJobApplied(job.job_id) ? (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    disabled
                  >
                    Applied
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleApplyJob(job.job_id)}
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchJobs;
