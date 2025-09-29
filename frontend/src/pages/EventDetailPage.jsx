import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaShareAlt, FaCar, FaUserLock, FaFacebook, FaFacebookMessenger, FaTwitter, FaLinkedin, FaCheckCircle, FaCheckSquare, FaLaptop } from 'react-icons/fa';
import { FaRegUser } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import api from '../api.js';
import useAuth from '../hooks/useAuth.js';
import { BiCommentDetail } from "react-icons/bi";
import { Helmet } from 'react-helmet-async';
import AdsSection from '../components/AdsSection.jsx';

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
    const [isPosterOpen, setIsPosterOpen] = useState(false);
    const [isComments, setIsComments] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [commentValue, setCommentValue] = useState('');
    const [replyValue, setReplyValue] = useState('');
    const { isLoggedIn, orgLogo } = useAuth();
    const [comments, setComments] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replies, setReplies] = useState(null);

    const navigate = useNavigate();
    const { eventcode } = useParams();

    useEffect(() => {
        if (eventDetails?.title) {
            document.title = `${eventDetails.title} | Sari-Sari Events`;
        }
    }, [eventDetails]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${eventcode}/`);
                setEventDetails(res.data);
                fetchComments(res.data.id);
            } catch (err) {
                console.error("Error fetching event:", err);
            }
        };
        fetchEvent();
    }, [eventcode]);



    const fetchComments = async (eventId) => {
        try {
            const response = await api.get(`/comments/list-create/${eventId}/`);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/comments/list-create/${eventDetails.id}/`, {
                text: commentValue,
                replied_to: replyingTo,
            });
            setCommentValue('');
            setReplyingTo(null); // Reset after successful post
            fetchComments(eventDetails.id);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleAddReply = async (e, id) => {
        e.preventDefault();
        try {
            await api.post(`/comments/list-create/${eventDetails.id}/`, {
                text: replyValue,
                replied_to: id,
            });
            setReplyValue('');
            setReplyingTo(null); // Reset after successful post
            fetchComments(eventDetails.id);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    useEffect(() => {
        if (isComments) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset'; // or 'auto'
        }

        // Cleanup function to reset overflow when component unmounts
        return () => {
            document.body.style.overflow = 'unset'; // or 'auto'
        };
    }, [isComments]);


    function timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = [
            { label: "year", seconds: 31536000 },
            { label: "month", seconds: 2592000 },
            { label: "week", seconds: 604800 },
            { label: "day", seconds: 86400 },
            { label: "h", seconds: 3600 },
            { label: "m", seconds: 60 }
        ];

        for (const i of intervals) {
            const count = Math.floor(seconds / i.seconds);
            if (count >= 1) return `${count}${i.label}${count > 1 && i.label.length > 1 ? "s" : ""} ago`;
        }
        return "Just now";
    }



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
        <>
            <Helmet>
                <title>
                    {eventDetails
                        ? `${eventDetails.title} | Sari-Sari Events`
                        : 'Loading event… | Sari-Sari Events'}
                </title>

                {eventDetails && (
                    <>
                        <meta property="og:title" content={eventDetails.title} />
                        <meta property="og:description" content={eventDetails.description} />
                        <meta property="og:image" content={eventDetails.event_poster} />
                        <meta
                            property="og:url"
                            content={`https://event.sari-sari.com/events/${eventDetails.event_code}`}
                        />
                        <meta property="og:type" content="website" />
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:image" content={eventDetails.event_poster} />
                    </>
                )}
            </Helmet>


            <div className="bg-gray-100 min-h-screen">
                {/* Poster Lightbox */}
                {isPosterOpen && (
                    <div
                        className="fixed inset-0 z-50 flex py-4 items-center justify-center bg-black/70 cursor-pointer"
                        onClick={() => setIsPosterOpen(false)}
                    >
                        <div className="w-[90%] h-full">
                            <img
                                src={eventDetails.event_poster}
                                className="rounded-2xl w-full h-full object-contain"
                                alt=""
                            />
                        </div>
                    </div>
                )}

                {isComments && (
                    <div className="fixed inset-0 z-100 py-10 h-screen flex items-center justify-center bg-black/50 font-outfit" onClick={(e) => {
                        e.stopPropagation();
                        setIsComments(false);
                    }}>
                        <div className="bg-white flex max-h-150 flex-col rounded-lg shadow-xl w-full max-w-sm md:max-w-lg lg:max-w-xl 2xl:max-w-3xl text-center" onClick={(e) => {
                            e.stopPropagation();
                        }}>
                            <div className='flex px-4 flex-row justify-between items-center w-full border-b-2 border-gray-200 py-5'>
                                <h1 className='font-semibold text-xl'>Comments</h1>
                                <button onClick={() => setIsComments(false)} className='text-lg cursor-pointer'><IoCloseOutline /></button>
                            </div>

                            <div className='flex flex-col gap-4 mt-3 px-4 pb-5 overflow-y-auto'>
                                {Array.isArray(comments) && comments.length > 0 ? (
                                    comments.map((row) => (
                                        <div key={row.id} className='gap-2 flex flex-row w-full items-start justify-start'>
                                            <img src={row.user.org_logo} className='aspect-square w-8 rounded-full' alt="" />
                                            <div className='flex flex-col items-start justify-start leading-none w-full'>
                                                <div className='flex flex-col items-start justify-start leading-none w-full bg-black/5 p-2 rounded-lg'>
                                                    <div className='flex flex-row gap-2'>
                                                        <p className='text-lg leading-none font-semibold'>{row.user.company_name || `${row.user.first_name} ${row.user.last_name}`}</p>
                                                        <p className='text-sm text-grey'>{timeAgo(row.created_at)}</p>
                                                    </div>
                                                    <p className='text-left'>{row.text}</p>
                                                </div>
                                                <button className='cursor-pointer text-grey mt-1 text-sm leading-none' onClick={() => setReplyingTo((prev) => (prev?.id === row.id ? null : row))}>reply</button>

                                                {row.replies.length > 0 && (
                                                    <>
                                                        <button onClick={() =>
                                                            setReplies(replies === row.id ? null : row.id)
                                                        } className='text-black/60 leading-8 cursor-pointer'>{replies === row.id
                                                            ? "Hide replies"
                                                            : `View ${row.replies.length === 1 ? "reply" : `all ${row.replies.length} replies`}`}</button>
                                                        <div className='flex flex-col gap-4 px-4'>
                                                            {replies === row.id && (
                                                                row.replies.map((reply) => (
                                                                    <div key={reply.id} className='gap-2 flex flex-row w-full items-start justify-start'>
                                                                        <img src={orgLogo} className='aspect-square w-8 rounded-full' alt="" />
                                                                        <div className='flex flex-col items-start justify-start leading-none w-full'>
                                                                            <div className='flex flex-col items-start justify-start leading-none w-full bg-black/5 p-2 rounded-lg'>
                                                                                <div className='flex flex-row gap-2'>
                                                                                    <p className='text-lg leading-none font-semibold'>{reply.user.company_name || `${reply.user.first_name} ${reply.user.last_name}`}</p>
                                                                                    <p className='text-sm text-grey'>{timeAgo(reply.created_at)}</p>
                                                                                </div>

                                                                                <p className='text-left'>{reply.text}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </>
                                                )}


                                                {replyingTo?.id === row.id && (
                                                    <form key={replyingTo.id} onSubmit={(e) => handleAddReply(e, replyingTo.id)} className='py-3 self-end w-full px-3 flex flex-row items-center gap-2 justify-between'>
                                                        <img src={orgLogo} className='aspect-square w-8 rounded-full' alt="" />
                                                        <input name='replyValue' value={replyValue} onChange={(e) => setReplyValue(e.target.value)} type="text" className='w-full outline-none border-2 rounded-lg border-gray-200 py-2 px-2' placeholder={`Write a public reply to ${replyingTo.user.company_name || replyingTo.user.first_name}...`} />
                                                        <button type='submit' disabled={!replyValue}>
                                                            <IoSend className={`text-xl ${replyValue && 'text-secondary cursor-pointer'}`} disabled={!replyValue} />
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='w-full flex flex-col py-4 items-center justify-center'>
                                        <BiCommentDetail className='text-7xl text-gray-500' />
                                        <p className='text-lg font-semibold text-gray-500'>No comments yet</p>
                                    </div>
                                )}
                            </div>

                            {isLoggedIn && (
                                <form onSubmit={handleAddComment} className='py-3 shadow-lg self-end w-full px-3 flex flex-row items-center gap-2 justify-between'>
                                    <img src={orgLogo} className='aspect-square w-8 rounded-full' alt="" />
                                    <input name='commentValue' value={commentValue} onChange={(e) => setCommentValue(e.target.value)} type="text" className='w-full outline-none border-2 rounded-lg border-gray-200 py-2 px-2' placeholder='Write a public comment...' />
                                    <button type='submit' disabled={!commentValue}>
                                        <IoSend className={`text-xl ${commentValue && 'text-secondary cursor-pointer'}`} disabled={!commentValue} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                <AdsSection />
                {/* Main Grid Layout */}
                <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Section (Poster + Nav + Description + Tickets) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Poster */}
                        <div
                            className="relative w-full h-64 sm:h-80 md:h-[400px] overflow-hidden rounded-2xl cursor-pointer group"
                            onClick={() => setIsPosterOpen(true)}
                        >
                            <img
                                src={eventDetails.event_poster}
                                alt={eventDetails.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Hover message */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-lg font-medium transition-opacity duration-300">
                                Click to preview
                            </div>
                        </div>


                        {/* Navigation Tabs */}
                        <div className="bg-white rounded-lg shadow-md">
                            <nav className="grid grid-cols-3 w-full items-center py-4 place-items-center">
                                <a
                                    href="#description-section"
                                    className="text-base md:text-lg font-semibold text-gray-700 hover:text-teal-600 rounded-md transition-colors"
                                >
                                    Description
                                </a>
                                <a
                                    href="#tickets-section"
                                    className="text-base md:text-lg font-semibold text-gray-700 hover:text-teal-600 rounded-md transition-colors"
                                >
                                    Tickets
                                </a>
                                <a
                                    onClick={() => setIsComments(true)}
                                    className="text-base md:text-lg font-semibold text-gray-700 hover:text-teal-600 rounded-md transition-colors cursor-pointer"
                                >
                                    Comments
                                </a>
                            </nav>
                        </div>

                        {/* Description Section */}
                        <div
                            id="description-section"
                            className="bg-white p-6 md:p-8 rounded-lg shadow-xl mb-8" >
                            <h2 className="text-lg md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
                                Description
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {eventDetails.description}
                            </p>
                        </div>

                        {/* Tickets Section */}
                        <div
                            id="tickets-section"
                            className="bg-white p-6 md:p-8 rounded-lg shadow-xl mb-8">
                            <h2 className="text-lg md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200 flex items-center">
                                <FaCheckSquare className="text-teal-600 mr-2" />
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
                                                <h4 className="text-lg font-semibold text-gray-800">
                                                    {ticket.ticket_name}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    Available: {ticket.quantity_available}
                                                </p>
                                            </div>
                                            <span className="text-2xl font-bold text-orange-600">
                                                {Number(ticket.price) === 0
                                                    ? 'Free'
                                                    : `₱${Number(ticket.price).toLocaleString('en-PH', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}`}
                                            </span>

                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">
                                    No tickets available at this time.
                                </p>
                            )}

                            {/* Registration Confirmation / Button */}
                            {isRegistered ? (
                                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                                    <p className="text-lg text-green-600 font-semibold flex items-center justify-center">
                                        <FaCheckCircle className="mr-2 text-xl" /> You are now
                                        registered!
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                        Check your email for confirmation.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {eventDetails.ticket_types && eventDetails.ticket_types.length > 0 &&
                                        eventDetails.ticket_types[0].is_selling === false ? (
                                        <p className='font-outfit mt-4 text-gray-400 w-full text-center'>Ticket selling will open soon</p>
                                    ) : eventDetails.ticket_types.some(ticket => ticket.quantity_available === 0 || ticket.quantity_available === '0') ? (
                                        <p className='font-outfit mt-4 text-gray-400 w-full text-center'>Sold out</p>
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
                                    )}

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

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 space-y-6">
                            {/* Title */}
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
                                {eventDetails.title}
                            </h1>

                            {/* Organizer */}
                            <div>
                                <h3 className="text-sm uppercase text-gray-500 font-semibold mb-1">
                                    Organized by
                                </h3>
                                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(`/org/${eventDetails.created_by.user_code}`)}>
                                    <FaRegUser className="text-teal-600 text-lg" />
                                    <span className="text-gray-800 font-medium">
                                        {eventDetails.created_by.company_name}
                                    </span>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div>
                                <h3 className="text-sm uppercase text-gray-500 font-semibold mb-1">
                                    Date & Time
                                </h3>
                                <div className="flex items-start space-x-3">
                                    <FaCalendarAlt className="text-teal-600 text-lg mt-1" />
                                    <span className="text-gray-700">
                                        {formatEventDateTime(eventDetails.start_date, eventDetails.start_time, eventDetails.end_date, eventDetails.end_time)}
                                    </span>
                                </div>

                                {/* Location / Virtual */}
                                {eventDetails.event_type !== 'virtual' ? (
                                    <div>
                                        <h3 className="text-sm uppercase text-gray-500 font-semibold mb-1">
                                            Location
                                        </h3>
                                        <div className="flex items-start space-x-2">
                                            <FaMapMarkerAlt className="text-teal-600 text-lg mt-1" />
                                            <span className="text-gray-700">
                                                {eventDetails.venue_specific !== null && eventDetails.venue_specific !== '' ? eventDetails.venue_specific + ', ' : ''}{eventDetails.venue_address}
                                            </span>
                                        </div>
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
                                ) : (
                                    <div>
                                        <h3 className="text-sm uppercase text-gray-500 font-semibold mb-1">
                                            Virtual
                                        </h3>
                                        <div className="flex items-start space-x-2">
                                            <FaLaptop className="text-teal-600 text-lg mt-1" />
                                            <span className="text-gray-700">
                                                {eventDetails.meeting_platform}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Age Restriction */}
                                {eventDetails.age_restriction && (
                                    <div>
                                        <h3 className="text-sm uppercase text-gray-500 font-semibold mb-1">
                                            Age Restriction
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <FaUserLock className="text-teal-600 text-lg" />
                                            <span className="text-gray-800">
                                                {formatAgeRestriction(eventDetails.age_restriction, eventDetails.age_allowed)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Parking */}
                                {eventDetails.parking && eventDetails.event_type?.toLowerCase() !== "virtual" && (
                                    <div>
                                        <h3 className="text-sm uppercase text-gray-500 font-semibold mb-1">
                                            Parking
                                        </h3>
                                        <div className="flex items-center space-x-2">
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
            </div>
        </>
    );

}

export default EventDetailPage;