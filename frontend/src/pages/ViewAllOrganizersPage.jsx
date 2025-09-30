// src/pages/ViewAllEventsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventCard from "../components/EventCard";
import api from '../api.js';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

function ViewAllEventsPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate();
    const [organizers, setOrganizers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAllEvents = async () => {
            setIsLoading(true);
            try {
                const res = await api.get(`/organizers/`);
                setOrganizers(res.data);
                console.log(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllEvents();
    }, []);

    return (
        <div className="bg-gray/1 min-h-screen py-10">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-10">
                    All Organizers
                </h1>

                {isLoading && (
                    <div className='flex flex-row w-full mt-4'>
                        <div className='bg-gray-200 p-3 shadow-lg rounded-xl w-45'>
                            <Stack spacing={0}>
                                <Skeleton variant="rounded" animation='wave' height={130} />
                                <Skeleton variant="text" animation='wave' height={30} />
                            </Stack>
                        </div>
                    </div>
                )}

                <div className='w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 place-items-center'>
                {organizers.length > 0 ? (
                    organizers.map((org, i) => (
                        <Tooltip key={i} title={`Go to ${org.company_name}`} placement="top" arrow>
                            <div key={i} onClick={() => navigate(`/org/${org.user_code}`)} className="cursor-pointer hover:bg-gray-100 transition-all duration-300 flex flex-col w-full p-3 bg-gray-200 rounded-xl shadow-md/30 flex-shrink-0 snap-start">
                                <img src={org.org_logo} alt="" className='aspect-square w-full rounded-lg object-cover' />
                                <p className='font-bold text-black/70 w-full truncate'>{org.company_name}</p>
                            </div>
                        </Tooltip>
                    ))
                ) : (
                    !isLoading && (
                        <p className="text-center text-gray-600 text-lg">
                            No organizers available
                        </p>
                    )
                )}
                </div>
            </div>
        </div>
    );
}

export default ViewAllEventsPage;
