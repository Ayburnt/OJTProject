import React, { useEffect } from "react";
import FooterNav from "../components/FooterNav";

function Policy() {

    useEffect(() => {
      document.documentElement.style.scrollBehavior = "smooth";
      return () => {
        document.documentElement.style.scrollBehavior = "auto";
      };
    }, []);

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
            <a href="#info" className="block underline text-secondary">
              1. Information We Collect
            </a>
            <a href="#use" className="block underline text-secondary">
              2. How We Use Your Information
            </a>
            <a href="#retention" className="block underline text-secondary">
              3. Data Retention
            </a>
            <a href="#rights" className="block underline text-secondary">
              4. Your Rights
            </a>
            <a href="#protection" className="block underline text-secondary">
              5. Data Protection
            </a>
  
            <a href="#sharing" className="block underline text-secondary">
              6. Third-Party Sharing
            </a>
            <a href="#breach" className="block underline text-secondary">
              7. Data Breach Notification
            </a>
            <a href="#contact" className="block underline text-secondary">
              8. Contact Information
            </a>
            <a href="#changes" className="block underline text-secondary">
              9. Changes to This Privacy Policy
            </a>
          </div>

          {/* Section Content */}
          <section id="info">
            <h2 className="text-xl font-semibold mb-2">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 text-sm">
              We only collect basic information needed to manage events, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm ml-4 mt-2">
              <li>Personal details: Full Name</li>
              <li>Contact details: Email address</li>
            </ul>
            <p className="text-gray-700 text-sm mt-2">
              We do not collect financial data since all events are currently free.
            </p>
          </section>

          <section id="use">
            <h2 className="text-xl font-semibold mb-2">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 text-sm">
              We use information only to:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm ml-4 mt-2">
              <li>Manage event registrations</li>
              <li>Communicate about events or updates</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations if necessary</li>
            </ul>
            <p className="text-gray-700 text-sm mt-2">
              We do not use your information for marketing, advertising, or profiling.
            </p>
          </section>

          <section id="retention">
            <h2 className="text-xl font-semibold mb-2">
              3. Data Retention
            </h2>
            <p className="text-gray-700 text-sm">
              We keep your information only as long as necessary to provide the service. Once it is no longer needed, we will delete or anonymize it.
            </p>
          </section>

          <section id="rights">
            <h2 className="text-xl font-semibold mb-2">
              4. Your Rights
            </h2>
            <p className="text-gray-700 text-sm">
              You may request access to your data, request correction of inaccurate information, or request deletion of your data. Contact us via <strong>event.sari-sari.com</strong> to exercise these rights.
            </p>
          </section>

          <section id="protection">
            <h2 className="text-xl font-semibold mb-2">
              5. Data Protection
            </h2>
            <p className="text-gray-700 text-sm">
              We implement technical and organizational measures to protect your data, including secure networks, limited access, and encryption.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-xl font-semibold mb-2">
              6. Cookies
            </h2>
            <p className="text-gray-700 text-sm">
              We use cookies only to improve site functionality and user experience. You can disable cookies, but some features may not work.
            </p>
          </section>

          <section id="sharing">
            <h2 className="text-xl font-semibold mb-2">
              7. Third-Party Sharing
            </h2>
            <p className="text-gray-700 text-sm">
              We do not share your personal information with third parties unless required by law.
            </p>
          </section>

          <section id="breach">
            <h2 className="text-xl font-semibold mb-2">
              8. Data Breach Notification
            </h2>
            <p className="text-gray-700 text-sm">
              If a data breach occurs, we will notify affected users promptly.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-xl font-semibold mb-2">
              9. Contact Information
            </h2>
            <p className="text-gray-700 text-sm">
              For questions or to exercise your data rights, contact:  
              <br /><strong> Email: </strong>  
              <br /> <strong> Office: </strong> 
            </p>
          </section>

          <section id="changes">
            <h2 className="text-xl font-semibold mb-2">
              10. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 text-sm">
              We may update this policy from time to time. The latest version will always be on our website.  
            </p>
          </section>
           <p className="text-gray-700 text-sm">
            Last updated: Month 00, 2025
            </p>
        </div>
      </div>
    </div>
  );
}

export default Policy;
