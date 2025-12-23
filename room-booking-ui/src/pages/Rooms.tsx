import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../app/snackbarSlice";

interface Room {
  id: number;
  roomName: string;
  capacity: number;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const loadRooms = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch (err: any) {
      dispatch(
        showSnackbar({
          message: "Failed to load rooms",
          severity: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-lg">Loading rooms...</p></div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Available Rooms</h2>

        {rooms.length === 0 && <p className="text-center text-gray-500">No rooms available</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{r.roomName}</h3>
              <p className="text-gray-600 mb-4">Capacity: {r.capacity}</p>
              <Link
                to={`/book?roomId=${r.id}`}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
