// ===============================
// React Router for client-side routing
// ===============================
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ===============================
// React utilities for lazy loading
// ===============================
import { Suspense, lazy } from "react";

// ===============================
// UI loader displayed during lazy loading
// ===============================
import { CircularProgress } from "@mui/material";

// ===============================
// Lazy-loaded PAGE components
// (Only route-level pages should be lazy-loaded)
// ===============================
const Login = lazy(() => import("./pages/Login")); // User login page
const Rooms = lazy(() => import("./pages/Rooms")); // Public room listing
const BookRoom = lazy(() => import("./pages/BookRoom")); // Room booking page
const UserDashboard = lazy(() => import("./pages/UserDashboard")); // User dashboard
const RoomList = lazy(() => import("./pages/admin/RoomList")); // Admin: list rooms
const CreateRoom = lazy(() => import("./pages/admin/CreateRoom")); // Admin: create room
const EditRoom = lazy(() => import("./pages/admin/EditRoom")); // Admin: edit room
const CreateUser = lazy(() => import("./pages/admin/CreateUser")); // Admin: create user
const UserList = lazy(() => import("./pages/admin/UserList")); // Admin: list users
const BookingList = lazy(() => import("./pages/admin/BookingList")); // Admin: list bookings
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard")); // Admin dashboard
const ForgotPassword = lazy(() => import("./pages/ForgotPassword")); // Forgot password page

// ===============================
// NON-lazy components
// (Guards, layout, and global UI must load synchronously)
// ===============================
import ProtectedRoute from "./auth/ProtectedRoute"; // Route access guard
import AppSnackbar from "./Components/AppSnackbar"; // Global notifications
import Header from "./Components/Header"; // Application header
import Footer from "./Components/Footer"; // Application footer

// ===============================
// Main Application Component
// ===============================
export default function App() {
  return (
    <>
      {/* Global notification handler */}
      <AppSnackbar />

      {/* Enables SPA routing */}
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          {/* Persistent header */}
          <Header />

          {/* Main content area */}
          <main className="flex-grow">
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <CircularProgress />
                </div>
              }
            >
              <Routes>
                {/* =======================
                    Public Routes
                   ======================= */}
                <Route path="/" element={<Rooms />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* =======================
                    Authenticated User Routes
                   ======================= */}
                <Route path="/book" element={<BookRoom />} />

                <Route
                  path="/user/dashboard"
                  element={
                    <ProtectedRoute role="User">
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute role="Admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* =======================
                    Admin-Only Routes
                   ======================= */}
                <Route
                  path="/admin/rooms"
                  element={
                    <ProtectedRoute role="Admin">
                      <RoomList />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/rooms/create"
                  element={
                    <ProtectedRoute role="Admin">
                      <CreateRoom />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/rooms/edit/:id"
                  element={
                    <ProtectedRoute role="Admin">
                      <EditRoom />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute role="Admin">
                      <UserList />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/users/create"
                  element={
                    <ProtectedRoute role="Admin">
                      <CreateUser />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/bookings"
                  element={
                    <ProtectedRoute role="Admin">
                      <BookingList />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </main>

          {/* Persistent footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}
