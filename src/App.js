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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(token !== null);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
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
                <Link
                  to="/"
                  className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4"
                >
                  Home
                </Link>
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
              element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
