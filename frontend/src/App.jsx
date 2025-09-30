import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import SignUp from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import HeroSection from './components/HeroSection';
import RecommendedEvents from './components/RecommendedEvents';
import OrganizersList from './components/OrganizersList'
import CategoriesList from './components/CategoriesList'
import CallToActionSection from './components/CallToActionSection';
import Footer from './components/Footer';
import EventDetailPage from './pages/EventDetailPage';
import ViewAllEventsPage from './pages/ViewAllEventsPage';
import ViewEventByCategory from './pages/ViewEventByCategory'
import OrganizerDashboard from './pages/OrganizerDashboard';
import ForgotPass from './pages/ForgotPass.jsx';
import OrganizerEvent from './pages/OrganizerEvent.jsx';
import FindMyTicket from './pages/FindmyTicket.jsx';
import Attendees from './pages/Attendees.jsx';
import TimeLine from './pages/TimeLine.jsx';
import ManageAccount from './pages/ManageAccount.jsx';
import CreateEvent from './pages/CreateEvent.jsx';
import VerificationForm from './pages/VerificationForm.jsx';
import AttendeesDashboard from './pages/AttendeesDashboard.jsx'; 
import AdminDashboard from './pages/AdminDashboard.jsx'; 
import AdminEventControl from './pages/AdminEventControl.jsx'; 
import AdminReviewPage from './pages/AdminReviewPage.jsx';
import AdminAttendees from './pages/AdminAttendees.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import EditEvent from './pages/EditEvent.jsx';
import BuyTicket from './pages/BuyTicket.jsx';
import PrivateRoute from './hooks/protectedRoute.jsx';
import BookingConfirmation from './pages/BookingConfirmation.jsx';
import TransactionConfirmation from './pages/TransactionConfirmation.jsx';
import StaffDashboard from './pages/StaffDashboard.jsx';
import StaffManageAccount from './pages/StaffManageAccount.jsx';
import ViewAllOrganizersPage from './pages/ViewAllOrganizersPage.jsx';

import Q1 from './footer/Q1.jsx';
import Q2 from './footer/Q2.jsx';
import Q3 from './footer/Q3.jsx';
import HelpCenter from './footer/HelpCenter.jsx';
import CustomerSupport from './footer/CustomerSupport.jsx';
import Pricing from './footer/Pricing.jsx';
import ContactUs from './footer/ContactUs.jsx';
import Term from './footer/Term.jsx';
import Policy from './footer/Policy.jsx';
import Security from './footer/Security.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    '/admin-eventcontrol',
    '/admin-review',
    '/change-password',
    '/admin-attendees',

    '/q1',
    '/q2',
    '/q3',
    '/help-center',
     '/customer-support',
    '/pricing',
    '/contact-us',
    '/term',
    '/policy',
    '/security',  
    '/attendee',
    '/staff',
    '/staff/account',
    '/user/account'
  ];

  // A helper function to check if the current path is in the excluded list
  const isPathExcluded = (path) => {
    // Check if the path starts with a dynamic route or is an exact match
    return (
      path.startsWith('/org/') || // Checks for paths like '/organizer/TAN07'
      path.startsWith('/attendee/') || // for booking confirmation dynamic route
      path.startsWith('/transaction/') ||
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
                <OrganizersList />
                <CategoriesList />
                <CallToActionSection />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} /> 
          <Route path="/Events" element={<ViewAllEventsPage />} />
          <Route path="/organizers" element={<ViewAllOrganizersPage />} />
          <Route path="/:category/events" element={<ViewEventByCategory />} />
          <Route path="/events/:eventcode" element={<EventDetailPage />} /> 
          <Route path='/org/:userCode/dashboard' element={<PrivateRoute requiredRole={'organizer'}><OrganizerDashboard /></PrivateRoute>} />
          <Route path='/org/dashboard' element={<PrivateRoute requiredRole={'co-organizer'}><OrganizerDashboard /></PrivateRoute>} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path='/org/:userCode/my-event' element={<PrivateRoute requiredRole={'organizer'}><OrganizerEvent /></PrivateRoute>} />
          <Route path='/org/my-event' element={<PrivateRoute requiredRole={'co-organizer'}><OrganizerEvent /></PrivateRoute>} />
          {/* <Route path='/org/:userCode/attendees' element={<PrivateRoute requiredRole={'organizer'}><Attendees /></PrivateRoute>} /> */}
          <Route path="/find-my-ticket" element={<FindMyTicket />} />
          <Route path="/org/:userCode" element={<TimeLine />} />
          {/* <Route path="/attendees" element={<Attendees />} />*/}
          <Route path='/org/:userCode/account' element={<PrivateRoute requiredRole={'organizer'}><ManageAccount /></PrivateRoute>} />
          
          <Route path='/user/account' element={<PrivateRoute requiredRole={'user'}><ManageAccount /></PrivateRoute>} />
          <Route path='/change-password' element={<ChangePassword />} />
          <Route path='/org/:userCode/create-event' element={<PrivateRoute requiredRole={'organizer'}><CreateEvent /></PrivateRoute>} />
          <Route path='/org/create-event' element={<PrivateRoute requiredRole={'co-organizer'}><CreateEvent /></PrivateRoute>} />
          <Route path='/org/edit/:eventcode' element={<EditEvent />}/>
          <Route path="/staff" element={<PrivateRoute requiredRole={'staff'}><StaffDashboard /></PrivateRoute>} /> 
          <Route path="/staff/account" element={<PrivateRoute requiredRole={'staff'}><StaffManageAccount /></PrivateRoute>} /> 
          <Route path="/org/account" element={<PrivateRoute requiredRole={'co-organizer'}><StaffManageAccount /></PrivateRoute>} /> 
          <Route path='/events/:eventcode/checkout' element={<BuyTicket />} />

          {/* <Route path='/create-event' element={<CreateEvent />} /> */}
          <Route path='/org/:userCode/verification-form' element={<PrivateRoute requiredRole={'organizer'}><VerificationForm /></PrivateRoute>} />
          {/* <Route path="/verification-form" element={<VerificationForm />} /> */}
          <Route path="/attendees-dashboard" element={<AttendeesDashboard />} /> 
          <Route path='/admin-dashboard' element={<PrivateRoute requiredRole={'admin'}><AdminDashboard /></PrivateRoute>} /> 
          <Route path='/admin-eventcontrol' element={<PrivateRoute requiredRole={'admin'}><AdminEventControl /></PrivateRoute>} /> 
          <Route path='/admin-review' element={<PrivateRoute requiredRole={'admin'}><AdminReviewPage /></PrivateRoute>} /> 
          <Route path="/attendees/:eventcode" element={<PrivateRoute requiredRole={'admin'}><AdminAttendees /></PrivateRoute>} />           
          <Route path="/attendee/:attendeeCode" element={<BookingConfirmation />} /> 
          <Route path="/transaction/:transactCode" element={<TransactionConfirmation />} /> 

          <Route path="/q1" element={<Q1 />} />
          <Route path="/q2" element={<Q2 />} />
          <Route path="/q3" element={<Q3 />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/customer-support" element={<CustomerSupport />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/term" element={<Term />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/security" element={<Security />} />          


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
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
      <App />
    </Router>
  );
}

export default RootApp;
