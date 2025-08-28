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
            Terms & Condition
          </h1>

          {/* Section Links */}
          <div id="top" className="space-y-1">
            <a href="#section1" className="block underline text-secondary">
              1. General Terms and Conditions
            </a>
            <a href="#section2" className="block underline text-secondary">
              2. Rights and Responsibilities of Users (Attendees)
            </a>
            <a href="#section3" className="block underline text-secondary">
              3. Rights and Responsibilities of Organizers
            </a>
            <a href="#section4" className="block underline text-secondary">
              4. Limitation of Liability
            </a>
            <a href="#section5" className="block underline text-secondary">
              5. Third-Party Links
            </a>
            <a href="#section6" className="block underline text-secondary">
              6. Privacy
            </a>
            <a href="#section7" className="block underline text-secondary">
              7. Company Rights
            </a>
            <a href="#section8" className="block underline text-secondary">
              8. Safety
            </a>
            <a href="#section9" className="block underline text-secondary">
              9. Miscellaneous
            </a>
          </div>

          {/* Section Content */}
          <section id="section1">
            <h2 className="text-xl font-semibold mb-2">
              1. General Terms and Conditions
            </h2>
            <p className="text-gray-700 text-sm">
              Event Sari-Sari operates www.event.sari-sari.com (“the website”) to provide digital
              ticketing solutions. By purchasing or using tickets through this website, users agree
              to be bound by these Terms of Service, as well as any other applicable agreements or
              policies provided by the company. Users who do not agree must refrain from using the
              website.
            </p>
          </section>

          <section id="section2">
            <h2 className="text-xl font-semibold mb-2">
              2. Rights and Responsibilities of Users (Attendees)
            </h2>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>Users may purchase tickets without creating an account.</li>
              <li>Users must provide accurate, current, and complete information when purchasing tickets.</li>
              <li>Users are fully responsible for the safekeeping and condition of their tickets.</li>
              <li>Users under 18 years old must obtain parental or guardian consent before transactions.</li>
              <li>Tickets cannot be resold, exchanged, or used for profit without consent.</li>
              <li>Tickets are not redeemable for cash, gifts, or promotional credits.</li>
              <li>Tickets are valid only for event entry unless otherwise stated by the organizer.</li>
              <li>Late arrivals may be denied entry at the organizer’s discretion, with no refunds provided.</li>
            </ul>
          </section>

          <section id="section3">
            <h2 className="text-xl font-semibold mb-2">
              3. Rights and Responsibilities of Organizers
            </h2>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>Organizers must create an account to host or manage events.</li>
              <li>Organizers are responsible for providing accurate event details, pricing, and refund policies.</li>
              <li>Organizers are solely responsible for the planning and execution of their events.</li>
              <li>Organizers must honor valid tickets issued through Event Sari-Sari.</li>
              <li>Event Sari-Sari reserves the right to suspend or cancel accounts engaging in fraud or illegal activities.</li>
            </ul>
          </section>

          <section id="section4">
            <h2 className="text-xl font-semibold mb-2">4. Limitation of Liability</h2>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>
                <strong>Content Accuracy –</strong> Event Sari-Sari reviews content but does not guarantee accuracy or timeliness.
              </li>
              <li>
                <strong>Event Responsibility –</strong> Event Sari-Sari only provides ticketing services. Organizers are fully responsible for their events.
              </li>
              <li>
                <strong>Service Availability –</strong> No guarantee of uninterrupted or error-free service.
              </li>
              <li>
                <strong>Refunds –</strong> Refunds are the responsibility of the event organizer. Tickets are non-refundable unless canceled or postponed.
              </li>
              <li>Event Sari-Sari is not liable for lost, stolen, or damaged tickets.</li>
              <li>Fraud protection measures may restrict payment methods.</li>
            </ul>
          </section>

          <section id="section5">
            <h2 className="text-xl font-semibold mb-2">5. Third-Party Links</h2>
            <p className="text-gray-700 text-sm">
              The website may contain links to external sites. Event Sari-Sari is not responsible for the
              content or damages arising from visiting those sites.
            </p>
          </section>

          <section id="section6">
            <h2 className="text-xl font-semibold mb-2">6. Privacy</h2>
            <p className="text-gray-700 text-sm">
              Event Sari-Sari’s Privacy Policy governs the collection, storage, and use of user data.
            </p>
          </section>

          <section id="section7">
            <h2 className="text-xl font-semibold mb-2">7. Company Rights</h2>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>The company may amend these Terms at any time without prior notice.</li>
              <li>All intellectual property is owned by the company and protected by law.</li>
              <li>Website content may only be used for personal, non-commercial purposes.</li>
            </ul>
          </section>

          <section id="section8">
            <h2 className="text-xl font-semibold mb-2">8. Safety</h2>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>Users must comply with safety instructions or risk denied entry/removal.</li>
              <li>Organizers may conduct security checks; unauthorized items may result in denied entry.</li>
              <li>The company is not liable for lost, stolen, or damaged belongings at events.</li>
              <li>No liability for damages caused by force majeure such as terrorism, protests, or riots.</li>
            </ul>
          </section>

          <section id="section9">
            <h2 className="text-xl font-semibold mb-2">9. Miscellaneous</h2>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
              <li>Users may not resell or duplicate tickets without organizer approval.</li>
              <li>Organizers and the company may deny entry for prohibited items (weapons, drugs, fireworks, etc.).</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Term;
