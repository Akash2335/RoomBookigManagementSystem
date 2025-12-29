import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

export const roomSchema = Yup.object({
  roomName: Yup.string()
    .min(3, "Room name must be at least 3 characters")
    .required("Room name is required"),

  capacity: Yup.number()
    .typeError("Capacity must be a number")
    .min(1, "Capacity must be greater than 0")
    .max(100, "Capacity cannot be more than 100") // 🔥 IMPORTANT
    .required("Capacity is required"),
});

export const bookingSchema = Yup.object({
  roomId: Yup.number()
    .typeError("Room is required")
    .required("Room is required"),

  startDate: Yup.date().required("Start date is required"),

  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),

  numberOfPeople: Yup.number()
    .typeError("Number of people must be a number")
    .min(1, "At least one person required")
    .required("Number of people is required"),
});

export const userSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  role: Yup.string()
    .oneOf(["User", "Admin"], "Invalid role")
    .required("Role is required"),
});
