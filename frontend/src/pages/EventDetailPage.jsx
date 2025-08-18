import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaShareAlt, FaTicketAlt } from 'react-icons/fa';
import { FaRegUser } from "react-icons/fa";
import api from '../events.js';

function EventDetailPage() {
    const [eventDetails, setEventDetails] = useState(null);
    const [qrCode, setQrCode] = useState(null);   // NEW: QR Code state
    const [openCategories, setOpenCategories] = useState({});
    const [discountCode, setDiscountCode] = useState('');
    const [discountStatus, setDiscountStatus] = useState({ applied: false, message: '' });
    const [selectedTickets, setSelectedTickets] = useState({});
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const navigate = useNavigate();
    const { eventcode } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${eventcode}/`);
                setEventDetails(res.data);

                // If backend also provides qr_code field
                if (res.data.qr_code) {
                    setQrCode(res.data.qr_code); // Example: "/media/qrcodes/123.png"
                }

                console.log("Fetched Event:", res.data);
            } catch (err) {
                console.error("Error fetching event:", err);
            }
        };

        fetchEvent();
    }, [eventcode]);

    const toggleCategory = (categoryName) => {
        setOpenCategories((prev) => ({
            ...prev,
            [categoryName]: !prev[categoryName],
        }));
    };

    const handleApplyDiscount = () => {
        if (discountCode.toUpperCase() === 'SKECHERS25') {
            setDiscountStatus({ applied: true, message: 'Discount applied!' });
        } else {
            setDiscountStatus({ applied: false, message: 'Invalid code.' });
        }
    };

    const handleQuantityChange = (ticketId, quantity) => {
        setSelectedTickets((prev) => ({
            ...prev,
            [ticketId]: parseInt(quantity, 10),
        }));
    };

    const totalTicketsSelected = Object.values(selectedTickets).reduce(
        (sum, current) => sum + current,
        0
    );

    if (!eventDetails) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-600 mb-4">Loading event...</h2>
            </div>
        );
    }

    function formatAgeRestriction(value) {
        switch (value) {
            case "all":
                return "All Ages Allowed";
            case "18+":
                return "18 and Above Only";
            case "kids":
                return "Kids Only";
            case "guardian_needed":
                return "Minors Allowed with Guardian";
            default:
                return value;
        }
    }

    function formatDateTime(dateStr, timeStr) {
        const dateObj = new Date(`${dateStr}T${timeStr}`);
        return dateObj.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Banner */}
            <section className="relative w-full h-[400px] md:h-[550px] lg:h-[650px] overflow-hidden">
                <img
                    src={eventDetails.event_poster}
                    alt={eventDetails.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </section>

            <div className="relative z-10 -mt-40 md:-mt-56 lg:-mt-80 container mx-auto px-4">
                <div className="flex flex-col lg:flex-row lg:gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/3 order-first lg:order-last mb-8 lg:mb-0">
                        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 sticky lg:top-28 space-y-6">

                            {/* QR Code Above */}
                            {qrCode && (
                                <div className="flex justify-center mb-6">
                                    <img
                                        src={`http://127.0.0.1:8000/events/${qrCode}`}
                                        alt="Event QR Code"
                                        className="w-32 h-32 object-contain"
                                    />
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight text-center mb-5">
                                {eventDetails.title}
                            </h1>

                            {/* Organizer */}
                            <div>
                                <h3 className="text-sm uppercase text-gray-500 font-semibold mb-2">Organized by</h3>
                                <div className="flex items-center space-x-3">
                                    <FaRegUser className="text-teal-600 text-lg" />
                                    <span className="text-gray-800 font-medium">
                                        {eventDetails.created_by.first_name} {eventDetails.created_by.last_name}
                                    </span>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div>
                                <h3 className="text-sm uppercase text-gray-500 font-semibold mb-2">Date & Time</h3>
                                <div className="flex items-start space-x-3">
                                    <FaCalendarAlt className="text-teal-600 text-lg mt-1" />
                                    <span className="text-gray-700">
                                        {formatDateTime(eventDetails.start_date, eventDetails.start_time)}
                                    </span>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <h3 className="text-sm uppercase text-gray-500 font-semibold mb-2">Location</h3>
                                <div className="flex items-start space-x-3">
                                    <FaMapMarkerAlt className="text-teal-600 text-lg mt-1" />
                                    <span className="text-gray-700">
                                        {eventDetails.venue_name}, {eventDetails.venue_address}
                                    </span>
                                </div>
                            </div>

                            {/* Age Restriction */}
                            {eventDetails.age_restriction && (
                                <div>
                                    <h3 className="text-sm uppercase text-gray-500 font-semibold mb-2">Age Restriction</h3>
                                    <p className="text-gray-800 font-medium">
                                        {formatAgeRestriction(eventDetails.age_restriction)}
                                    </p>
                                </div>
                            )}

                            {/* Event Type + Share */}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg font-semibold text-sm">
                                    In-person
                                </span>
                                <button
                                    className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
                                    onClick={() => console.log("Share clicked")}
                                >
                                    <FaShareAlt />
                                    <span className="font-medium">Share</span>
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        {/* Nav */}
                        <div className="sticky top-20 bg-white shadow-md rounded-lg mb-8 z-20 overflow-hidden">
                            <nav className="flex justify-around items-center border-b border-gray-200 py-3 px-4">
                                <a
                                    href="#description-section"
                                    className="px-4 py-2 text-lg font-semibold text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    Description
                                </a>
                                <a
                                    href="#tickets-section"
                                    className="px-4 py-2 text-lg font-semibold text-gray-700 hover:text-teal-600 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    Tickets
                                </a>
                            </nav>
                        </div>

                        {/* Description */}
                        <div
                            id="description-section"
                            className="bg-white p-6 md:p-8 rounded-lg shadow-xl mb-8"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
                                Description
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {eventDetails.description}
                            </p>
                        </div>

                        {/* Tickets */}
                        <div
                            id="tickets-section"
                            className="bg-white p-6 md:p-8 rounded-lg shadow-xl mb-8"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
                                Tickets
                            </h2>
                            {eventDetails.ticket_types &&
                                eventDetails.ticket_types.length > 0 ? (
                                <div className="space-y-4">
                                    {eventDetails.ticket_types.map((ticket, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center py-2 border-b border-dashed border-gray-100 last:border-b-0"
                                        >
                                            <span className="text-gray-700">{ticket.ticket_name}</span>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-lg font-bold text-orange-600">
                                                    {ticket.price}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <select
                                                        className="p-2 border border-gray-300 rounded-md"
                                                        value={selectedTickets[ticket.id] || 0}
                                                        onChange={(e) =>
                                                            handleQuantityChange(ticket.id, e.target.value)
                                                        }
                                                    >
                                                        {[...Array(11).keys()].map((num) => (
                                                            <option key={num} value={num}>
                                                                {num}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">
                                    No tickets available at this time.
                                </p>
                            )}

                            {/* Discount */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    <FaTicketAlt className="inline-block mr-2 text-teal-600" />
                                    Have a discount code?
                                </h3>
                                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                    />
                                    <button
                                        className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                                        onClick={handleApplyDiscount}
                                    >
                                        Apply
                                    </button>
                                </div>
                                {discountStatus.message && (
                                    <p
                                        className={`mt-2 text-sm ${discountStatus.applied ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        {discountStatus.message}
                                    </p>
                                )}
                            </div>

                            {/* Terms */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <label className="flex items-start cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-teal-500 mt-1"
                                        checked={agreeToTerms}
                                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    />
                                    <span className="ml-3 text-sm text-gray-700 leading-relaxed">
                                        By checking this box, I hereby agree that my information
                                        will be shared to our Event Organizer.
                                    </span>
                                </label>
                            </div>

                            {/* Buy Button */}
                            <div className="mt-6">
                                <button
                                    className={`w-full py-4 rounded-full text-xl font-bold transition-all duration-200 shadow-lg ${agreeToTerms && totalTicketsSelected > 0
                                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    disabled={!agreeToTerms || totalTicketsSelected === 0}
                                >
                                    Buy Tickets ({totalTicketsSelected})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-20"></div>
        </div>
    );
}

export default EventDetailPage;
