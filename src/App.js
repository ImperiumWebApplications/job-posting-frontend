import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import SearchJobs from "./SearchJobs";
import SearchTalent from "./SearchTalent";
import PostJob from "./PostJob";
import JobSeekerProfile from "./JobSeekerProfile";
import JobDetail from "./JobDetail";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(token !== null);

    if (token) {
      // Fetch user profile from the server based on the token
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(
        `/api/user-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setUserProfile(data.userDetails);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserProfile(null);
  };

  const handleProfileUpdate = (updatedUserProfile) => {
    setUserProfile(updatedUserProfile);
  };

  return (
    <Router>
      <div className="min-h-screen">
        <nav className="flex items-center justify-between flex-wrap bg-blue-500 p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <span className="font-semibold text-xl tracking-tight">My App</span>
          </div>
          <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div className="text-sm lg:flex-grow">
              {isLoggedIn && (
                <>
                  <Link
                    to="/"
                    className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4"
                  >
                    Home
                  </Link>
                  {userProfile?.profileType === "jobSeeker" && (
                    <Link
                      to="/search-jobs"
                      className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4"
                    >
                      Search Jobs
                    </Link>
                  )}
                  {userProfile?.profileType === "employer" && (
                    <>
                      <Link
                        to="/search-talent"
                        className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4"
                      >
                        Search Talent
                      </Link>
                      <Link
                        to="/post-job"
                        className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4"
                      >
                        Post Job
                      </Link>
                    </>
                  )}
                </>
              )}
              {!isLoggedIn && (
                <>
                  <Link
                    to="/register"
                    className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
            {isLoggedIn && (
              <div>
                <button
                  onClick={handleLogout}
                  className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 lg:mt-0"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="container mx-auto mt-8">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Home onProfileUpdate={handleProfileUpdate} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/register"
              element={!isLoggedIn ? <Register /> : <Navigate to="/" replace />}
            />
            <Route
              path="/login"
              element={
                !isLoggedIn ? (
                  <Login onLogin={handleLogin} afterLogin={fetchUserProfile} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/search-jobs"
              element={
                isLoggedIn && userProfile?.profileType === "jobSeeker" ? (
                  <SearchJobs />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/search-talent"
              element={
                isLoggedIn && userProfile?.profileType === "employer" ? (
                  <SearchTalent />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/job-seeker/:username"
              element={<JobSeekerProfile />}
            />

            <Route
              path="/post-job"
              element={
                isLoggedIn && userProfile?.profileType === "employer" ? (
                  <PostJob />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/jobs/:id"
              element={
                isLoggedIn && userProfile?.profileType === "employer" ? (
                  <JobDetail />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
