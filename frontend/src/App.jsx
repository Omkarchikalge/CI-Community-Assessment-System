import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/register";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Room from "./pages/Room";
import TakeTest from "./pages/TakeTest";
import Analytics from "./pages/Analytics";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>

      {/* Navbar always visible */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute roleRequired="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute roleRequired="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/room/:code"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />

        <Route
          path="/test/:code"
          element={
            <ProtectedRoute>
              <TakeTest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics/:code"
          element={
            <ProtectedRoute roleRequired="teacher">
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}
