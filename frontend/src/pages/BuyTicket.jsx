import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import RegisterSuccess from "../components/RegisterSucess.jsx";
import api from "../api.js";
import { toast } from "react-toastify";

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
    fullName: "",
    ticketType: "", // will store ticket.id
    ticket_quantity: 1,
    promoCode: "",
    agree: false,
    questions: {},
  });

  const [ticketHolders, setTicketHolders] = useState([
    { fullName: "", email: ""},
  ]);

  // 🔹 Compute total price from backend tickets
  const selectedTicket = tickets.find(
    (t) => t.id === Number(formData.ticketType)
  );
  const totalPrice = selectedTicket
    ? formData.ticket_quantity * selectedTicket.price
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
      if (formData.ticket_quantity > prev.length) {
        for (let i = prev.length; i < formData.ticket_quantity; i++) {
          updated.push({ fullName: "", email: ""});
        }
      } else if (formData.ticket_quantity < prev.length) {
        updated.length = formData.ticket_quantity;
      }
      return updated;
    });
  }, [formData.ticket_quantity]);

  const handleHolderChange = (index, field, value) => {
    setTicketHolders((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      toast.error("You must agree to the Terms & Conditions.");
      return;
    }

    const forceSingle = Number(formData.ticket_quantity) <= 5;

    try {
      // Buyer (main attendee)
      const mainAttendee = {
        fullName: formData.fullName,
        email: formData.email,
        event: eventDetails.event_code,
        ticket_type: formData.ticketType, // must be ticket_type.id
        ticket_quantity: forceSingle ? 1 : formData.ticket_quantity,
        price_at_purchase: formData.price,
        responses: Object.entries(formData.questions || {}).map(([qId, value]) => ({
          question: qId,
          response_value: Array.isArray(value) ? value.join(", ") : value,  // ✅ convert array -> string
        })),
      };

      await api.post("/attendees/buy-ticket/", mainAttendee);

      // Other ticket holders
      for (const holder of ticketHolders) {
        const extraAttendee = {
          fullName: holder.fullName || "Guest",
          email: holder.email,
          event: eventDetails.event_code,
          ticket_type: formData.ticketType,
          ticket_quantity: 1,
          price_at_purchase: formData.price,
          responses: holder.questions
            ? Object.entries(holder.questions).map(([qId, value]) => ({
              question: qId,
              response_value: Array.isArray(value) ? value.join(", ") : value,  // ✅ here too
            }))
            : [],
        };
        await api.post("/attendees/buy-ticket/", extraAttendee);
      }

      setIsModalOpen(true);
    } catch (err) {
      console.error("Error submitting:", err.response?.data || err.message);
      alert("Something went wrong while booking. Please try again.");
    }
  };




  // 🔹 Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${eventcode}/`);
        console.log(res.data);
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

  // 🔹 Sync ticket holders count with quantity
  useEffect(() => {
    if (formData.ticket_quantity > 5) {
      setTicketHolders([]); // no ticket holders shown if > 5
    } else {
      // Only render (quantity - 1) holders since buyer is already one
      const neededHolders = Math.max(0, formData.ticket_quantity - 1);
      setTicketHolders((prev) => {
        const updated = [...prev];
        if (neededHolders > prev.length) {
          for (let i = prev.length; i < neededHolders; i++) {
            updated.push({ email: "", phone: "" });
          }
        } else if (neededHolders < prev.length) {
          updated.length = neededHolders;
        }
        return updated;
      });
    }
  }, [formData.ticket_quantity]);


  const shortLongInput =
    "px-3 text-gray-600 w-full border-b-1 border-grey focus:border-teal-600 outline-none py-2 bg-transparent";

  useEffect(() => {
    document.body.style.overflow = isPrivate ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPrivate]);

  // ------------------ HANDLER -------------------
  const handleQuestionChange = (qId, value, type, checked) => {
    setFormData((prev) => {
      let updated = { ...prev.questions };

      if (type === "checkbox") {
        // Multiple answers allowed
        const current = updated[qId] || [];
        updated[qId] = checked
          ? [...current, value]
          : current.filter((v) => v !== value);
      } else {
        // Single value (short, long, radio)
        updated[qId] = value;
      }

      return { ...prev, questions: updated };
    });
  };


  return (
    <>
      {isModalOpen && <RegisterSuccess setIsModalOpen={setIsModalOpen} />}
      <div className="max-w-lg mx-4 mt-5 mb-5 min-h-screen shadow-lg rounded-3xl bg-white overflow-hidden px-10 font-outfit md:mx-auto lg:max-w-2xl 2xl:max-w-4xl">
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
                className={`px-6 py-3 font-semibold rounded-xl ${privateCodeInput === eventDetails.private_code
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
            <br /> {eventDetails?.venue_specific !== null && eventDetails?.venue_specific !== '' ? eventDetails?.venue_specific + ', ' : ''}{eventDetails?.venue_address}
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
          {eventDetails?.collect_email === "collect" && (
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
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name (FirstName LastName) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g., Jane Doe"
              className={shortLongInput}
              required
            />
          </div>
          {/* Custom Questions */}
          {questions.map((q) => (
            <div key={q.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {q.question_label}
                {q.is_required && <span className="text-red-500"> *</span>}
              </label>

              {q.question_type === "short" && (
                <input
                  type="text"
                  className={shortLongInput}
                  required={q.is_required}
                  value={formData.questions[q.id] || ""}
                  onChange={(e) =>
                    handleQuestionChange(q.id, e.target.value, "short")
                  }
                />
              )}

              {q.question_type === "long" && (
                <textarea
                  rows={3}
                  className="px-3 text-gray-600 w-full border rounded-lg focus:border-teal-600 outline-none py-2"
                  required={q.is_required}
                  value={formData.questions[q.id] || ""}
                  onChange={(e) =>
                    handleQuestionChange(q.id, e.target.value, "long")
                  }
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
                        checked={formData.questions[q.id] === opt.option_value}
                        onChange={(e) =>
                          handleQuestionChange(q.id, e.target.value, "radio")
                        }
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
                        checked={(formData.questions[q.id] || []).includes(opt.option_value)}
                        onChange={(e) =>
                          handleQuestionChange(
                            q.id,
                            e.target.value,
                            "checkbox",
                            e.target.checked
                          )
                        }
                        className="mr-2"
                      />
                      {opt.option_value}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          


          {/* Ticket Selection */}
          <div className="w-full mt-10">
            {eventDetails?.seating_map && (
              <div className="mb-4 w-full">
                <p className="text-gray-600">Seating Map</p>
                <img className="w-full object-contain" src={eventDetails.seating_map} alt="" />
              </div>
            )}
          </div>
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
              name="ticket_quantity"
              value={formData.ticket_quantity}
              onChange={handleChange}
              className="border border-gray-400 p-2 rounded"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Ticket Holders */}
          {formData.ticket_quantity > 5 ? (
            <div className="p-4 border rounded-lg bg-yellow-50 text-sm text-gray-700">
              You are booking more than 5 tickets.
              Please email the list of ticket holders (full name{eventDetails?.collect_email === 'collect' ? ' and email' : ''} to{" "}
              <a
                href="mailto:info@sari-sari.com"
                className="text-blue-600 underline"
              >
                info@sari-sari.com
              </a>
              . For easier processing, you may submit it in an Excel file.
            </div>
          ) : (
            ticketHolders.map((holder, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg shadow-sm bg-gray-50 space-y-3"
              >
                <h3 className="font-semibold text-gray-700">
                  Ticket Holder {idx + 2} Details
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
                {eventDetails?.collect_email === "collect" && (
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
                )}                                
              </div>
            ))
          )}

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
