import React from 'react';
import FooterNav from "../components/FooterNav";

const Q1 = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <FooterNav/>
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
              <span className="font-medium">1.</span> Sign up or sign in to your Sari-sari account with either Facebook or email registration. Click on the poster or the 'Get Tickets' button of the event you would like to attend.
            </div>

            <div className="text-gray-800">
              <span className="font-medium">2.</span> On the event page, select your ticket quantity and click on the 'Buy Tickets' button.
            </div>

            <div className="text-gray-800">
              <span className="font-medium">3.</span> On the check-out page, select your preferred payment method (card or cash) and fill in the required information. Choose the answer to protect your ticket.
            </div>

            <div className="text-gray-800">
              <span className="font-medium">4.</span> Review all the prices. Then, click on the checkbox next to "I agree to Ticketmelon's Terms of Service and Event Organizer's Agreement", and click the 'Pay Now' button.
            </div>
          </div>

          {/* Cash Payment Note */}
          <div className="text-gray-700 mb-8">
            If you wish to pay using cash, please print the payment slip to the selected payment channel as their system may not support scanning directly from the mobile phone screen.
          </div>

        </div>
      </div>
    </div>
  );
};

export default Q1;