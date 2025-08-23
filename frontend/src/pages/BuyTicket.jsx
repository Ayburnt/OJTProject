import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import RegisterSuccess from "../components/RegisterSucess.jsx";
import api from '../api.js'

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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${eventcode}/`);        
        if (res.data.private_code !== null && res.data.private_code !== "") {
          setIsPrivate(true);
        } else{
          setIsPrivate(false);
        }
        setEventDetails(res.data);
        setQuestions(
      (res.data.reg_form_templates[0].questions || []).sort((a, b) => a.id - b.id)
    );
        setTickets(res.data.ticket_types || []);
        console.log(res.data)
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
      // Single-day event
      return `${start.toLocaleDateString("en-US", optionsDate)} at ${start.toLocaleTimeString("en-US", optionsTime)}${end ? ` - ${end.toLocaleTimeString("en-US", optionsTime)}` : ""}`;
    } else {
      // Multi-day event
      return `${start.toLocaleDateString("en-US", optionsDate)}, ${start.toLocaleTimeString("en-US", optionsTime)} - ${end.toLocaleDateString("en-US", optionsDate)}, ${end.toLocaleTimeString("en-US", optionsTime)}`;
    }
  }

  const shortLongInput = `px-3 text-gray-600 w-full border-b-1 border-grey focus:border-teal-600 outline-none py-2 bg-transparent`;

  useEffect(() => {
  if (isPrivate) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto"; // cleanup on unmount
  };
}, [isPrivate]);

  return (
    <>
    {isModalOpen && (
        <RegisterSuccess setIsModalOpen={setIsModalOpen} />
      )}
    <div className="max-w-md mx-4 mt-5 mb-5 min-h-screen shadow-lg rounded-lg bg-white overflow-hidden px-4 font-outfit md:mx-auto lg:max-w-xl lg:mt-8 lg:mb-10 md:mt-10 md:mb-10 md:max-w-lg">      

      {isPrivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm md:max-w-md p-6 relative text-center">

            <h2 className="font-outfit text-lg font-semibold mb-2 text-gray-800">
              This is a private event. Please enter the private code to proceed.
            </h2>
            <p className="font-outfit mb-6 text-base text-gray-600">
              This code is usually provided by the event organizer.
            </p>

            <input
              type="text"
              value={privateCodeInput}
              onChange={(e) => setPrivateCodeInput(e.target.value)}
              placeholder="Enter private code"
              className="w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-3 mb-5"
            />

            <div className="flex justify-center gap-4">              

              <button
                type="button"
                disabled={privateCodeInput !== eventDetails.private_code}
                onClick={() => setIsPrivate(false)}
                className={`px-6 py-3 font-semibold rounded-xl ${privateCodeInput === eventDetails.private_code ? 'bg-secondary text-white cursor-pointer' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}

      <div className="flex items-center justify-center mt-6 mb-6">
        <img src="/sariLogo.png" alt="Sari-Sari Events Logo" className="h-auto max-h-16" />
      </div>

      {/* Event Banner */}
      <div className="w-full aspect-video object-cover bg-gray-100 flex items-center justify-center overflow-hidden">
        <img src={eventDetails?.event_poster} alt="Event Banner" className="w-full h-full object-cover" />
      </div>

      {/* Event Details */}
      <div className="p-4">
        <h1 className="text-xl font-semibold">{eventDetails?.title}</h1>
        <p className="text-sm text-gray-600">
          {formatEventDateTime(eventDetails?.start_date, eventDetails?.start_time, eventDetails?.end_date, eventDetails?.end_time)} <br /> {eventDetails?.venue_address}
        </p>

        <div className="mt-4">
          <h2 className="font-medium text-gray-800">Description</h2>
          <p className="text-sm text-gray-500 mt-1">{eventDetails?.description}</p>
        </div>
      </div>

      {/* Ticket Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t space-y-6">
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

        {Array.isArray(questions) && questions.length > 0 &&
          questions.map((question) => (
            <div key={question.id} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {question.question_label}
                {question.is_required && <span className="text-red-500"> *</span>}
              </label>

              {question.question_type === "short" && (
                <input
                  type="text"
                  className={shortLongInput}
                  required={question.is_required}
                />
              )}

              {question.question_type === "long" && (
                <textarea
                  className='px-3 text-gray-600 w-full border-1 rounded-lg border-grey focus:border-teal-600 outline-none py-2 bg-transparent'
                  required={question.is_required}
                  rows={3}
                />
              )}

              {question.question_type === "radio" && (
  <div className="flex flex-col gap-2">
    {question.options.map((opt) => (
      <label key={opt.id} className="inline-flex items-center text-gray-700 text-sm">
        <input
          type="radio"
          name={`question_${question.id}`}  // group by question id
          value={opt.option_value}
          className="mr-2"
          required={question.is_required}
        />
        {opt.option_value}
      </label>
    ))}
  </div>
)}


              {question.question_type === "checkbox" && (
                <div className="flex flex-col gap-2">
                  {question.options.map((opt) => (
                    <label key={opt} className="inline-flex items-center font-outfit text-gray-700 text-sm">
                      <input
                        type="checkbox"
                        value={opt.option_value}
                        className="mr-2"
                        required={question.is_required && opt === 0}
                      />
                      {opt.option_value}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))
        }

        {/* Ticket Details */}
        <div className="w-full mt-10">
          {eventDetails?.seating_map && (
            <div className="mb-4 w-full">
              <p className="text-gray-600">Seating Map</p>
              <img className="w-full object-contain" src={eventDetails.seating_map} alt="" />
            </div>
          )}
          <label className="block font-medium text-gray-700 mb-3">
            Ticket Type
          </label>

          {Array.isArray(tickets) && tickets.length > 0 &&
          tickets.map((ticket) => (
            <div className='grid grid-cols-2 mb-4' key={ticket.id}> 
              <div className="flex flex-col">
                <p className="font-outfit font-semibold text-lg text-gray-600 leading-none">{ticket.ticket_name}</p>
                <p className="font-outfit text-sm text-gray-500">₱{ticket.price}</p>
              </div>
              
              <select name="quantity" id="" className="w-15 place-self-end border-1 outline-none border-gray-400 p-1 rounded cursor-pointer">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              
            </div>
          ))
        }          
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
    </>
  );
}

export default BuyTicket;
