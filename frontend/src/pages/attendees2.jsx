import React, { useState } from "react";
import { Link } from "react-router-dom";
import OrganizerNav from "../components/OrganizerNav";
import {FiUsers } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";

const Attendees2 = () => {
    const [search, setSearch] = useState("");

    const events = [
        { id: 1, name: "Pangalan ng Events", attendees: 200 },

    ];

    const filteredEvents = events.filter((event) =>
        event.name.toLowerCase().includes(search.toLowerCase())
    );

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
                                {filteredEvents.map((event) => (
                                    <Link key={event.id} to={`/attendees/${event.id}`} className="block">
                                        <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-100 transition cursor-pointer">
                                            <span className="font-medium text-gray-700">{event.name}</span>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <span>{event.attendees} Attendees</span>
                                                <FiUsers className="text-lg" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                        </div>



                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendees2;
