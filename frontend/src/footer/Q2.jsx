import React, { useEffect } from 'react';
import FooterNav from "../components/FooterNav";

export default function Q2() {

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
          <h1 className="text-3xl font-bold font-outfit text-secondary mb-6">Where can I view my tickets?</h1>

          <p className="text-gray-600 mb-8 leading-relaxed">
            There are 2 ways to access your ticket, through your email and event.sari-sari website. We highly suggest that you
            use your current email address that you have access to because all of the information, including your tickets,
            will be sent to that email.
          </p>

          {/* Option 1 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Option 1: On Sari-sari website</h2>
            <div className="space-y-3 text-gray-600">
              <p>1. After registering, open the link to preview the ticket and save the URL of the page.</p>
              <p>2. Remember your ticket code, then go to 'Find My Ticket' and enter the code to search for your ticket.</p>
            </div>
          </div>

          {/* Option 2 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Option 2: Check the confirmation email in your Mailbox</h2>
            <p className="text-gray-600">
              Go to your email inbox and search for the confirmation email from Sari-sari Event. Open the email to view your ticket.
            </p>
          </div>



        </div>
      </main>
    </div>
  );
}