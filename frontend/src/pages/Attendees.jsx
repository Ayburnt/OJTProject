import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import OrganizerNav from "../components/OrganizerNav";
import { FiUsers } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import api from "../api";

const Attendees2 = () => {
    const [search, setSearch] = useState("");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userCode  } = useParams(); // ✅ fixed import + variable

    useEffect(() => {
        const fetchOrganizerEvents = async () => {
            try {
                const response = await api.get(`/attendees/organizer-events/${userCode}/`); // ✅ fixed template literal
                setEvents(response.data);
            } catch (err) {
                setError("Failed to fetch events. Please check your network and ensure the Django server is running.");
                console.error("Error fetching organizer events:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizerEvents();
    }, [userCode]); // ✅ dependency added

    const filteredEvents = events.filter((event) =>
        (event.title || "").toLowerCase().includes(search.toLowerCase()) // ✅ safer
    );

    if (loading) {
        return (
            <div className="bg-alice-blue min-h-screen font-outfit flex justify-center items-center">
                <p>Loading events...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-alice-blue min-h-screen font-outfit flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-alice-blue min-h-screen font-outfit">
            {/* Navigation */}
            <OrganizerNav />

            {/* Main content wrapper */}
            <div className="flex flex-col mt-10 md:ml-64 p-4 md:p-8 lg:p-12 lg:mt-0 md:mt-0">
                {/* Profile icon */}
                <div className="flex justify-end w-full mb-6">
                    <CgProfile className="hidden md:flex text-[2.5rem] text-gray-300 mr-10" />
                </div>

                {/* Table container aligned perfectly under profile */}
                <div className="w-full max-w-6xl mx-auto">
                    <div className="p-5 md:p-8 lg:p-10 border border-gray-300 rounded-xl shadow bg-white">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                            Manage Event Attendees
                        </h1>

                        {/* Filters + Event List Wrapper */}
                        <div className="w-full max-w-md">
                            {/* Search */}
                            <div className="relative mb-6 w-full lg:w-[75%]">
                                <CiSearch
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 border-b border-gray-400 focus:border-teal-500 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
                                />
                            </div>
                            {/* Events List */}
                            <div className="space-y-4 w-full">
                                {filteredEvents.length > 0 ? (
                                    filteredEvents.map((event) => (
                                        <Link key={event.id} to={`/attendees/${event.event_code}`} className="block">
                                            <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-100 transition cursor-pointer">
                                                <span className="font-medium text-gray-700">
                                                    {event.title}
                                                </span>
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <span>{event.attendees_count || 0} Attendees</span>
                                                    <FiUsers className="text-lg" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center">No events found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendees2;
