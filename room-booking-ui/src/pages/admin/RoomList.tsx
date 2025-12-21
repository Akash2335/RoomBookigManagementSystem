import { useEffect, useState, useCallback, memo } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../app/snackbarSlice";

interface Room {
  id: number;
  roomName: string;
  capacity: number;
}

const RoomList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const dispatch = useDispatch();

  // ---------- Load rooms ----------
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms");
        setRooms(res.data);
      } catch {
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

    fetchRooms();
  }, [dispatch]);

  // ---------- Delete handlers ----------
  const openDeleteModal = useCallback((room: Room) => {
    setRoomToDelete(room);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setRoomToDelete(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!roomToDelete) return;

    try {
      await api.delete(`/rooms/${roomToDelete.id}`);

      // ✅ functional update (important)
      setRooms((prev) => prev.filter((r) => r.id !== roomToDelete.id));

      dispatch(
        showSnackbar({
          message: "Room deleted successfully",
          severity: "success",
        })
      );

      closeDeleteModal();
    } catch (err: any) {
      dispatch(
        showSnackbar({
          message: err.response?.data?.message || "Failed to delete room",
          severity: "error",
        })
      );
    }
  }, [roomToDelete, dispatch, closeDeleteModal]);

  // ---------- UI ----------
  if (loading) {
    return <p className="text-center mt-10">Loading rooms...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Room List</h2>

        <div className="mb-6 text-center">
          <Link
            to="/admin/rooms/create"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Create Room
          </Link>
        </div>

        {rooms.length === 0 && (
          <p className="text-center text-gray-600">No rooms available</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{room.roomName}</h3>
              <p className="text-gray-600 mb-4">Capacity: {room.capacity}</p>

              <div className="flex space-x-2">
                <Link
                  to={`/admin/rooms/edit/${room.id}`}
                  className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600"
                >
                  Edit
                </Link>

                <button
                  onClick={() => openDeleteModal(room)}
                  className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- Delete Modal ---------- */}
        {deleteModalOpen && roomToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="mb-4">
                Are you sure you want to delete{" "}
                <strong>{roomToDelete.roomName}</strong>?
              </p>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(RoomList);
