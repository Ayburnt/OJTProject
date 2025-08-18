import React from "react";
import { FiMail, FiPhone, FiInstagram, FiMessageSquare } from "react-icons/fi";
import FooterNav from "../components/FooterNav"; 

export default function CustomerSupport() {
  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <FooterNav/>

      {/* Header / Hero */}
      <section className="bg-teal-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Customer Support</h1>
          <p className="text-lg md:text-xl">
            We’re here to help you with any questions or concerns.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="flex justify-center py-12 px-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
          {/* Column 1 */}
          <div className="space-y-6 flex flex-col items-center lg:items-center">
            <div className="flex items-center gap-3">
              <FiMail className="text-teal-600 text-2xl" />
              <span>support@sari-sari.com</span>
            </div>
            <div className="flex items-center gap-3">
              <FiInstagram className="text-teal-600 text-2xl" />
              <span>@sarisari</span>
            </div>
            <div className="flex items-center gap-3">
              <FiMessageSquare className="text-teal-600 text-2xl" />
              <span>Sarisari</span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6 flex flex-col items-center lg:items-center">
            <div className="flex items-center gap-3">
              <FiPhone className="text-teal-600 text-2xl" />
              <span>+63 2 8123 4567</span>
            </div>
            <div className="text-center">
              <p>Monday - Friday</p>
              <p>10:30 - 19:00 (UTC+8)</p>
            </div>
            <div className="text-center">
              <p>Call us: Philippines</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
