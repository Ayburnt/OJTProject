import React from 'react';

// Component for "How to enter the event using E-Ticket?" FAQ
const EnterEventFAQ = () => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-8 text-gray-800">
      <h2 className="text-2xl lg:text-3xl font-bold font-outfit mb-6">How to enter the event using E-Ticket?</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Option 1: Show your ticket (QR code) from your mobile phone for a paperless ticket experience.</h3>
          <p className="text-base text-gray-700 mb-2">
            Show your QR code through the Sari-sari application by:
          </p>
          <ul className="list-disc list-inside space-y-1 text-base text-gray-700">
            <li>Sign in {'>'} Select ‘Tickets’ {'>'} Tap on the event poster</li>
          </ul>
          <p className="text-base text-gray-700 mt-2">
            Or Find your ticket confirmation email from Sari-sari and open the attached PDF file.
          </p>
          <p className="text-base text-gray-700 mt-2">
            Show your QR code to the organizer staff to scan and follow further instructions to enter the event. This may include wearing a wristband or presenting a valid ID card.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Option 2: Print your ticket(s) from your email.</h3>
          <ul className="list-disc list-inside space-y-1 text-base text-gray-700">
            <li>Find your ticket confirmation email from Ticketmelon</li>
            <li>Open the attached PDF file</li>
            <li>Print your ticket(s)</li>
          </ul>
          <p className="text-base text-gray-700 mt-2">
            Show the printed ticket to the organizer staff to scan and follow further instructions to enter the event. This may include wearing a wristband or presenting a valid ID card.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Option 3: Print your ticket(s) from <a href="http://www.Sari-sari.com" className="text-teal-500 hover:text-teal-600">www.Sari-sari.com</a></h3>
          <ul className="list-disc list-inside space-y-1 text-base text-gray-700">
            <li>Go to <a href="http://www.Sari-sari.com" className="text-teal-500 hover:text-teal-600">www.Sari-sari.com</a> and sign in to your account</li>
            <li>Go to the 'Tickets' page and click on your desired event.</li>
            <li>Click on 'Print Tickets' and print! Make sure you are connected to a printer.</li>
          </ul>
          <p className="text-base text-gray-700 mt-2">
            Show the printed ticket to the organizer staff to scan and follow further instructions to enter the event. This may include wearing a wristband or presenting a valid ID card.
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
        <EnterEventFAQ />
      </main>
    </div>
  );
};

export default App;
