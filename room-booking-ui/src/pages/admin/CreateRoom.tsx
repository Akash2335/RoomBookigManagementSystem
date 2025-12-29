import { Formik, Form, Field, ErrorMessage } from "formik";

import { roomSchema } from "../../validation/schemas";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../app/snackbarSlice";
import { Helmet } from "react-helmet-async";

export default function CreateRoom() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <Helmet>
        <title>Create Room | Room Booking System</title>
        <meta
          name="description"
          content="Create a new room in the Room Booking System"
        />
      </Helmet>
      <div className="flex items-start justify-start py-2 bg-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Back
        </button>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Create Room
          </h2>

          <Formik
            initialValues={{ roomName: "", capacity: 0 }}
            validationSchema={roomSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await api.post("/rooms", values);

                dispatch(
                  showSnackbar({
                    message: "Room created successfully",
                    severity: "success",
                  })
                );

                navigate("/admin/rooms");
              } catch (err: any) {
                dispatch(
                  showSnackbar({
                    message:
                      err.response?.data?.message || "Failed to create room",
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
                  <label
                    htmlFor="roomName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Room Name
                  </label>
                  <Field
                    id="roomName"
                    name="roomName"
                    placeholder="Enter room name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="roomName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="capacity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Capacity
                  </label>
                  <Field
                    id="capacity"
                    name="capacity"
                    type="number"
                    placeholder="Enter capacity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="capacity"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
