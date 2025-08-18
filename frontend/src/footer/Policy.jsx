import React from "react";
import FooterNav from "../components/FooterNav";

function Policy() {
  return (
    <div className="min-h-screen bg-gray-100 pb-4">
      <FooterNav />

      {/* Main container */}
      <div className="max-w-xl mt-8 md:mt-12 lg:mt-16 py-10 mx-5 md:mx-auto px-5 md:px-10 lg:px-15 bg-primary mb-10 rounded-lg md:max-w-2xl lg:max-w-6xl font-outfit">
        <div className="max-w-5xl space-y-8">
          <h1 className="text-4xl font-semibold text-secondary mb-10 lg:text-5xl md:text-5xl">
          Policy
        </h1>

        {/* Section Links */}
        <div id="top" className="space-y-1">
          <a href="#privacy" className="block underline text-secondary">
            1. Privacy Policy
          </a>
          <a href="#refund" className="block underline text-secondary">
            2. Refund Policy
          </a>
          <a href="#dataprotection" className="block underline text-secondary">
            3. Data Protection Policy
          </a>
        </div>

        {/* Privacy Policy */}
        <section id="privacy">
          <h2 className="text-xl font-semibold mb-2">
            1. Privacy Policy
          </h2>
          <p className="text-gray-700 text-sm">
            We are committed to protecting your privacy and handling your data in an open and transparent manner. 
            Any personal information you provide while using the platform will only be used for the purpose of 
            providing our services, communicating with you about your account or events, and complying with 
            applicable regulations.
          </p>
        </section>

        {/* Refund Policy */}
        <section id="refund">
          <h2 className="text-xl font-semibold mb-2">
            2. Refund Policy
          </h2>
          <p className="text-gray-700 text-sm">
            Refunds are issued only if an event is cancelled or significantly changed by the organizer. Any 
            refund request must be submitted to the event organizer and will be processed in accordance with the 
            organizer’s stated refund policy. The platform does not issue refunds directly unless otherwise stated.
          </p>
        </section>

        {/* Data Protection Policy */}
        <section id="dataprotection">
          <h2 className="text-xl font-semibold mb-2">
            3. Data Protection Policy
          </h2>
          <p className="text-gray-700 text-sm">
            We comply with all applicable data protection laws in the collection, processing, and retention of 
            personal data. We take appropriate technical and organizational measures to safeguard your information, 
            and we will not share your data with third parties without your consent unless required by law.
          </p>
        </section>
      </div>
    </div>
    </div>
  );
}

export default Policy;
