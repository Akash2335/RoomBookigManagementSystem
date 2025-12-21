import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { CircularProgress } from "@mui/material";

const Login = lazy(() => import("./pages/Login"));
const Rooms = lazy(() => import("./pages/Rooms"));
const BookRoom = lazy(() => import("./pages/BookRoom"));
const RoomList = lazy(() => import("./pages/admin/RoomList"));
const CreateRoom = lazy(() => import("./pages/admin/CreateRoom"));
const EditRoom = lazy(() => import("./pages/admin/EditRoom"));
const ProtectedRoute = lazy(() => import("./auth/ProtectedRoute"));
const AppSnackbar = lazy(() => import("./Components/AppSnackbar"));
const Header = lazy(() => import("./Components/Header"));
const Footer = lazy(() => import("./Components/Footer"));

export default function App() {
  return (
    <>
       {/* 🔔 Global Popup Bar */}
      <AppSnackbar />
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><CircularProgress /></div>}>
            <Routes>
              {/* ---------- Public Routes ---------- */}
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Rooms />} />

              {/* ---------- User Protected Routes ---------- */}
              <Route
                path="/book"
                element={
                  <ProtectedRoute>
                    <BookRoom />
                  </ProtectedRoute>
                }
              />

              {/* ---------- Admin Protected Routes ---------- */}
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
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
    </>
  );
}
