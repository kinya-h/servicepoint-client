import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import AppLayout from "./AppLayout";
import LoginPage from "./pages/Login";
import BookServicePage from "./pages/book/BookService";
import RegisterPage from "./pages/Register";
import DashboardPage from "./pages/dashboard/page";
import BookingsPage from "./pages/bookings/page";
import SubmitFeedbackPage from "./pages/feedback/page";
import ProfilePage from "./pages/profile/page";
import HomePage from "./pages/home/page";
import ProviderDashboardPage from "./pages/provider/page";
import ManageServicesPage from "./pages/services/page";
import ProviderBookingsPage from "./pages/provider-bookings/page";
import NearbyProvidersSearch from "./pages/search-results/page";
import ProviderProfilePage from "./pages/providers/ProviderDetails";
import NewBooking from "./pages/bookings/NewBooking";
import UserBookingsFeedbackPage from "./pages/feedback/UserBookingsFeedbackPage";
import SettingsPage from "./pages/settings/page";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/main/book/:serviceId" element={<BookServicePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/dashboard/provider" element={<ProviderDashboardPage />} />
        <Route path="/dashboard/bookings" element={<BookingsPage />} />
        <Route
          path="/dashboard/bookings/user-feedback"
          element={<UserBookingsFeedbackPage />}
        />
        <Route path="/dashboard/bookings/new" element={<NewBooking />} />
        <Route path="/dashboard/services" element={<ManageServicesPage />} />
        <Route
          path="/dashboard/feedback/new"
          element={<SubmitFeedbackPage />}
        />
        <Route path="/search-results" element={<NearbyProvidersSearch />} />
        <Route path="/book/:serviceId" element={<BookServicePage />} />
        <Route
          path="/providers/:providerId"
          element={<ProviderProfilePage />}
        />

        <Route
          path="/dashboard/provider-bookings"
          element={<ProviderBookingsPage />}
        />
        <Route
          path="/dashboard/feedback/new"
          element={<SubmitFeedbackPage />}
        />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        {/* <Route index element={<Home />} /> */}
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
