import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import api from '../api.js';
import {
    FaBriefcase,
    FaUsers,
    FaPalette,
    FaFootballBall,
    FaVoteYea,
    FaGraduationCap,
    FaDonate,
} from "react-icons/fa";

function CategoriesList() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                const res = await api.get(`/event-public-view/`);
                setEvents(res.data);
                console.log(res.data)
            } catch (err) {
                console.error(err);
            }
        };

        fetchAllEvents();
    }, []);


    const categoryMap = {
        corporate: {
            names: "corporate",
            icon: <FaBriefcase className="text-teal-700 text-xl lg:text-3xl" />,
        },
        association: {
            names: "association",
            icon: <FaBriefcase className="text-teal-700 text-xl lg:text-3xl" />,
        },
        social: {
            names: "social",
            icon: <FaUsers className="text-[#FF965D] text-xl lg:text-3xl" />,
        },
        cultural: {
            names: "cultural",
            icon: <FaPalette className="text-[#EF4B4C] text-xl lg:text-3xl" />,
        },
        sports: {
            names: "sports & Recreational",
            icon: <FaFootballBall className="text-teal-700 text-xl lg:text-3xl" />,
        },
        political: {
            names: "political & Government",
            icon: <FaVoteYea className="text-[#FF965D] text-xl lg:text-3xl" />,
        },
        educational: {
            names: "educational",
            icon: <FaGraduationCap className="text-[#EF4B4C] text-xl lg:text-3xl" />,
        },
        fundraising: {
            names: "fundraising",
            icon: <FaDonate className="text-teal-700 text-xl lg:text-3xl" />,
        },
    };

    const counts = Object.fromEntries(
        Object.keys(categoryMap).map(key => [key, 0])
    );

    events.forEach(ev => {
        const cat = ev.category?.toLowerCase();
        if (!cat) return;

        for (const [label, info] of Object.entries(categoryMap)) {
            if (info.names.toLowerCase() === cat) {   // compare strings
                counts[label] += 1;
                break;
            }
        }
    });


    const formatCount = (n) => {
        if (n >= 1000) {
            const val = (n / 1000).toFixed(1);   // 1.0, 1.5, 2.3, etc.
            return val.endsWith('.0') ? `${val.slice(0, -2)}K` : `${val}K`;
        }
        return n;
    };



    return (
        <section id="recommended-events" className="py-10 md:py-20 w-full flex flex-col items-center justify-center shadow-inner-lg bg-white">
            <div className="w-[90%] lg:w-[80%] xl:w-[75%] 2xl:w-[60%] font-outfit">
                <div className="flex flex-row w-full items-end justify-between">
                    <h1 className='text-3xl font-bold text-teal-800 tracking-tight'>Browse by Category</h1>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 w-full gap-4 md:gap-5 py-5'>
                    {Object.entries(categoryMap).map(([key, info]) => (
                        <div
                            key={key}
                            className="bg-[#E6E6E6] py-5 px-3 cursor-pointer hover:bg-[#E6E6E6]/80 transition-all duration-300 md:px-4 rounded-md shadow-sm/30 flex items-center gap-2"
                            onClick={() => navigate(`/${key}/events`, { state: { category: info.names } })}                            
                        >
                            {info.icon}
                            <div>
                                <p className="leading-none text-lg font-semibold text-gray-700">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {formatCount(counts[key])} {counts[key] === 1 ? "Event" : "Events"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default CategoriesList;
