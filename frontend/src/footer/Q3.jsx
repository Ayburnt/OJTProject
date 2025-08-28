import React from 'react';
import FooterNav from "../components/FooterNav";

export default function SariSariETicketHelp() {
  return (
    <div className="min-h-screen bg-gray-50">
       <FooterNav/>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold font-outfit text-secondary mb-6">How to use E-Ticket?</h1>
          
          {/* Option 1 */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4 leading-relaxed">
              <strong>Option 1:</strong> Show your ticket QR code from your mobile phone for a <strong>superb-fast experience.</strong>
            </p>
            <p className="text-gray-600 mb-4">Show your QR code through the Sari sari application by:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1 ml-4">
              <li>Sign in → Select "Tickets" → Tap on the ticket</li>
            </ul>
            <p className="text-gray-600 mb-6">
              Or find your ticket confirmation email from Sari sari and open the attached PDF file.
            </p>
            <p className="text-gray-600 mb-4">
              Show your QR code to the registration staff to scan and follow further instructions to enter the event.
              This may include waiting a wristband or presenting a valid ID card.
            </p>
          </div>

          {/* Option 2 */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              <strong>Option 2:</strong> Print your ticket/s from your email.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1 ml-4">
              <li>Find your ticket confirmation email from Sari-sari</li>
              <li>Open the attached PDF file</li>
            </ul>
          </div>

          {/* Option 3 */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              <strong>Option 3:</strong> Print your ticket/s from www.Sari sari.com
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1 ml-4">
              <li>Go to www.Sari sari.com and Sign in to your account</li>
              <li>Click on "My Tickets" on the top right corner dropdown menu</li>
              <li>Click on "Your Tickets" and print! Make sure you are connected to a printer</li>
            </ul>
          </div>


          
        </div>
      </main>
    </div>
  );
}