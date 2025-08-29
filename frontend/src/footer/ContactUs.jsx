import React, { useEffect } from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import FooterNav from "../components/FooterNav";

export default function ContactUs() {

   useEffect(() => {
      document.documentElement.style.scrollBehavior = "smooth";
      return () => {
        document.documentElement.style.scrollBehavior = "auto";
      };
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <FooterNav />

      {/* Hero Section */}
      <section className="bg-teal-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center ">
          <h2 className="text-3xl font-bold mb-2">We’d love to hear from you</h2>
          <p className="text-lg">
            Questions, feedback, or support? Reach out and we’ll get back to you quickly.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:max-w-6xl">
        {/* Contact Info */}
        <div className="space-y-6 md:flex md:flex-col md:items-center md:text-center">
  <h3 className="text-xl font-semibold text-gray-800">Get in touch</h3>
  <div className="flex items-center gap-3 text-gray-700">
    <FiMail className="text-teal-600 text-2xl" />
    <span>event.sari-sari.com</span>
  </div>
  <div className="flex items-center gap-3 text-gray-700">
    <FiPhone className="text-teal-600 text-2xl" />
    <span>+63 9000000000</span>
  </div>
  <div className="flex items-center gap-3 text-gray-700">
    <FiMapPin className="text-teal-600 text-2xl" />
    <span>Philippines</span>
  </div>
</div>


       {/* Contact Form */}
<div className="flex justify-center">
  <form className="bg-white p-6 rounded-lg shadow-md space-y-4 md:max-w-xl w-full">
    <div>
      <label className="block text-gray-700 font-medium mb-1">Name</label>
      <input
        type="text"
        name="name"
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
    <div>
      <label className="block text-gray-700 font-medium mb-1">Email</label>
      <input
        type="email"
        name="email"
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
    <div>
      <label className="block text-gray-700 font-medium mb-1">Message</label>
      <textarea
        name="message"
        rows="5"
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      ></textarea>
    </div>
    <div className="flex justify-center">
      <button
        type="submit"
        className="bg-teal-600 text-white px-4 py-1.5 text-sm rounded-md font-medium hover:bg-teal-700 transition"
      >
        Send Message
      </button>
    </div>
  </form>
</div>
      </section>
    </div>
  );
}
