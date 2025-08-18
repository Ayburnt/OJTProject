import React from "react";
import FooterNav from "../components/FooterNav";


function Security() {
  return (
    <div className="min-h-screen bg-gray-100 pb-4">
      <FooterNav />

      {/* Main container */}
      <div className="max-w-xl mt-8 md:mt-12 lg:mt-16 py-10 mx-5 md:mx-auto px-5 md:px-10 lg:px-15 bg-primary mb-10 rounded-lg md:max-w-2xl lg:max-w-6xl font-outfit">
        <div className="max-w-5xl space-y-8">
          <h1 className="text-4xl font-semibold text-secondary mb-10 lg:text-5xl md:text-5xl">
          Security Policy
        </h1>

        {/* Section Links */}
        <div id="top" className="space-y-1">
          <a href="#datasecurity" className="block underline text-secondary">
            1. Data Security
          </a>
          <a href="#accesscontrol" className="block underline text-secondary">
            2. Access Control
          </a>
          <a href="#incidentresponse" className="block underline text-secondary">
            3. Incident Response
          </a>
        </div>

        {/* Data Security */}
        <section id="datasecurity">
          <h2 className="text-xl font-semibold mb-2">1. Data Security</h2>
          <p className="text-gray-700 text-sm">
            Our Event Management System uses secure data storage methods and industry-standard encryption to
            protect both organizer and attendee information. Personal data such as event details, payment
            information and user credentials are transmitted over encrypted connections and safely retained
            in secure cloud environments. Only authorized services are permitted to access or process this data.
          </p>
        </section>

        {/* Access Control */}
        <section id="accesscontrol">
          <h2 className="text-xl font-semibold mb-2">2. Access Control</h2>
          <p className="text-gray-700 text-sm">
            Access to organizer dashboards and attendee accounts is restricted using authenticated login
            procedures. Organizers have access only to their own event details, while attendees can only
            access their personal ticket and booking information. Administrative tools within the Event
            Management System are limited to authorized personnel, using role-based permissions to prevent 
            unauthorized changes or data exposure.
          </p>
        </section>

        {/* Incident Response */}
        <section id="incidentresponse">
          <h2 className="text-xl font-semibold mb-2">3. Incident Response</h2>
          <p className="text-gray-700 text-sm">
            In the event that a security issue is detected, we follow a documented incident response process
            which includes immediate containment, investigation and resolution. We notify event organizers
            and affected users if their information is impacted. Our team regularly reviews and updates the
            system to address vulnerabilities and improve protection.
          </p>
        </section>
      </div>
    </div>
    </div>
  );
}
export default Security;
