import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterSuccess from "../components/RegisterSucess.jsx";

function BuyTicket() {
  useEffect(() => {
    document.title = "Buy Ticket | Sari-Sari Events";
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    ticketType: "General Admission",
    quantity: 1,
    promoCode: "",
    agree: false,
  });

  const ticketPrices = {
    Free: "0",
    "General Admission": 500,
    VIP: 1500,
    "Early Bird": 350,
  };

  const totalPrice = formData.quantity * ticketPrices[formData.ticketType];

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agree) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

   // Navigate to the next page and pass state to trigger modal
  setIsModalOpen(true);
};

  return (
    <div className="max-w-md mx-4 mt-5 mb-5 min-h-screen shadow-lg rounded-lg bg-white overflow-hidden px-4 font-outfit md:mx-auto lg:max-w-xl lg:mt-8 lg:mb-10 md:mt-10 md:mb-10 md:max-w-lg">
        {isModalOpen && (
            <RegisterSuccess setIsModalOpen={setIsModalOpen} />
        )}
      {/* Header */}

    <div className="flex items-center justify-center mt-6 mb-6">
  <img src="/sariLogo.png" alt="Sari-Sari Events Logo" className="h-auto max-h-16" />
            </div>

      {/* Event Banner */}
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img src="/.png" alt="Event Banner" className="w-full h-full object-cover" />
      </div>

      {/* Event Details */}
      <div className="p-4">
        <h1 className="text-xl font-semibold">Event Title</h1>
        <p className="text-sm text-gray-600">
          August 23-26, 2025 @ SMX Convention Center Manila
        </p>

        <div className="mt-4">
          <h2 className="font-medium text-gray-800">Description</h2>
          <p className="text-sm text-gray-500 mt-1">None</p>
        </div>
      </div>

      {/* Ticket Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t space-y-6">
        {/* Personal Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border-b-1 border-grey focus:border-teal-600 outline-none py-2 bg-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border-b-1 border-grey focus:border-teal-600 outline-none py-2 bg-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border-b-1 border-grey focus:border-teal-600 outline-none py-2 bg-transparent"
            required
          />
        </div>

        {/* Ticket Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ticket Type
          </label>
          <select
            name="ticketType"
            value={formData.ticketType}
            onChange={handleChange}
            className="w-full border-b-1 border-grey focus:border-teal-600 outline-none py-2 bg-transparent"
          >
            {Object.keys(ticketPrices).map((type) => (
              <option key={type} value={type}>
                {type} - ₱{ticketPrices[type]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border-b-1 border-grey focus:border-teal-600 outline-none py-2 bg-transparent"
          />
        </div>

        {/* Promo Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Promo Code (Optional)
          </label>
          <input
            type="text"
            name="promoCode"
            value={formData.promoCode}
            onChange={handleChange}
            className="w-full border-b-1 border-grey focus:border-teal-600 outline-none py-2 bg-transparent"
          />
        </div>

        {/* Total Price */}
        <div className="text-lg font-semibold text-gray-800">
          Total: ₱{totalPrice.toLocaleString()}
        </div>

        {/* Agreement */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <p className="font-outfit text-sm text-gray-700">
            I agree and I have read and accepted{" "}
            <Link
              to="/term"
              target="_blank"
              className="text-blue-500 underline"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              to="/policy"
              target="_blank"
              className="text-blue-500 underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold mb-5 rounded-lg transition cursor-pointer"
        >
            Check Out 
        </button>
      </form>
    </div>
  );
}

export default BuyTicket;
