import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const SearchTalent = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [skillFilter, setSkillFilter] = useState("");

  useEffect(() => {
    const fetchJobSeekers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_ROOT_URL}/api/job-seekers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              skills: skillFilter,
            },
          }
        );
        setJobSeekers(response.data.jobSeekers);
      } catch (error) {
        console.error("Error fetching job seekers:", error);
      }
    };

    fetchJobSeekers();
  }, [skillFilter]);

  const handleSkillFilterChange = (e) => {
    setSkillFilter(e.target.value);
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Search Talent</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by skills"
          value={skillFilter}
          onChange={handleSkillFilterChange}
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
        />
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {jobSeekers.map((jobSeeker) => (
            <tr key={jobSeeker.user_id}>
              <td className="border px-4 py-2">
                <Link
                  to={`/job-seeker/${jobSeeker.username}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {jobSeeker.username}
                </Link>
              </td>
              <td className="border px-4 py-2 text-center">
                <a href={`mailto:${jobSeeker.email}`}>
                  <FaEnvelope className="inline-block text-blue-500 hover:text-blue-700" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchTalent;
