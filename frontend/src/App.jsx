import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
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


function App() {
  const location = useLocation(); // Get the current location object

  // Determine if the header should be shown
  const showHeader = location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/organizer-dashboard' && location.pathname !=='/forgot-password' && location.pathname !=='/my-event' && location.pathname !=='/find-my-ticket' && location.pathname !=='/attendees' && location.pathname !=='/manage-account' && location.pathname !=='/create-event' && location.pathname !=='/verification-form' && location.pathname !=='/attendees-dashboard'  && location.pathname !=='/admin-dashboard';
  const showFooter = location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/organizer-dashboard' && location.pathname !=='/forgot-password' && location.pathname !=='/my-event' && location.pathname !=='/find-my-ticket' && location.pathname !=='/attendees' && location.pathname !=='/manage-account' && location.pathname !=='/create-event' && location.pathname !=='/verification-form' && location.pathname !=='/attendees-dashboard' && location.pathname !=='/admin-dashboard';

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
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/my-event" element={<OrganizerEvent />} />
          <Route path="/find-my-ticket" element={<FindMyTicket />} />
          <Route path="/attendees" element={<Attendees />} />
          <Route path="/manage-account" element={<ManageAccount />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/verification-form" element={<VerificationForm />} />
          <Route path="/attendees-dashboard" element={<AttendeesDashboard />} /> 
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> 

          {/* Add more routes as needed */}
        </Routes>
      </main>

      {/* Footer can remain outside if it's always present */}
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
