import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaShareAlt, FaChevronDown, FaChevronUp, FaTicketAlt } from 'react-icons/fa';

function EventDetailPage() {
    const { id } = useParams();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // --- Dummy Data for Demonstration ---
    const eventData = {
        1: {
            title: 'Skechers Friendship Walk 2025',
            date: '23 August 2025, 07:59 - 24 August 2035, 11:00',
            location: 'Đường Trần Bạch Đằng - Thủ Thiêm',
            ageRestriction: 'Must be 6+',
            imageUrl: 'https://s3-ap-southeast-1.amazonaws.com/jomrun-images-new/cover_images/cover_image_opiCp9U70j4YpeT.jpg',
            description: "‘Friendship Walk’ is an annual sports event organized by Skechers, a leading fashion and athletic footwear brand in the United States. Its goal is to promote an active lifestyle and connect communities, one step at a time. \n\nFollowing the resounding success of the 2024 season, Skechers Friendship Walk 2025 is on a grander scale and with even more vibrant energy. It will continue to be an unmissable gathering for sports lovers, from professional athletes to those who enjoy running and walking for leisure. \n\nMore than just a sports event, Friendship Walk serves a profound humanitarian mission – fostering community bonds and spreading kindness. Skechers joins hands with charitable organizations such as Operation Smile Vietnam and Thi Đua Ngheo Vietnam, working together to bring bright smiles and beautiful actions to society. \n\nLet’s walk together – for health, the community, and a journey full of meaning!",
            ticketCategories: [
                {
                    name: '5KM',
                    tickets: [
                        { type: '5KM EARLY BIRD', price: '250.000 VND', status: 'available' },
                        { type: '5KM REGULAR', price: '300.000 VND', status: 'available' },
                    ]
                },
                {
                    name: '10KM',
                    tickets: [
                        { type: '10KM EARLY BIRD', price: '350.000 VND', status: 'available' },
                        { type: '10KM REGULAR', price: '400.000 VND', status: 'sold out' },
                    ]
                },
            ],
        },
        2: {
            title: 'Art & Design Expo',
            date: 'Aug 5, 2025, 10:00 - 17:00',
            location: 'SMX Convention Center, Pasay City',
            ageRestriction: 'All Ages',
            imageUrl: 'https://via.placeholder.com/1920x800/93D3A2/FFFFFF?text=Art+Design+Expo+Banner',
            description: "Explore cutting-edge art installations, innovative design concepts, and interact with renowned artists and designers. Workshops and talks available. This expo aims to bring together creators and enthusiasts from across the globe, fostering a vibrant community of artistic expression and innovation. Experience live demonstrations, interactive exhibits, and opportunities to purchase unique pieces directly from the artists.",
            ticketCategories: [
                {
                    name: 'General Admission',
                    tickets: [
                        { type: 'Adult', price: '₱800', status: 'available' },
                        { type: 'Student', price: '₱600', status: 'available' },
                    ]
                },
                {
                    name: 'VIP Pass',
                    tickets: [
                        { type: 'VIP Early Bird', price: '₱1,500', status: 'available' },
                        { type: 'VIP Regular', price: '₱2,000', status: 'available' },
                    ]
                },
            ],
        },
    };

    const event = eventData[id];
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [openCategories, setOpenCategories] = useState({});
    const [discountCode, setDiscountCode] = useState('');
    const [discountStatus, setDiscountStatus] = useState({ applied: false, message: '' });
    // New state to manage ticket quantities
    const [selectedTickets, setSelectedTickets] = useState({});

    // Calculate total selected tickets
    const totalTicketsSelected = Object.values(selectedTickets).reduce((sum, current) => sum + current, 0);

    const toggleCategory = (categoryName) => {
        setOpenCategories(prev => ({
            ...prev,
            [categoryName]: !prev[categoryName]
        }));
    };

    const handleApplyDiscount = () => {
        if (discountCode.toUpperCase() === 'SKECHERS25') {
            setDiscountStatus({ applied: true, message: 'Discount applied!' });
        } else {
            setDiscountStatus({ applied: false, message: 'Invalid code.' });
        }
    };
    
    // New function to handle quantity change
    const handleQuantityChange = (categoryName, ticketType, quantity) => {
        const key = `${categoryName}-${ticketType}`;
        setSelectedTickets(prev => ({
            ...prev,
            [key]: parseInt(quantity, 10)
        }));
    };

    if (!event) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Event Not Found</h2>
                <p className="text-gray-700">The event you are looking for does not exist or has been removed.</p>
                <Link to="/" className="mt-8 inline-block bg-teal-600 text-white px-6 py-3 rounded-full hover:bg-teal-700 transition-colors">
                    Go Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <section className="relative w-full h-[400px] md:h-[550px] lg:h-[650px] overflow-hidden">
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </section>
            <div className="relative z-10 -mt-40 md:-mt-56 lg:-mt-80 container mx-auto px-4">
                <div className="flex flex-col lg:flex-row lg:gap-8">
                    <div className="lg:w-1/3 order-first lg:order-last mb-8 lg:mb-0">
                        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 sticky lg:top-28">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight mb-4">
                                {event.title}
                            </h1>
                            <div className="flex justify-end mb-4">
                                <button className="text-gray-600 hover:text-teal-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                                    <FaShareAlt className="text-xl" />
                                </button>
                            </div>
                            <div className="space-y-4 text-gray-700 text-base mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <FaCalendarAlt className="text-teal-600 text-lg" />
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaMapMarkerAlt className="text-teal-600 text-lg" />
                                    <span>{event.location}</span>
                                </div>
                                {event.ageRestriction && (
                                    <div className="flex items-center space-x-3">
                                        <span className="font-semibold text-gray-800 text-lg">
                                            {event.ageRestriction}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-2/3">
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
                        <div id="description-section" className="bg-white p-6 md:p-8 rounded-lg shadow-xl mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
                                Description
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>
                        </div>
                        <div id="tickets-section" className="bg-white p-6 md:p-8 rounded-lg shadow-xl mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
                                Tickets
                            </h2>
                            {event.ticketCategories && event.ticketCategories.length > 0 ? (
                                <div className="space-y-4">
                                    {event.ticketCategories.map((category, catIndex) => (
                                        <div key={catIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                                            <button
                                                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                                                onClick={() => toggleCategory(category.name)}
                                            >
                                                <span className="font-semibold text-gray-800 text-lg">{category.name}</span>
                                                {openCategories[category.name] ? (
                                                    <FaChevronUp className="text-gray-600" />
                                                ) : (
                                                    <FaChevronDown className="text-gray-600" />
                                                )}
                                            </button>
                                            {openCategories[category.name] && (
                                                <div className="p-4 bg-white border-t border-gray-200">
                                                    <div className="space-y-3">
                                                        {category.tickets.map((ticket, ticketIndex) => (
                                                            <div key={ticketIndex} className="flex justify-between items-center py-2 border-b border-dashed border-gray-100 last:border-b-0">
                                                                <span className="text-gray-700">{ticket.type}</span>
                                                                <div className="flex items-center space-x-4">
                                                                    <span className="text-lg font-bold text-orange-600">
                                                                        {ticket.price}
                                                                    </span>
                                                                    {ticket.status === 'available' ? (
                                                                        <div className="flex items-center space-x-2">
                                                                            <select
                                                                                className="p-2 border border-gray-300 rounded-md"
                                                                                value={selectedTickets[`${category.name}-${ticket.type}`] || 0}
                                                                                onChange={(e) => handleQuantityChange(category.name, ticket.type, e.target.value)}
                                                                            >
                                                                                {[...Array(11).keys()].map(num => (
                                                                                    <option key={num} value={num}>{num}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    ) : (
                                                                        <span className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm">
                                                                            Sale Ended
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">No tickets available at this time.</p>
                            )}
                            
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
                                    <p className={`mt-2 text-sm ${discountStatus.applied ? 'text-green-600' : 'text-red-600'}`}>
                                        {discountStatus.message}
                                    </p>
                                )}
                            </div>

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

                            <div className="mt-6">
                                <button
                                    className={`w-full py-4 rounded-full text-xl font-bold transition-all duration-200 shadow-lg ${
                                        (agreeToTerms && totalTicketsSelected > 0) ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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