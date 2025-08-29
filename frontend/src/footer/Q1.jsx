import React, { useEffect } from 'react';
import FooterNav from "../components/FooterNav";

const Q1 = () => {

   useEffect(() => {
      document.documentElement.style.scrollBehavior = "smooth";
      return () => {
        document.documentElement.style.scrollBehavior = "auto";
      };
    }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <FooterNav />
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Title */}
          <h1 className="text-2xl font-bold font-outfit text-secondary mb-6">How to buy tickets on Sari-sari?</h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-6">Follow these steps to purchase your tickets:</p>

          {/* Steps */}
          <div className="space-y-4 mb-8">
            <div className="text-gray-800">
              <span className="font-medium">1.</span> Click on the poster, and then press the 'Register' button for the event you would like to attend.
            </div>

            <div className="text-gray-800">
              <span className="font-medium">2.</span> On the checkout page, fill out the form, select the ticket quantity, and click the 'Check Out' button to complete your registration.
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Q1;