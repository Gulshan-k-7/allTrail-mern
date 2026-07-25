import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
// import CreatePost from "./pages/CreatePost";
// import EditPost from "./pages/EditPost";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/profile"
            element={<Profile />}
          />
          {/* <Route
            path="/posts/create"
            element={<CreatePost />}
          />
          <Route
            path="/posts/:postId/edit"
            element={<EditPost />}
          /> */}
        </Route>
      </Routes>
    </>
  );
}