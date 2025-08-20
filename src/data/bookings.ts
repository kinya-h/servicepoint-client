import type { Booking, MockBookingDetails } from "../types/booking";

export const mockBookings: Booking[] = [
    {
        id: "b1",
        customerId: "u1",
        providerId: "p1",
        serviceId: "s1",
        bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        serviceDateTime: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000
        ).toISOString(), // 3 days ago
        status: "completed",
        notes: "Leaky faucet in kitchen.",
        priceAtBooking: 150,
        pricingTypeAtBooking: "per_work",
      },
      {
        id: "b2",
        customerId: "u1",
        providerId: "p2",
        serviceId: "s3",
        bookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        serviceDateTime: new Date(
          Date.now() + 2 * 24 * 60 * 60 * 1000
        ).toISOString(), // In 2 days
        status: "confirmed",
        notes: "Standard weekly cleaning.",
        priceAtBooking: 30,
        pricingTypeAtBooking: "hourly",
      },
      {
        id: "b3",
        customerId: "u1",
        providerId: "p3",
        serviceId: "s_tutoring",
        bookingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        serviceDateTime: new Date(
          Date.now() - 8 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: "cancelled",
        priceAtBooking: 50,
        pricingTypeAtBooking: "hourly",
      },
    ];
  

export const mockBookingDetails: MockBookingDetails = {
        b1: {
          id: "b1",
          serviceId: "s1",
          providerId: "p1",
          serviceName: "Emergency Pipe Repair",
          providerName: "John's Plumbing",
        },
      };
    