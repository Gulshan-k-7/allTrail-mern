import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Components/Navbar";

import Home from "./Pages/Home";
import Explore from "./Pages/Explore";
import Community from "./Pages/Community";
import About from "./Pages/About";
import Profile from "./Pages/Profile";
import CreatePost from "./Pages/CreatePost";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>

      <div className="relative">
        <Navbar />
        <Routes>
          {/* Default Route */}
          <Route
            path="/"
            element={<Navigate to="/home" replace />}
          />

          {/* Public Pages */}
          <Route path="/home" element={<Home />} />
          <Route
            path="/explore"
            element={<Explore />}
          />
          <Route
            path="/community"
            element={<Community />}
          />
          <Route
            path="/about"
            element={<About />}
          />

          {/* Protected Pages */}
          <Route
            path="/profile"
            element={
              token ? (
                <Profile />
              ) : (
                <Navigate
                  to="/home"
                  replace
                />
              )
            }
          />

          <Route
            path="/create-post"
            element={
              token ? (
                <CreatePost />
              ) : (
                <Navigate
                  to="/home"
                  replace
                />
              )
            }
          />

          {/* Unknown Route */}
          <Route
            path="*"
            element={<Navigate to="/home" replace />}
          />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;
