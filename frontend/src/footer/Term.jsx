import React from "react";
import FooterNav from "../components/FooterNav";

function Term() {
  return (
    <div className="min-h-screen bg-gray-100 pb-4">
      <FooterNav />

      {/* Main container */}
      <div className="max-w-xl mt-8 md:mt-12 lg:mt-16 py-10 mx-5 md:mx-auto px-5 md:px-10 lg:px-15 bg-primary mb-10 rounded-lg md:max-w-2xl lg:max-w-6xl font-outfit">
        <div className="max-w-5xl space-y-8">
          <h1 className="text-4xl font-semibold text-secondary mb-10 lg:text-5xl md:text-5xl">
            Terms & Conditions
          </h1>

          {/* Section Links */}
          <div id="top" className="space-y-1">
            <a href="#section1" className="block underline text-secondary">
              1. Account Registration and Accuracy of Information
            </a>
            <a href="#section2" className="block underline text-secondary">
              2. Event Organizer Duties and Compliance
            </a>
            <a href="#section3" className="block underline text-secondary">
              3. Ticketing and Refund Policy
            </a>
            <a href="#section4" className="block underline text-secondary">
              4. Prohibited Use
            </a>
            <a href="#section5" className="block underline text-secondary">
              5. Intellectual Property
            </a>
            <a href="#section6" className="block underline text-secondary">
              6. Acceptance of Terms
            </a>
          </div>

          {/* Section Content */}
          <section id="section1">
            <h2 className="text-xl font-semibold mb-2">
              1. Account Registration and Accuracy of Information
            </h2>
            <p className="text-gray-700 text-sm">
              Users are required to create an account in order to access and utilize the event
              management services. You agree that all information provided during registration and
              throughout your use of the platform shall be true, accurate, current, and complete.
              You further acknowledge that it is your responsibility to update such information
              promptly in the event of any changes. The Company shall not be liable for any loss or
              damage arising from inaccurate or incomplete information provided by you.
            </p>
          </section>

          <section id="section2">
            <h2 className="text-xl font-semibold mb-2">
              2. Event Organizer Duties and Compliance
            </h2>
            <p className="text-gray-700 text-sm">
              Event organizers are solely responsible for ensuring that their events comply with all
              applicable laws, regulations, and licensing requirements. This includes, but is not limited
              to, securing the necessary permits, providing accurate event descriptions, and taking all
              reasonable measures to ensure participant safety. The Company acts only as a facilitator
              of event listings and ticket sales and shall bear no responsibility for the conduct or
              organization of any event.
            </p>
          </section>

          <section id="section3">
            <h2 className="text-xl font-semibold mb-2">
              3. Ticketing and Refund Policy
            </h2>
            <p className="text-gray-700 text-sm">
              All ticket sales completed through the platform are final unless otherwise stated by the
              event organizer. In the event of cancellation or postponement of an event, the organizer
              shall be solely responsible for issuing refunds in accordance with their stated policies
              and applicable law. The Company may, at its sole discretion, provide reasonable assistance
              regarding communications with attendees but shall bear no obligation to issue refunds itself.
            </p>
          </section>

          <section id="section4">
            <h2 className="text-xl font-semibold mb-2">4. Prohibited Use</h2>
            <p className="text-gray-700 text-sm">
              You agree not to use the platform for any unlawful, fraudulent, or abusive purpose, including
              the distribution of false or misleading information or the transmission of malicious software.
              You further agree not to interfere with or disrupt the operation of the platform or engage in
              any activity that may compromise the security or integrity of the platform, its systems, or the
              data of other users.
            </p>
          </section>

          <section id="section5">
            <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
            <p className="text-gray-700 text-sm">
              All intellectual property rights in and to the platform and its content, other than user-submitted
              material, are owned by or licensed to the Company. Users retain ownership of their own submitted
              content, but grant the Company a non-exclusive, worldwide, royalty-free license to use, display,
              and process such content solely for the purpose of providing the event management services.
            </p>
          </section>

          <section id="section6">
            <h2 className="text-xl font-semibold mb-2">6. Acceptance of Terms</h2>
            <p className="text-gray-700 text-sm">
              By accessing or using the platform, you acknowledge that you have read, understood, and agree to
              be bound by these Terms and Conditions. If you do not agree to any part of these Terms, you must
              discontinue your use of the platform immediately.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Term;
