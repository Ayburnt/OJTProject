import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import RegisterSuccess from "../components/RegisterSucess.jsx";
import api from "../api.js";

function BuyTicket() {
  const { eventcode } = useParams();

  useEffect(() => {
    document.title = "Buy Ticket | Sari-Sari Events";
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [privateCodeInput, setPrivateCodeInput] = useState("");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    ticketType: "", // will store ticket.id
    quantity: 1,
    promoCode: "",
    agree: false,
  });

  const [ticketHolders, setTicketHolders] = useState([
    { fullName: "", email: "", phone: "" },
  ]);

  // 🔹 Compute total price from backend tickets
  const selectedTicket = tickets.find(
    (t) => t.id === Number(formData.ticketType)
  );
  const totalPrice = selectedTicket
    ? formData.quantity * selectedTicket.price
    : 0;

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Sync ticket holders count with quantity
  useEffect(() => {
    setTicketHolders((prev) => {
      const updated = [...prev];
      if (formData.quantity > prev.length) {
        for (let i = prev.length; i < formData.quantity; i++) {
          updated.push({ fullName: "", email: "", phone: "" });
        }
      } else if (formData.quantity < prev.length) {
        updated.length = formData.quantity;
      }
      return updated;
    });
  }, [formData.quantity]);

  const handleHolderChange = (index, field, value) => {
    setTicketHolders((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agree) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }
    console.log("Submitting:", { formData, ticketHolders });
    setIsModalOpen(true);
  };

  // 🔹 Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${eventcode}/`);
        setIsPrivate(!!res.data.private_code);
        setEventDetails(res.data);
        setQuestions(
          (res.data.reg_form_templates?.[0]?.questions || []).sort(
            (a, b) => a.id - b.id
          )
        );
        setTickets(res.data.ticket_types || []);
        if (res.data.ticket_types?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            ticketType: res.data.ticket_types[0].id, // default first ticket
          }));
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [eventcode]);

  function formatEventDateTime(startDate, startTime, endDate, endTime) {
    if (!startDate || !startTime) return "TBA";

    const start = new Date(`${startDate}T${startTime}`);
    const end = endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;

    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };

    if (!end || start.toDateString() === end.toDateString()) {
      return `${start.toLocaleDateString("en-US", optionsDate)} at ${start.toLocaleTimeString("en-US", optionsTime)}${end ? ` - ${end.toLocaleTimeString("en-US", optionsTime)}` : ""}`;
    } else {
      return `${start.toLocaleDateString("en-US", optionsDate)}, ${start.toLocaleTimeString("en-US", optionsTime)} - ${end.toLocaleDateString("en-US", optionsDate)}, ${end.toLocaleTimeString("en-US", optionsTime)}`;
    }
  }

  const shortLongInput =
    "px-3 text-gray-600 w-full border-b-1 border-grey focus:border-teal-600 outline-none py-2 bg-transparent";

  useEffect(() => {
    document.body.style.overflow = isPrivate ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPrivate]);

  return (
    <>
      {isModalOpen && <RegisterSuccess setIsModalOpen={setIsModalOpen} />}
      <div className="max-w-md mx-4 mt-5 mb-5 min-h-screen shadow-lg rounded-lg bg-white overflow-hidden px-4 font-outfit md:mx-auto lg:max-w-xl">
        {/* Private Event Modal */}
        {isPrivate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
              <h2 className="font-outfit text-lg font-semibold mb-2 text-gray-800">
                This is a private event. Please enter the private code.
              </h2>
              <input
                type="text"
                value={privateCodeInput}
                onChange={(e) => setPrivateCodeInput(e.target.value)}
                placeholder="Enter private code"
                className="w-full border-2 border-gray-300 rounded-xl focus:border-teal-500 py-2 px-3 mb-5"
              />
              <button
                type="button"
                disabled={privateCodeInput !== eventDetails.private_code}
                onClick={() => setIsPrivate(false)}
                className={`px-6 py-3 font-semibold rounded-xl ${
                  privateCodeInput === eventDetails.private_code
                    ? "bg-secondary text-white"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Enter
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-center mt-6 mb-6">
          <img
            src="/sariLogo.png"
            alt="Sari-Sari Events Logo"
            className="h-auto max-h-16"
          />
        </div>

        {/* Event Banner */}
        <div className="w-full aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={eventDetails?.event_poster}
            alt="Event Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Info */}
        <div className="p-4">
          <h1 className="text-xl font-semibold">{eventDetails?.title}</h1>
          <p className="text-sm text-gray-600">
            {formatEventDateTime(
              eventDetails?.start_date,
              eventDetails?.start_time,
              eventDetails?.end_date,
              eventDetails?.end_time
            )}{" "}
            <br /> {eventDetails?.venue_address}
          </p>
          <div className="mt-4">
            <h2 className="font-medium text-gray-800">Description</h2>
            <p className="text-sm text-gray-500 mt-1">
              {eventDetails?.description}
            </p>
          </div>
        </div>

        {/* Ticket Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={shortLongInput}
              required
            />
          </div>

          {/* Custom Questions */}
          {questions.map((q) => (
            <div key={q.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {q.question_label}
                {q.is_required && <span className="text-red-500">*</span>}
              </label>
              {q.question_type === "short" && (
                <input
                  type="text"
                  className={shortLongInput}
                  required={q.is_required}
                />
              )}
              {q.question_type === "long" && (
                <textarea
                  rows={3}
                  className="px-3 text-gray-600 w-full border rounded-lg focus:border-teal-600 outline-none py-2"
                  required={q.is_required}
                />
              )}
              {q.question_type === "radio" && (
                <div className="flex flex-col gap-2">
                  {q.options.map((opt) => (
                    <label key={opt.id} className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value={opt.option_value}
                        required={q.is_required}
                        className="mr-2"
                      />
                      {opt.option_value}
                    </label>
                  ))}
                </div>
              )}
              {q.question_type === "checkbox" && (
                <div className="flex flex-col gap-2">
                  {q.options.map((opt) => (
                    <label key={opt.id} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name={`q_${q.id}`}
                        value={opt.option_value}
                        className="mr-2"
                      />
                      {opt.option_value}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Ticket Holders */}
          {ticketHolders.map((holder, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg shadow-sm bg-gray-50 space-y-3"
            >
              <h3 className="font-semibold text-gray-700">
                Ticket {idx + 1} Details
              </h3>
              <input
                type="text"
                placeholder="Full Name"
                value={holder.fullName}
                onChange={(e) =>
                  handleHolderChange(idx, "fullName", e.target.value)
                }
                className={shortLongInput}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={holder.email}
                onChange={(e) =>
                  handleHolderChange(idx, "email", e.target.value)
                }
                className={shortLongInput}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={holder.phone}
                onChange={(e) =>
                  handleHolderChange(idx, "phone", e.target.value)
                }
                className={shortLongInput}
              />
            </div>
          ))}

          {/* Ticket Selection */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Ticket Type
            </label>
            <select
              name="ticketType"
              value={formData.ticketType}
              onChange={handleChange}
              className="w-full border border-gray-400 p-2 rounded"
              required
            >
              {tickets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.ticket_name} – ₱{t.price}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <select
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded"
            >
              {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
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
              className={shortLongInput}
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
            <p className="text-sm text-gray-700">
              I agree to{" "}
              <Link to="/term" target="_blank" className="text-blue-500">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link to="/policy" target="_blank" className="text-blue-500">
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
    </>
  );
}

export default BuyTicket;
