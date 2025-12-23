import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSearchParams } from "react-router-dom";
import { bookingSchema } from "../validation/schemas";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../app/snackbarSlice";

export default function BookRoom() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const roomIdFromUrl = searchParams.get("roomId") || "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Book Room</h2>

        <Formik
          initialValues={{
            roomId: roomIdFromUrl,
            startDate: "",
            endDate: "",
            numberOfPeople: 1,
          }}
          validationSchema={bookingSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await api.post("/bookings", values);

              // ✅ SUCCESS POPUP
              dispatch(
                showSnackbar({
                  message: "Booking confirmed successfully",
                  severity: "success",
                })
              );

              resetForm();
            } catch (err: any) {
              // ❌ ERROR POPUP
              dispatch(
                showSnackbar({
                  message:
                    err.response?.data?.message ||
                    "Booking failed. Please try again.",
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
                  name="roomId"
                  type="number"
                  placeholder="Room ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="roomId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <Field
                  name="startDate"
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <Field
                  name="endDate"
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="endDate" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <Field
                  name="numberOfPeople"
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="numberOfPeople" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
