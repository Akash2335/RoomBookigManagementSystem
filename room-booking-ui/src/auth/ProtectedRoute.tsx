import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/store";
import type { AuthState } from "./authSlice";

interface ProtectedRouteProps {
  children: JSX.Element;
  role?: string;
}

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const { accessToken, role: userRole } = useAppSelector(
    (state) => state.auth as AuthState
  );

  // 1️⃣ Not logged in
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Role check (Admin/User)
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Authorized
  return children;
}
