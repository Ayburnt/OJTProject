import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";

const FindMyTicket = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleNextClick = async () => {
    if (!email) {
      alert('Please enter your email address.');
      return;
    }
    
    setIsLoading(true);
    // Simulate an API call
    try {
      console.log(`Looking up tickets for: ${email}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Ticket found!');
    } catch (error) {
      console.error('Failed to find ticket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDontKnowClick = () => {
    alert("This would typically redirect to a help page or a different flow.");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Header component */}
 <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between border-b border-gray-200">
  {/* Left section: logo and Help Center */}
  <div className="flex items-center space-x-3">
    <img src="/sariLogo.png" alt="Sari-Sari Events Logo" className="h-8 w-auto" />
    <span className="text-gray-900 text-base sm:text-lg font-medium">Help Center</span>
  </div>

  {/* Right section: Log In link */}
  <a
    href="/login"
    className="text-sm text-gray-700 hover:text-secondary font-medium transition-colors duration-200">
    Log In
  </a>
</header>

      {/* Main content container */}
      <div className="flex items-center justify-center py-16 px-4">
        <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 hover:scale-[1.01]">
        
            <div className="flex items-center gap-1 mb-6 cursor-pointer" onClick={() => window.history.back()}>
            <IoIosArrowBack className="text-secondary text-xl" />
            <span className="text-secondary text-sm font-medium font-outfit">Back to home</span>
          </div>
            
            <div className="flex justify-center mb-6">
            <img src="/sariLogo.png" alt="Sari-Sari Events Logo" className="h-auto max-h-16" />
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-800">Find Tickets</h1>
            <p className="text-gray-500 mt-2 text-lg">Look up your ticket order with your email</p>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            <div className="relative">
              <label 
                htmlFor="email" 
                className="absolute -top-3 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="e.g., yourname@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Buttons Section */}
          <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleNextClick}
              disabled={isLoading}
              className={`w-full sm:w-1/2 py-3 px-6 rounded-lg text-white font-bold tracking-wide transition-all duration-200 transform ${
                isLoading 
                  ? 'bg-secondary cursor-not-allowed' 
                  : 'bg-secondary hover:bg-secondary-700 hover:scale-105 shadow-md'
              }`}
            >
              {isLoading ? 'Searching...' : 'Next'}
            </button>
            <button
              onClick={handleDontKnowClick}
              className="w-full sm:w-1/2 py-3 px-6 rounded-lg text-gray-600 font-bold tracking-wide bg-gray-100 hover:bg-gray-200 transition-colors duration-200 border border-gray-300 shadow-sm"
            >
              I don't know
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMyTicket;