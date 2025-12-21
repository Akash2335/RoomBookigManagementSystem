import { useEffect, useState, memo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../api/axios";
import { roomSchema } from "../../validation/schemas";
import { showSnackbar } from "../../app/snackbarSlice";

interface Room {
  roomName: string;
  capacity: number;
}

const EditRoom = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  // Load room
  useEffect(() => {
    if (!id) return;

    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data);
      } catch {
        dispatch(
          showSnackbar({
            message: "Room not found",
            severity: "error",
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, dispatch]);

  // UI states
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!room) return <p className="text-center mt-10">Room not found</p>;

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Edit Room</h2>

        <Formik
          enableReinitialize
          initialValues={room}
          validationSchema={roomSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await api.put(`/rooms/${id}`, values);

              dispatch(
                showSnackbar({
                  message: "Room updated successfully",
                  severity: "success",
                })
              );

              navigate("/admin/rooms");
            } catch (err: any) {
              dispatch(
                showSnackbar({
                  message:
                    err.response?.data?.message || "Failed to update room",
                  severity: "error",
                })
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  name="roomName"
                  placeholder="Room Name"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="roomName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <Field
                  name="capacity"
                  type="number"
                  min={1}
                  max={100} // UX-level guard
                  placeholder="Capacity"
                  className="w-full border p-2 rounded"
                />
                <ErrorMessage
                  name="capacity"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// ✅ memo applied correctly
export default memo(EditRoom);
