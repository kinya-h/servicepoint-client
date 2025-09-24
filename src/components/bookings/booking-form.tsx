import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import z from "zod";

const bookingSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["customer", "provider"], {
    required_error: "You need to select a role.",
  }),
});

const BookingForm = () => {
  return <div>BookingForm</div>;
};

export default BookingForm;
