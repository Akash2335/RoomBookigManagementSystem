import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Back
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">Create Room</h3>
            <p className="text-gray-600 mb-4">Add a new room to the system</p>
            <Link
              to="/admin/rooms/create"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Create Room
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">List Rooms</h3>
            <p className="text-gray-600 mb-4">View and manage all rooms</p>
            <Link
              to="/admin/rooms"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              View Rooms
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">Edit Rooms</h3>
            <p className="text-gray-600 mb-4">Modify existing rooms</p>
            <Link
              to="/admin/rooms"
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Edit Rooms
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">Create User</h3>
            <p className="text-gray-600 mb-4">Add a new user to the system</p>
            <Link
              to="/admin/users/create"
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
            >
              Create User
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">List Users</h3>
            <p className="text-gray-600 mb-4">View and manage all users</p>
            <Link
              to="/admin/users"
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
            >
              View Users
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">List Bookings</h3>
            <p className="text-gray-600 mb-4">View all user bookings</p>
            <Link
              to="/admin/bookings"
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
            >
              View Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
