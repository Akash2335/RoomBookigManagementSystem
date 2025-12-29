import { Formik, Form, Field, ErrorMessage } from "formik";
import { userSchema } from "../../validation/schemas";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../app/snackbarSlice";
import { Helmet } from "react-helmet-async";
import { sendWelcomeEmail } from "../../utils/email";
import { useState } from "react";

export default function CreateUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [useSuggestion, setUseSuggestion] = useState(false);

  const generatePasswordSuggestion = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  return (
    <>
      <Helmet>
        <title>Create User | Room Booking System</title>
        <meta name="description" content="Admin create user page" />
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
            Create User
          </h2>

          <Formik
            initialValues={{ name: "", email: "", password: "", role: "User" }}
            validationSchema={userSchema}
            onSubmit={async (values, { setSubmitting, setFieldValue }) => {
              try {
                await api.post("/auth/create-user", values);

                // Send welcome email after successful user creation
                try {
                  await sendWelcomeEmail(values.email, values.password);
                  dispatch(
                    showSnackbar({
                      message:
                        "User created successfully and welcome email sent",
                      severity: "success",
                    })
                  );
                } catch (emailError) {
                  dispatch(
                    showSnackbar({
                      message:
                        "User created successfully, but failed to send welcome email",
                      severity: "warning",
                    })
                  );
                }

                navigate("/admin/dashboard");
              } catch (err: any) {
                dispatch(
                  showSnackbar({
                    message:
                      err.response?.data?.message || "Failed to create user",
                    severity: "error",
                  })
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
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
                            setFieldValue("password", suggestion);
                          } else {
                            setFieldValue("password", "");
                          }
                        }}
                        className="mr-2"
                      />
                      Use password suggestion
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <Field
                    as="select"
                    id="role"
                    name="role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create User"}
                </button>

                {/* Display the password for admin to copy only if showPassword is true */}
                {values.password && showPassword && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <strong>Password:</strong> {values.password}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Copy this password to provide to the user.
                    </p>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
