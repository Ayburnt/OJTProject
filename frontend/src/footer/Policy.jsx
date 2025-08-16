// src/components/Policies.jsx
import React from "react";

export default function Policy() {
  return (
    <div className="max-w-6xl mt-10 py-10 mx-auto px-8 bg-primary mb-10 rounded-lg md:px-12 lg:px-15 font-outfit">
      <div className="max-w-5xl space-y-8">
        <h1 className="text-5xl font-semibold text-secondary mb-10">
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
  );
}
