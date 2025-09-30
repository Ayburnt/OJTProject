import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import api from '../api.js';
import { FaArrowRight } from "react-icons/fa";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

function OrganizersList() {
  const [organizers, setOrganizers] = useState([]);
  const navigate = useNavigate();
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

  // Limit to 8 events for display
  const limitedOrgs = Array.isArray(organizers) ? organizers.slice(0, 5) : [];


  return (
    <section id="recommended-events" className="py-10 md:py-12 w-full flex flex-col items-center justify-center shadow-inner-lg bg-secondary">
      <div className="w-[90%] lg:w-[80%] xl:w-[77%] 2xl:w-[60%] font-outfit">
        <div className="flex flex-row w-full items-end justify-between">
          <h1 className='text-3xl font-bold text-teal-800 tracking-tight text-white'>Browse by Organizer</h1>
          {organizers.length > 5 && (
            <button className='bg-gray-200 font-medium px-4 py-2 rounded-lg cursor-pointer hidden md:flex items-center gap-2' onClick={() => navigate('/organizers')}>View All <FaArrowRight /></button>
          )}
        </div>

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

        <div className="flex flex-row lg:grid lg:grid-cols-5 w-full gap-4 md:gap-5 pb-8 overflow-x-auto overflow-y-hidden mt-4 no-scrollbar scroll-smooth snap-x snap-mandatory">
          {limitedOrgs.length > 0 ? (
            limitedOrgs.map((org, i) => (
              <Tooltip key={i} title={`Go to ${org.company_name}`} placement="top" arrow>
              <div key={i} onClick={() => navigate(`/org/${org.user_code}`)} className="cursor-pointer hover:bg-gray-100 transition-all duration-300 flex flex-col w-45 lg:w-full p-3 bg-gray-200 rounded-xl shadow-xl/30 flex-shrink-0 snap-start">
                <img src={org.org_logo} alt="" className='aspect-square w-full rounded-lg object-cover' />
                <p className='font-bold text-black/70 w-full truncate'>{org.company_name}</p>
              </div>
              </Tooltip>
            ))
          ) : (
            !isLoading && (
              <div className='w-full item-center'>
                <p className="text-gray-200 text-3xl font-outfit italic text-center"> No organizers available</p>
              </div>
            )
          )}
        </div>

        {/* Show "View All Events" only if 8 or more events exist */}
        {organizers.length > 5 && (
          <div className="text-center mt-4 md:hidden w-full flex items-center justify-center">
            <Link
              to="/organizers"
              className="bg-gray-200 text-gray-600 px-6 py-3 rounded-full text-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-xl flex flex-row gap-2 items-center cursor-pointer"
            >
              View All <FaArrowRight />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default OrganizersList;
