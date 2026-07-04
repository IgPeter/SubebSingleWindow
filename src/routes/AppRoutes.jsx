import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import SportsLayout from "../components/sports/SportsLayout";
import SportsHome from "../components/sports/SportsHome";
import RegistrationForm from "../components/sports/RegistrationForm";
import SummaryPage from "../components/sports/SummaryPage";
import RegistrationLookup from "../components/sports/RegistrationLookup";
import SportsAdminDashboard from "../components/sports/SportsAdminDashboard";
import SignIn from "../pages/auth/signin";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<SignIn />} />

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/home" />} />
      {/* Sport routes*/}

      <Route path="/sports" element={<SportsLayout />}>
        <Route index element={<SportsHome />} />
        {/*<Route path="events" element={<UpcomingEventsPage />} />{" "}*/}
        {/* create this */}
        <Route path="events/:id/register" element={<RegistrationForm />} />
        <Route path="events/:id/register/summary" element={<SummaryPage />} />
        <Route path="registration/summary" element={<SummaryPage />} />
        <Route path="lookup" element={<RegistrationLookup />} />
        <Route path="admin" element={<SportsAdminDashboard />} />
        {/*<Route path="gallery" element={<GalleryPage />} />*/}
        {/*<Route path="my-registrations" element={<MyRegistrationsPage />} />*/}
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
