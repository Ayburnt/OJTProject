import React, { useEffect, useState } from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import FooterNav from "../components/FooterNav";
import emailjs from "emailjs-com";

const initialState = {
  from_name: "",
  reply_to: "",
  message: "",
};

export default function ContactUs() {
  const [{ from_name, reply_to, message }, setState] = useState(initialState);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const clearState = () => setState({ ...initialState });

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_b6m5bt7",      // Your EmailJS service ID
        "template_u3yp7or",     // Your EmailJS template ID
        e.target,               // Pass the form element
        "b2tnwfJM6D5ZIHsP4"     // Your EmailJS public key
      )
      .then(
        (result) => {
          console.log("Email sent:", result.text);
          setSubmissionStatus({
            message: "✅ Your message has been sent successfully!",
            type: "success",
          });
          clearState();
        },
        (error) => {
          console.error("Email error:", error.text);
          setSubmissionStatus({
            message: "❌ Oops! Something went wrong. Please try again later.",
            type: "error",
          });
        }
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <FooterNav />

      {/* Hero Section */}
      <section className="bg-teal-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
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

  <div className="flex items-start gap-3 text-gray-700">
    <FiMail className="text-teal-600 text-2xl mt-0.5" />
    <span className="leading-tight">info@sari-sari.com</span>
  </div>

  <div className="flex items-start gap-3 text-gray-700">
    <FiPhone className="text-teal-600 text-2xl mt-0.5" />
    <span className="leading-tight">+63 9178135511</span>
  </div>

  <div className="flex items-start gap-3 text-gray-700">
    <FiMapPin className="text-teal-600 text-2xl mt-0.5" />
    <span className="leading-tight">
      #64 Aguirre Ave., Pilar Village Phase V, <br />
      Zone XI, Las Piñas City, Metro Manila,<br />
      Philippines
    </span>
  </div>
</div>


        {/* Contact Form */}
        <div className="flex justify-center">
          <form
            className="bg-white p-6 rounded-lg shadow-md space-y-4 md:max-w-xl w-full"
            onSubmit={handleSubmit}
          >
            {submissionStatus && (
              <div
                className={`p-3 rounded-md text-sm ${
                  submissionStatus.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {submissionStatus.message}
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                name="from_name"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={from_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="reply_to"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={reply_to}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Message
              </label>
              <textarea
                name="message"
                rows="5"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={message}
                onChange={handleChange}
                required
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
