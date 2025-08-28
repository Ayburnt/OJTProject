import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaShareAlt, FaCar, FaUserLock, FaFacebook, FaFacebookMessenger, FaTwitter, FaLinkedin, FaCheckCircle, FaCheckSquare } from 'react-icons/fa';
import { FaRegUser } from "react-icons/fa";
import api from '../api.js';

/* ---------- Share Modal ---------- */
function ShareModal({ isOpen, onClose, shareUrl, qrUrl, title }) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (e) {
            console.error('Copy failed:', e);
        }
    };

    const encodedUrl = encodeURIComponent(shareUrl);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-[95%] max-w-lg p-6">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    aria-label="Close share modal"
                >
                    ×
                </button>
                <h3 className="text-xl font-semibold text-center mb-5">
                    Let your friends know!
                </h3>
                {/* Social buttons */}
                <div className="flex items-center justify-center gap-6 mb-4">
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on Facebook"
                    >
                        <FaFacebook size={34} className="text-[#1877F2]" />
                    </a>
                    <a
                        href={`fb-messenger://share/?link=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on Messenger"
                    >
                        <FaFacebookMessenger size={34} className="text-[#00B2FF]" />
                    </a>
                    <a
                        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on X/Twitter"
                    >
                        <FaTwitter size={34} className="text-[#1DA1F2]" />
                    </a>
                    <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodeURIComponent(title || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on LinkedIn"
                    >
                        <FaLinkedin size={34} className="text-[#0A66C2]" />
                    </a>
                </div>
                <p className="text-center text-gray-500 mb-3">or share link</p>
                {/* Copyable link */}
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                    <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="flex-1 px-3 py-3 text-sm md:text-base outline-none"
                    />
                    <button
                        onClick={handleCopy}
                        className="px-4 py-3 text-orange-600 font-semibold hover:bg-orange-50 transition-colors"
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                {/* QR below link */}
                {qrUrl && (
                    <div className="mt-5 flex flex-col items-center">
                        <a
                            href={qrUrl}
                            download="event-qr.png"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                            title="Open / download QR"
                        >
                            <img
                                src={qrUrl}
                                alt="Event QR code"
                                className="w-44 h-44 object-contain rounded-lg border"
                            />
                        </a>
                        <p className="text-xs text-gray-500 mt-2">QR code (click to open/download)</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ---------- Main Page ---------- */
function EventDetailPage() {
    const [eventDetails, setEventDetails] = useState(null);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const navigate = useNavigate();
    const { eventcode } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Event | Sari-Sari Events`;
    }, []);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${eventcode}/`);
                setEventDetails(res.data);
            } catch (err) {
                console.error("Error fetching event:", err);
            }
        };
        fetchEvent();
    }, [eventcode]);

    // Removed the handleRegister function to make the button have no function
    // const handleRegister = () => {
    //   console.log("Registered for the event!");
    //   setIsRegistered(true);
    // };

    if (!eventDetails) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-600 mb-4">Loading event...</h2>
            </div>
        );
    }

    function formatAgeRestriction(restriction, allowedAge) {
        if (!restriction) return null;
        switch (restriction) {
            case "all":
                return "All Ages Allowed";
            case "18+":
                return "18 and Above Only";
            case "kids":
                return "Kids Only";
            case "guardian_needed":
                return "Minors Allowed with Guardian";
            case "custom":
                return allowedAge ? `${allowedAge} Only` : "Age Restricted";
            default:
                return allowedAge ? `${allowedAge} Only` : restriction;
        }
    }

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

    // Construct a shareable URL (uses current page URL by default)
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const qrUrl = eventDetails.event_qr_image; // from backend

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
                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight text-center mb-5">
                                {eventDetails.title}
                            </h1>

                            {/* Organizer */}
                            <div>
                                <h3 className="text-sm uppercase text-gray-500 font-semibold mb-2">Organized by</h3>
                                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(`/org/${eventDetails.created_by.user_code}`)}>
                                    <FaRegUser className="text-teal-600 text-lg" />
                                    <span className="text-gray-800 font-medium">
                                        {eventDetails.created_by.company_name}
                                    </span>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div>
                                <h3 className="text-sm uppercase text-gray-500 font-semibold mb-2">Date & Time</h3>
                                <div className="flex items-start space-x-3">
                                    <FaCalendarAlt className="text-teal-600 text-lg mt-1" />
                                    <span className="text-gray-700">
                                        {formatEventDateTime(eventDetails.start_date, eventDetails.start_time, eventDetails.end_date, eventDetails.end_time)}
                                    </span>

                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <h3 className="text-sm uppercase text-gray-500 font-semibold mb-2">Location</h3>

                                {/* Venue Details */}
                                <div className="flex items-start space-x-3">
                                    <FaMapMarkerAlt className="text-teal-600 text-lg mt-1" />
                                    <span className="text-gray-700">
                                        {eventDetails.venue_specific !== null && eventDetails.venue_specific !== '' ? eventDetails.venue_specific + ', ' : ''}{eventDetails.venue_address}
                                    </span>
                                </div>

                                {/* Map Preview */}
                                <div className="mt-3">
                                    <iframe
                                        className="rounded-xl shadow-md w-full h-64"
                                        loading="lazy"
                                        allowFullScreen
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                                            eventDetails.venue_address
                                        )}&output=embed`}
                                    ></iframe>
                                </div>
                            </div>

                            {/* Age Restriction */}
                            {eventDetails.age_restriction && (
                                <div>
                                    <h3 className="text-sm uppercase text-gray-500 font-semibold mb-2">
                                        Age Restriction
                                    </h3>
                                    <div className="flex items-center space-x-3">
                                        <FaUserLock className="text-teal-600 text-lg" />
                                        <span className="text-gray-800">
                                            {formatAgeRestriction(eventDetails.age_restriction, eventDetails.age_allowed)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Parking (only if NOT virtual) */}
                            {eventDetails.parking && eventDetails.event_type?.toLowerCase() !== "virtual" && (
                                <div>
                                    <h3 className="text-sm uppercase text-gray-500 font-semibold mb-2">Parking</h3>
                                    <div className="flex items-center space-x-3">
                                        <FaCar className="text-teal-600 text-lg" />
                                        <span className="text-gray-800">{eventDetails.parking}</span>
                                    </div>
                                </div>
                            )}

                            {/* Event Type + Share */}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg font-semibold text-sm">
                                    {eventDetails.event_type ? eventDetails.event_type : 'In-person'}
                                </span>
                                <button
                                    className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors"
                                    onClick={() => setIsShareOpen(true)}
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
                        <div id="description-section" className="bg-white p-6 md:p-8 rounded-lg shadow-xl mb-8"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
                                Description
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {eventDetails.description}
                            </p>
                        </div>

                        {/* Tickets */}
                        <div id="tickets-section" className="bg-white p-6 md:p-8 rounded-lg shadow-xl mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200 flex items-center">
                                <FaCheckSquare className="text-teal-600 mr-3" />
                                Tickets
                            </h2>
                            {eventDetails.ticket_types && eventDetails.ticket_types.length > 0 ? (
                                <div className="space-y-4">
                                    {eventDetails.ticket_types.map((ticket, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm"
                                        >
                                            <div className="mb-2 md:mb-0">
                                                <h4 className="text-lg font-semibold text-gray-800">{ticket.ticket_name}</h4>
                                                <p className="text-sm text-gray-500">
                                                    Available: {ticket.quantity_available}
                                                </p>
                                            </div>
                                            <span className="text-2xl font-bold text-orange-600">
                                                {Number(ticket.price) === 0 ? 'Free' : `$${Number(ticket.price).toFixed(2)}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">
                                    No tickets available at this time.
                                </p>
                            )}


                            {/* Registration confirmation/button */}
                            {isRegistered ? (
                                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                                    <p className="text-lg text-green-600 font-semibold flex items-center justify-center">
                                        <FaCheckCircle className="mr-2 text-xl" /> You are now registered!
                                    </p>
                                    <p className="text-gray-600 mt-2">Check your email for confirmation.</p>
                                </div>
                            ) : (
                                <>
                                    {eventDetails.ticket_types && eventDetails.ticket_types.length > 0 &&
                                        eventDetails.ticket_types[0].is_selling === false ? (
                                        <p className='font-outfit mt-4 text-gray-400 w-full text-center'>Ticket selling will open soon</p>
                                    ) : (
                                        <div className="mt-8 pt-6 border-t border-gray-200">
                                            <label className="flex items-start cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-5 w-5 text-teal-600 rounded focus:ring-teal-500 mt-1"
                                                    checked={agreeToTerms}
                                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                                />
                                                <span className="ml-3 text-sm text-gray-700 leading-relaxed">
                                                    By checking this box, I hereby agree that my information will be shared to our Event Organizer.
                                                </span>
                                            </label>
                                        </div>
                                    )
                                    }

                                    {/* Register Button */}
                                    <div className="mt-6">
                                        <button
                                            className={`w-full py-4 rounded-full text-xl font-bold transition-all duration-200 shadow-lg ${agreeToTerms
                                                ? "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                }`}
                                            disabled={!agreeToTerms || (eventDetails.ticket_types && eventDetails.ticket_types.length > 0 && eventDetails.ticket_types[0].is_selling === false)}
                                            onClick={() => navigate(`/events/${eventDetails.event_code}/checkout`)}
                                        >
                                            Register
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                shareUrl={shareUrl}
                qrUrl={qrUrl}
                title={eventDetails.title}
            />
            <div className="mb-20"></div>
        </div>
    );
}

export default EventDetailPage;