import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../app/snackbarSlice";
import { Helmet } from "react-helmet-async";
import { sendPasswordResetEmail } from "../../utils/email";
import { useNavigate } from "react-router-dom";
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  bookingCount?: number;
}

interface Booking {
  id: number;
  userId: number;
  userName: string;
  roomId: number;
  name: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [userToReset, setUserToReset] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [useSuggestion, setUseSuggestion] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRes = await api.get("/users");

        const usersData = usersRes.data;

        // Set booking count to 0 for all users
        const usersWithCounts = usersData.map((user: User) => ({
          ...user,
          bookingCount: 0,
        }));

        setUsers(usersWithCounts);
      } catch (err: any) {
        dispatch(
          showSnackbar({
            message: "Failed to load users",
            severity: "error",
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    setBookingsLoading(true);
    try {
      const bookingsRes = await api.get(`users/bookings/${user.id}`);
      const allBookings: Booking[] = bookingsRes.data;
      setUserBookings(allBookings);
    } catch (err: any) {
      dispatch(
        showSnackbar({
          message: "Failed to load bookings",
          severity: "error",
        })
      );
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleResetPassword = (user: User) => {
    setUserToReset(user);
    setShowResetModal(true);
  };

  const generatePasswordSuggestion = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*abcdefghijklmnopqrstuvwxyz";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const confirmResetPassword = async () => {
    if (!userToReset || !resetPassword) return;
    try {
      // Call API to reset password
      await api.post(`/auth/reset-password/${userToReset.id}`, {
        UserId: userToReset.id,
        NewPassword: resetPassword,
      });

      // Send reset email
      try {
        await sendPasswordResetEmail(userToReset.email, resetPassword);
        dispatch(
          showSnackbar({
            message: "Password reset successfully and email sent",
            severity: "success",
          })
        );
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        dispatch(
          showSnackbar({
            message: "Password reset successfully, but failed to send email",
            severity: "warning",
          })
        );
      }
    } catch (err: any) {
      dispatch(
        showSnackbar({
          message: err.response?.data?.message || "Failed to reset password",
          severity: "error",
        })
      );
    } finally {
      setShowResetModal(false);
      setResetPassword('');
      setUserToReset(null);
      setShowPassword(false);
      setUseSuggestion(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading users...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Users | Room Booking System</title>
        <meta name="description" content="Admin user management page" />
      </Helmet>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back
          </button>
          <h2 className="text-3xl font-bold mb-6 text-center">User List</h2>

          {users.length === 0 ? (
            <p className="text-center text-gray-600">No users found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow ${
                    selectedUser?.id === user.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
                  <p className="text-gray-600 mb-2">{user.email}</p>
                  <p className="text-sm text-gray-500">Role: {user.role}</p>
                  <p className="text-sm text-gray-500">
                    Rooms Booked: {user.bookingCount}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetPassword(user);
                    }}
                    className="mt-3 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Reset Password
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="max-w-6xl mx-auto px-4 mt-8">
            <h3 className="text-2xl font-bold mb-4">All Bookings</h3>
            {bookingsLoading ? (
              <p className="text-center">Loading bookings...</p>
            ) : userBookings.length === 0 ? (
              <p className="text-center text-gray-600">No bookings found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Number of People
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(booking.startDate).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(booking.endDate).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.numberOfPeople}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {showResetModal && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
            id="my-modal"
          >
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Reset Password for {userToReset?.name}
                </h3>
                <div className="mt-2 px-7 py-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-2 flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                        className="mr-2"
                      />
                      Show password
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={useSuggestion}
                        onChange={(e) => {
                          setUseSuggestion(e.target.checked);
                          if (e.target.checked) {
                            const suggestion = generatePasswordSuggestion();
                            setResetPassword(suggestion);
                          } else {
                            setResetPassword("");
                          }
                        }}
                        className="mr-2"
                      />
                      Use password suggestion
                    </label>
                  </div>
                </div>
                <div className="flex items-center px-4 py-3">
                  <button
                    onClick={confirmResetPassword}
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => {
                      setShowResetModal(false);
                      setResetPassword("");
                      setUserToReset(null);
                      setShowPassword(false);
                      setUseSuggestion(false);
                    }}
                    className="ml-3 px-4 py-2 bg-gray-300 text-gray-900 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                </div>
                {resetPassword && showPassword && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <strong>Password:</strong> {resetPassword}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Copy this password to provide to the user.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
