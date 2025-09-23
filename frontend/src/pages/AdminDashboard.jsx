import { useEffect, useState } from 'react';
import { FaCalendarAlt } from "react-icons/fa";
import AdminNav from "../components/AdminNav";
import { CgProfile } from 'react-icons/cg';
import { FaCheck, FaUserGroup, FaClock } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { LuPhilippinePeso } from "react-icons/lu";
import { IoEyeSharp, IoLocationOutline } from "react-icons/io5";
import useAuth from '../hooks/useAuth';
import api from '../api';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

function AdminDashboard() {

  useEffect(() => {
    document.title = "Admin Dashboard | Sari-Sari Events";
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const { isLoggedIn, userEmail } = useAuth();
  const displayName = userEmail ? userEmail.split('@')[0] : "Organizer";
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const { orgLogo } = useAuth();

  useEffect(() => {
    const fetchAllEvents = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/event-public-view/');
        setEvents(res.data);

        const res1 = await api.get(`accounts/admin-view/`);
        setAccounts(res1.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllEvents();
  }, [])

  return (
    <div className="h-screen bg-aliceblue font-outfit grid grid-cols-1 md:grid-cols-6 xl:grid-cols-9">
      {/* Sidebar */}
      <AdminNav />

      {/* Main Content */}
      <main className="overflow-y-scroll col-span-6 md:col-span-4 xl:col-span-7 flex flex-col px-6 mt-20 md:mt-5 md:px-8 lg:px-12 py-6">

        {/* Profile Icon */}
        <div className="justify-end w-full mb-4 hidden md:flex">
          {isLoading ? (
            <Stack spacing={0}>
              <Skeleton variant="circular" width={40} height={40} />
            </Stack>
          ) : (
            isLoggedIn && (
              <img src={orgLogo} alt="" className='w-[40px] h-[40px] rounded-full object-contain' />
            )
          )}
        </div>

        {/* Greeting */}
        <div className="mb-8 text-center lg:text-center w-full flex flex-col justify-center items-center">
          {isLoading ? (
            <Stack spacing={0} className='w-1/2'>
              <Skeleton variant="text" animation='wave' height={60} />
              <Skeleton variant="text" animation='wave' height={30} />
            </Stack>
          ) : (
            <>
              <h2 className="text-3xl font-medium text-gray-700">
                Good Morning,{" "}
                <span className="text-teal-600 font-bold">{displayName}</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Here's what's happening with your events today.
              </p>
            </>
          )}
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col-reverse lg:flex-row gap-6 w-full max-w-[1400px] mx-auto">

          {/* Left Section */}
          <div className="w-full lg:w-[60%] space-y-4">

            {/* Tabs */}
            <div className="w-full md:max-w-3xl mx-auto mb-4">
              {isLoading ? (
                <Stack spacing={0}>
                  <Skeleton variant="text" animation='wave' height={60} />
                </Stack>
              ) : (
                <div className="flex flex-row gap-1.5 items-center overflow-x-auto hide-scrollbar text-[16px]">
                  <button
                    onClick={() => setSelectedCategory('All Events')}
                    className="group text-secondary hover:text-secondary-500 hover:font-semibold active:text-secondary-500 active:font-semibold focus:text-secondary-500 focus:font-semibold whitespace-nowrap px-3 py-1.5 rounded-full font-outfit flex items-center gap-1.5"
                  >
                    All Events
                    <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white px-2 py-0.5 rounded-md text-[13px] font-semibold">6</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Ongoing')}
                    className="group text-secondary hover:text-secondary-500 hover:font-semibold active:text-secondary-500 active:font-semibold focus:text-secondary-500 focus:font-semibold whitespace-nowrap px-3 py-1.5 rounded-full font-outfit flex items-center gap-1.5"
                  >
                    Ongoing
                    <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white px-2 py-0.5 rounded-md text-[13px] font-semibold">3</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Upcoming')}
                    className="group text-secondary hover:text-secondary-500 hover:font-semibold active:text-secondary-500 active:font-semibold focus:text-secondary-500 focus:font-semibold whitespace-nowrap px-3 py-1.5 rounded-full font-outfit flex items-center gap-1.5"
                  >
                    Upcoming
                    <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white px-2 py-0.5 rounded-md text-[13px] font-semibold">3</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Canceled')}
                    className="group text-secondary hover:text-secondary-500 hover:font-semibold active:text-secondary-500 active:font-semibold focus:text-secondary-500 focus:font-semibold whitespace-nowrap px-3 py-1.5 rounded-full font-outfit flex items-center gap-1.5"
                  >
                    Canceled
                    <span className="bg-third text-secondary group-hover:bg-secondary group-hover:text-white px-2 py-0.5 rounded-md text-[13px] font-semibold">3</span>
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Events</h3>

              {isLoading ? (
                <Stack spacing={0}>
                  <Skeleton variant="rounded" animation='wave' height={120} />
                </Stack>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                      <h4 className="text-lg font-semibold text-gray-800">Tuli ni Josh: Kids Party</h4>
                      <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full">Pending</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="bg-teal-600 hover:bg-teal-700 p-2 rounded-md">
                        <FaCheck className="text-white text-md" />
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 p-2 rounded-md">
                        <RxCross2 className="text-white text-md" />
                      </button>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-secondary" />
                      <span>Sep 12, 2025, 10:00 AM – 7:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoLocationOutline className="text-secondary" />
                      <span>SMX Convention Center</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUserGroup className="text-secondary" />
                      <span>2000 Attendees</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <CgProfile className="hidden md:flex text-[2rem] text-gray-400" />
                      <div>
                        <p>Organized by: <span className="font-medium text-gray-700">Tech Corp.</span></p>
                        <p>Submitted June 18, 2025, 12:30 PM</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 text-teal-600 font-medium">
                      View <IoEyeSharp className="text-lg" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Stats */}
          <div className="w-full lg:w-[40%] flex-shrink-0 lg:mr-10 space-y-4">
            {isLoading ? (
              <Stack spacing={2}>
                <Skeleton variant="rounded" animation='wave' height={50} />
                <Skeleton variant="rounded" animation='wave' height={50} />
                <Skeleton variant="rounded" animation='wave' height={50} />
                <Skeleton variant="rounded" animation='wave' height={50} />
              </Stack>
            ) : (
              <>
                <div className="bg-white shadow p-4 rounded-lg flex items-center justify-between">
                  <div className='flex flex-row gap-2'>
                    <FaCalendarAlt className="text-teal-600 text-xl" />
                    <p className="text-sm text-gray-500 flex-1 text-center">Total Overall Events</p>
                  </div>
                  <p className="text-xl font-bold text-gray-700 pl-2">{events?.length}</p>
                </div>

                <div className="bg-white shadow p-4 rounded-lg flex items-center justify-between">
                  <div className='flex flex-row gap-2'>
                    <FaUserGroup className="text-teal-600 text-xl" />
                    <p className="text-sm text-gray-500 flex-1 text-center">Active Users</p>
                  </div>
                  <p className="text-xl font-bold text-gray-700 pl-2">{accounts.length}</p>
                </div>

                <div className="bg-white shadow p-4 rounded-lg flex items-center justify-between">
                  <div className='flex flex-row gap-2'>
                    <LuPhilippinePeso className="text-teal-600 text-xl" />
                    <p className="text-sm text-gray-500 flex-1 text-center">Total Revenue</p>
                  </div>
                  <p className="text-xl font-bold text-gray-700 pl-2">₱0.00</p>
                </div>

                <div className="bg-white shadow p-4 rounded-lg flex items-center justify-between">
                  <div className='flex flex-row gap-2'>
                    <FaClock className="text-teal-600 text-xl" />
                    <p className="text-sm text-gray-500 flex-1 text-center">Pending Approvals</p>
                  </div>
                  <p className="text-xl font-bold text-gray-700 pl-2">null</p>
                </div>
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
