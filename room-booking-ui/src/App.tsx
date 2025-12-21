// // Import necessary modules from React Router for handling navigation and routing
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// // Import Suspense and lazy for code splitting and lazy loading components to improve performance
// import { Suspense, lazy } from "react";
// // Import CircularProgress from Material-UI for showing a loading spinner during lazy loading
// import { CircularProgress } from "@mui/material";

// // Lazy load page components to split code and load them only when needed
// const Login = lazy(() => import("./pages/Login")); // Login page for user authentication
// const Rooms = lazy(() => import("./pages/Rooms")); // Page to display available rooms
// const BookRoom = lazy(() => import("./pages/BookRoom")); // Page for booking a room
// const RoomList = lazy(() => import("./pages/admin/RoomList")); // Admin page to list all rooms
// const CreateRoom = lazy(() => import("./pages/admin/CreateRoom")); // Admin page to create a new room
// const EditRoom = lazy(() => import("./pages/admin/EditRoom")); // Admin page to edit an existing room
// const ProtectedRoute = lazy(() => import("./auth/ProtectedRoute")); // Component to protect routes based on authentication and roles
// const AppSnackbar = lazy(() => import("./Components/AppSnackbar")); // Global snackbar for notifications
// const Header = lazy(() => import("./Components/Header")); // Header component with navigation
// const Footer = lazy(() => import("./Components/Footer")); // Footer component

// // Main App component that sets up the entire application structure and routing
// export default function App() {
//   return (
//     <>
//       {/* Global snackbar component for displaying notifications across the app */}
//       <AppSnackbar />
//       {/* BrowserRouter enables client-side routing for the application */}
//       <BrowserRouter>
//         {/* Main container with full height and flex layout for header, content, and footer */}
//         <div className="min-h-screen flex flex-col">
//           {/* Header component displayed at the top of every page */}
//           <Header />
//           {/* Main content area that grows to fill available space */}
//           <main className="flex-grow">
//             {/* Suspense wrapper for lazy-loaded components, shows loading spinner while components load */}
//             <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><CircularProgress /></div>}>
//               {/* Routes define the different pages and their paths */}
//               <Routes>
//                 {/* Public routes accessible without authentication */}
//                 <Route path="/login" element={<Login />} /> {/* Login page for users to authenticate */}
//                 <Route path="/" element={<Rooms />} /> {/* Home page showing available rooms */}

//                 {/* Protected routes for authenticated users */}
//                 <Route
//                   path="/book"
//                   element={
//                     <ProtectedRoute> {/* Wraps component to require authentication */}
//                       <BookRoom /> {/* Page for users to book a room */}
//                     </ProtectedRoute>
//                   }
//                 />

//                 {/* Protected routes for admin users only */}
//                 <Route
//                   path="/admin/rooms"
//                   element={
//                     <ProtectedRoute role="Admin"> {/* Requires admin role */}
//                       <RoomList /> {/* Page for admins to view all rooms */}
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/admin/rooms/create"
//                   element={
//                     <ProtectedRoute role="Admin"> {/* Requires admin role */}
//                       <CreateRoom /> {/* Page for admins to create new rooms */}
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/admin/rooms/edit/:id"
//                   element={
//                     <ProtectedRoute role="Admin"> {/* Requires admin role */}
//                       <EditRoom /> {/* Page for admins to edit existing rooms, :id is the room ID */}
//                     </ProtectedRoute>
//                   }
//                 />
//               </Routes>
//             </Suspense>
//           </main>
//           {/* Footer component displayed at the bottom of every page */}
//           <Footer />
//         </div>
//       </BrowserRouter>
//     </>
//   );
// }
// React Router for client-side routing
import { BrowserRouter, Routes, Route } from "react-router-dom";

// React utilities for lazy loading and suspense
import { Suspense, lazy } from "react";

// Material UI loader shown during lazy loading
import { CircularProgress } from "@mui/material";

// ===============================
// Lazy-loaded PAGE components
// (Only pages should be lazy-loaded)
// ===============================
const Login = lazy(() => import("./pages/Login"));           // Login page
const Rooms = lazy(() => import("./pages/Rooms"));           // Public rooms listing
const BookRoom = lazy(() => import("./pages/BookRoom"));     // User booking page
const RoomList = lazy(() => import("./pages/admin/RoomList"));// Admin room list
const CreateRoom = lazy(() => import("./pages/admin/CreateRoom")); // Admin create room
const EditRoom = lazy(() => import("./pages/admin/EditRoom"));// Admin edit room

// ===============================
// NON-lazy components
// (Guards, layout & global UI must be synchronous)
// ===============================
import ProtectedRoute from "./auth/ProtectedRoute";   // Route guard (MUST NOT be lazy)
import AppSnackbar from "./Components/AppSnackbar";   // Global notifications
import Header from "./Components/Header";             // App header
import Footer from "./Components/Footer";             // App footer

// ===============================
// Main App Component
// ===============================
export default function App() {
  return (
    <>
      {/* Global snackbar shown across the entire application */}
      <AppSnackbar />

      {/* BrowserRouter enables SPA routing */}
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          {/* Header always visible */}
          <Header />

          {/* Main content area */}
          <main className="flex-grow">
            {/* Suspense handles lazy-loaded pages */}
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
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Rooms />} />

                {/* =======================
                    User Protected Routes
                   ======================= */}
                <Route
                  path="/book"
                  element={
                    <ProtectedRoute>
                      <BookRoom />
                    </ProtectedRoute>
                  }
                />

                {/* =======================
                    Admin Protected Routes
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
              </Routes>
            </Suspense>
          </main>

          {/* Footer always visible */}
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}
