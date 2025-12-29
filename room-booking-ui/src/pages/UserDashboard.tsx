import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../app/snackbarSlice";
import { useAppSelector } from "../app/store";

interface Booking {
  id: number;
  roomId: number;
  roomName: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
}

interface AvailableBooking {
  id: number;
  roomId: number;
  roomName: string;
  startDate: string;
  endDate: string;
}

export default function UserDashboard() {
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [availableBookings, setAvailableBookings] = useState<
    AvailableBooking[]
  >([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.auth.userId); // Assuming userId is stored in auth state

  const loadData = async () => {
    try {
      // Fetch user's bookings
      const bookingsRes = await api.get(`/users/bookings/${userId}`);
      setMyBookings(bookingsRes.data);

      // Fetch available bookings (assuming an endpoint for available slots)
      const availableRes = await api.get("/rooms/availability");
      setAvailableBookings(availableRes.data);
    } catch (err: any) {
      dispatch(
        showSnackbar({
          message: "Failed to load dashboard data",
          severity: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = useCallback(async (bookingId: number) => {
    try {
      await api.delete(`/bookings/${bookingId}`);
      setMyBookings((prev) => prev.filter((b) => b.id !== bookingId));
      dispatch(
        showSnackbar({
          message: "Booking cancelled successfully",
          severity: "success",
        })
      );
    } catch (err: any) {
      dispatch(
        showSnackbar({
          message: "Failed to cancel booking",
          severity: "error",
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Back
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center">User Dashboard</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Bookings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">My Bookings</h3>
            {myBookings.length === 0 ? (
              <p className="text-gray-500">No bookings found</p>
            ) : (
              <div className="space-y-4">
                {myBookings.map((booking) => (
                  <div key={booking.id} className="border p-4 rounded-md">
                    <h4 className="font-semibold">{booking.roomName}</h4>
                    <p>Start: {new Date(booking.startDate).toLocaleString()}</p>
                    <p>End: {new Date(booking.endDate).toLocaleString()}</p>
                    <p>People: {booking.numberOfPeople}</p>
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Bookings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Available Bookings</h3>
            {availableBookings.length === 0 ? (
              <p className="text-gray-500">No available bookings</p>
            ) : (
              <div className="space-y-4">
                {availableBookings.map((booking) => (
                  <div key={booking.id} className="border p-4 rounded-md">
                    <h4 className="font-semibold">{booking.roomName}</h4>
                    <p>Start: {new Date(booking.startDate).toLocaleString()}</p>
                    <p>End: {new Date(booking.endDate).toLocaleString()}</p>
                    <Link
                      to={`/book?roomId=${booking.roomId}`}
                      className="inline-block mt-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                      Book Now
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
