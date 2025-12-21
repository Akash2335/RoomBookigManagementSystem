import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/store";
import { logout } from "../auth/authSlice";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/" className="hover:text-blue-200">
            Room Booking System
          </Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-blue-200">
                Home
              </Link>
            </li>
            {token ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-blue-200 bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
