import React from 'react';

// Component for the "Where can I view my tickets?" FAQ
const ViewTicketsFAQ = () => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-8 text-gray-800">
      <h2 className="text-2xl lg:text-3xl font-bold font-outfit mb-6">Where can I view my tickets?</h2>
      <p className="mb-4 text-lg text-gray-700">
        There are 3 ways to access your ticket, through your email, and Ticketmelon app. We highly suggest that you use your current email address that you have access to because all of the information, including your tickets, will be sent to that email.
      </p>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Option 1: On Sari-sari website</h3>
          <ol className="list-decimal list-inside space-y-2 text-base text-gray-700">
            <li>Go to <a href="http://www.sari-sari.com" className="text-teal-500 hover:text-teal-600">www.sari-sari.com</a> and login to your Sari-sari account. Then, in the drop-down below your profile picture on the top right corner, click on ‘My Tickets’.</li>
            <li>In the ‘Tickets’ page, click on the poster of the event or ‘View Ticket’ to view your tickets.</li>
            <li>This is an example of what your ticket looks like.</li>
          </ol>
        </div>

        <div>
          <h3 className="text-xl font-outfit font-bold mb-2">Option 2: Check the confirmation email in your Mailbox.</h3>
          <p className="text-base text-gray-700">
            Click the “Go to your Tickets” button to access your ticket! Tickets are also attached to your order confirmation email as a PDF file after you’ve successfully completed the transaction.
          </p>
        </div>

        
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 antialiased text-gray-800 flex flex-col p-4">
      <main className="w-full mx-auto">
        <ViewTicketsFAQ />
      </main>
    </div>
  );
};

export default App;
