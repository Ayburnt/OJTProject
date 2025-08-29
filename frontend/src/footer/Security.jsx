import React, { useEffect } from "react";
import FooterNav from "../components/FooterNav";

function Security() {
  // Optional: smooth scrolling behavior for older browsers
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
            Event Sari-Sari Security Guide
          </h1>

          {/* Section Links */}
          <div id="top" className="space-y-1">
            <a href="#transmission" className="block underline text-secondary">
              1. Data Protection During Transmission
            </a>
            <a href="#server" className="block underline text-secondary">
              2. Server Security
            </a>
            <a href="#access" className="block underline text-secondary">
              3. Access Controls
            </a>
            <a href="#privacy" className="block underline text-secondary">
              4. Data Privacy Commitment
            </a>
            <a href="#breach" className="block underline text-secondary">
              5. Data Breach Notification
            </a>
            <a href="#informed" className="block underline text-secondary">
              6. Stay Informed
            </a>
          </div>

          {/* Data Protection During Transmission */}
          <section id="transmission" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-2">1. Data Protection During Transmission</h2>
            <p className="text-gray-700 text-sm">
              All communication between your device and our servers is encrypted using SSL technology. 
              This ensures that any information you submit—such as your name, email, or event registration details—remains secure while being transmitted.
            </p>
          </section>

          {/* Server Security */}
          <section id="server" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-2">2. Server Security</h2>
            <p className="text-gray-700 text-sm">
              Event Sari-Sari is hosted on Amazon Web Services (AWS), which provides enterprise-grade security and compliance measures. 
              AWS maintains certifications and compliance programs to ensure data safety, such as:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm ml-4">
              <li>ISO 27001 – International standard for information security management</li>
              <li>ISO 27017 – Cloud-specific security controls</li>
              <li>ISO 27018 – Cloud privacy protection standards</li>
            </ul>
            <p className="text-gray-700 text-sm">
              You can review AWS security programs{" "}
              <a href="https://aws.amazon.com/compliance/programs/" target="_blank" rel="noreferrer" className="text-blue-500 underline">
                here
              </a>.
            </p>
          </section>

          {/* Access Controls */}
          <section id="access" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-2">3. Access Controls</h2>
            <p className="text-gray-700 text-sm">
              Access to our servers and internal systems is strictly limited to authorized personnel only. 
              All staff follow security protocols to prevent unauthorized access, modification, or disclosure of event-related information.
            </p>
          </section>

          {/* Data Privacy Commitment */}
          <section id="privacy" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-2">4. Data Privacy Commitment</h2>
            <p className="text-gray-700 text-sm">
              We collect only the basic information needed to manage events, and we do not store financial data or sensitive personal documents. 
              Your information is used solely to manage event registrations and communicate updates about events you participate in.
            </p>
          </section>

          {/* Data Breach Notification */}
          <section id="breach" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-2">5. Data Breach Notification</h2>
            <p className="text-gray-700 text-sm">
              In the unlikely event of a data breach, we will notify affected users promptly and take immediate steps to mitigate risks.
            </p>
          </section>

          {/* Stay Informed */}
          <section id="informed" className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-2">6. Stay Informed</h2>
            <p className="text-gray-700 text-sm">
              For full details about how your data is protected, please review our Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Security;
