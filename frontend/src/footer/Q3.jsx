import React, { useEffect } from 'react';
import FooterNav from "../components/FooterNav";

export default function Q3() {

   useEffect(() => {
      document.documentElement.style.scrollBehavior = "smooth";
      return () => {
        document.documentElement.style.scrollBehavior = "auto";
      };
    }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <FooterNav />
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold font-outfit text-secondary mb-6">How to use E-Ticket?</h1>

          {/* Option 1 */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4 leading-relaxed">
              <strong>Option 1:</strong> Show your ticket QR code from your mobile phone to the Organizer.
            </p>
            <p className="text-gray-600 mb-4">Show your QR code through the Event Sari-sari web application by:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1 ml-4">
              <li>go to find my ticket → input "Ticket Code" → Tap on the ticket</li>
              <li>or go to the save url to view ticket information.</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Show your QR code to the registration staff to scan and follow further instructions to enter the event.
            </p>
          </div>

          {/* Option 2 */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              <strong>Option 2:</strong> Show your Qr code through email.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1 ml-4">
              <li> Go to your email → Open the ticket confirmation email from Event Sari-sari → Tap 'View Ticket'. </li>
            </ul>
            <p className="text-gray-600 mb-4">
              Show your QR code to the registration staff to scan and follow further instructions to enter the event.
            </p>
          </div>

          {/* Option 3 */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              <strong>Option 3:</strong> Print your ticket(s) from the Event Sari-sari web application or from the confirmation email.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1 ml-4">
              <p className="text-gray-600 mb-4">
                You can print your ticket by following these steps in the Event Sari-sari web application:
              </p>
              <li>Go to the Event Sari-sari home page and select 'Find My Tickets'.</li>
              <li>Enter the ticket code to find your ticket.</li>
              <li>Click 'Next' to view the ticket details. Make sure your device is connected to a printer before printing your ticket.</li>
            </ul>

            <p className="text-gray-600 mb-4">
              Or, you can print your ticket from the confirmation email by:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1 ml-4">
              <li>Open the ticket confirmation email from Event Sari sari.</li>
              <li> View your ticket details.</li>
              <li>Make sure your device is connected to a printer before printing your ticket.</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Present the printed ticket to the registration staff for scanning and follow further instructions to enter the event.
            </p>

          </div>



        </div>
      </main>
    </div>
  );
}