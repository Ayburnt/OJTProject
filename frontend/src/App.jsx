import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import SignUp from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import HeroSection from './components/HeroSection';
import RecommendedEvents from './components/RecommendedEvents';
import CallToActionSection from './components/CallToActionSection';
import Footer from './components/Footer';
import EventDetailPage from './pages/EventDetailPage';
import ViewAllEventsPage from './pages/ViewAllEventsPage';
import OrganizerDashboard from './pages/OrganizerDashboard';
import ForgotPass from './pages/ForgotPass.jsx';
import OrganizerEvent from './pages/OrganizerEvent.jsx';
import FindMyTicket from './pages/FindmyTicket.jsx';
import Attendees from './pages/Attendees.jsx';
import ManageAccount from './pages/ManageAccount.jsx';
import CreateEvent from './pages/CreateEvent.jsx';
import VerificationForm from './pages/VerificationForm.jsx';
import AttendeesDashboard from './pages/AttendeesDashboard.jsx'; 
import AdminDashboard from './pages/AdminDashboard.jsx'; 
import AdminEventControl from './pages/AdminEventControl.jsx'; 
import PrivateRoute from './hooks/protectedRoute.jsx';

// A component that wraps the main App logic
function App() {
  const location = useLocation();

  // Define an array of paths where the header and footer should not be shown.
  // Use startsWith() for dynamic paths like /organizer/:userCode.
  const excludedPaths = [
    '/login',
    '/signup',
    '/forgot-password',
    '/my-event',
    '/find-my-ticket',
    '/attendees',
    '/manage-account',
    '/create-event',
    '/verification-form',
    '/attendees-dashboard',
    '/admin-dashboard',
    '/admin-eventcontrol'
  ];

  // A helper function to check if the current path is in the excluded list
  const isPathExcluded = (path) => {
    // Check if the path starts with a dynamic route or is an exact match
    return (
      path.startsWith('/org/') || // Checks for paths like '/organizer/TAN07'
      excludedPaths.includes(path)
    );
  };

  const showHeader = !isPathExcluded(location.pathname);
  const showFooter = !isPathExcluded(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased flex flex-col text-gray-800">
      {/* Conditionally render the Header */}
      {showHeader && <Header />}

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <RecommendedEvents />
                <CallToActionSection />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} /> 
          <Route path="/Events" element={<ViewAllEventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} /> 
          <Route path='/org/:userCode' element={<PrivateRoute requiredRole={'organizer'}><OrganizerDashboard /></PrivateRoute>} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path='/org/:userCode/my-event' element={<PrivateRoute requiredRole={'organizer'}><OrganizerEvent /></PrivateRoute>} />
          <Route path='/org/:userCode/attendees' element={<PrivateRoute requiredRole={'organizer'}><Attendees /></PrivateRoute>} />
          <Route path="/find-my-ticket" element={<FindMyTicket />} />
          {/* <Route path="/attendees" element={<Attendees />} />*/}
          <Route path='/org/:userCode/account' element={<PrivateRoute requiredRole={'organizer'}><ManageAccount /></PrivateRoute>} />
          <Route path="/manage-account" element={<ManageAccount />} />
          <Route path='/create-event' element={<CreateEvent />} />
          <Route path="/verification-form" element={<VerificationForm />} />
          <Route path="/attendees-dashboard" element={<AttendeesDashboard />} /> 
          <Route path='/admin-dashboard' element={<AdminDashboard />} /> 
          <Route path='/admin-eventcontrol' element={<AdminEventControl />} /> 
        </Routes>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

// Wrap App with Router for useLocation to work correctly
function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default RootApp;
