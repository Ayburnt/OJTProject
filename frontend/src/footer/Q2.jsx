import React from 'react';
import FooterNav from "../components/FooterNav";

export default function SariSariHelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FooterNav/>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold font-outfit text-secondary mb-6">Where can I view my tickets?</h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            There are 3 ways to access your ticket, through your email, and Ticketmelon app. We highly suggest that you 
            use your current email address that you have access to because all of the information, including your tickets, 
            will be sent to that email.
          </p>

          {/* Option 1 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Option 1: On Sari-sari website</h2>
            <div className="space-y-3 text-gray-600">
              <p>1. Go to www.sari-sari.com and login to your Sari-sari account. Then, in the drop-down below your profile picture on the top right corner, click on 'My Tickets'.</p>
              <p>2. In the 'Tickets' page, click on the poster of the event or 'View Ticket' to view your tickets.</p>
              <p>3. This is an example of what your ticket looks like.</p>
            </div>
          </div>

          {/* Option 2 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Option 2: Check the confirmation email in your Mailbox</h2>
            <p className="text-gray-600">
              Click the "Go to your Tickets" button to access your ticket! Tickets are also attached to your order confirmation 
              email as a PDF file after you've successfully completed the transaction.
            </p>
          </div>



        </div>
      </main>
    </div>
  );
}