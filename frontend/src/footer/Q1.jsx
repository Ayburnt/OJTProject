import React from 'react';

// Component for the new FAQ section
const TicketmelonFAQ = () => {
  const steps = [
    "Sign up or sign in to your Sari-sari account with either Facebook or email registration. Click on the poster or the 'Get Tickets' button of the event you would like to attend.",
    "On the event page, select your ticket quantity and click on the 'Buy Tickets' button.",
    "On the check-out page. Select your preferred payment method (card or cash) and fill in the required information. Choose the answer to protect your ticket (Click Here for more information about Refund Protect)",
    "Review all the prices. Then, click on the checkbox next to “I agree to Ticketmelon's Terms of Service and Event Organizer's Agreement”, and click the ’Pay Now’ button."
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-8 text-gray-800">
      <h2 className="text-2xl lg:text-3xl font-bold font-outfit mb-6">How to buy tickets on Sari-sari?</h2>
      <ol className="list-decimal list-inside space-y-4 text-lg text-gray-700">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      <p className="mt-6 text-base italic text-gray-600">
        If you wish to pay using cash, please print the payment slip to the selected payment channel as their system may not support scanning directly from the mobile phone screen.
      </p>
      <p className="mt-6 text-sm font-bold text-gray-700">
        Important: To prevent theft, please do not reveal your ticket to anyone other than the gate agent (the person scanning your tickets at event entry) prior to validation. Ticketmelon will not be responsible for any damages arising from damaged tickets, ticket theft and/or losses.
      </p>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 antialiased text-gray-800 flex flex-col p-4">
      <main className="w-full mx-auto">
        <TicketmelonFAQ />
      </main>
    </div>
  );
};

export default App;
