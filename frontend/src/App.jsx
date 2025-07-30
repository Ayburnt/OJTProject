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

function App() {
  const location = useLocation(); // Get the current location object

  // Determine if the header should be shown
  const showHeader = location.pathname !== '/login' && location.pathname !== '/signup';

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
        </Routes>
      </main>

      {/* Footer can remain outside if it's always present */}
      <Footer />
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
