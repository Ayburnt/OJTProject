// src/pages/EditEvent.jsx
import React, { useEffect, useState } from 'react';
import api from '../api.js';
import CEStep1 from '../components/CEStep1.jsx';
import CEStep2 from '../components/CEStep2.jsx';
import CEStep3 from '../components/CEStep3.jsx';
import CEStep4 from './CreateEventRegForm.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { IoIosArrowBack } from "react-icons/io";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// Use the same helper functions
const createNewTicket = () => ({
    ticket_name: '',
    ticket_type: 'free',
    price: 0,
    quantity_total: 100,
    quantity_available: 100,
    is_selling: false,
});
const createNewQuestion = () => ({
    question_label: '',
    question_type: 'short',
    is_required: false,
    options: [{ option_value: '' }],
});

const EditEventForm = () => {
    const { eventcode } = useParams();
    const navigate = useNavigate();
    const { userCode } = useAuth();
    const [step, setStep] = useState(1);
    const totalSteps = 4;
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(null);
    const [posterErr, setPosterErr] = useState('');
    const [isPosterErr, setIsPosterErr] = useState(false);
    const [isSeatingMapErr, setIsSeatingMapErr] = useState(false);
    const [seatingMapErr, setSeatingMapErr] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '' });

    // --- Add all the helper functions here ---
    const handleEventChange = (e) => {
        const { name, value, files, type } = e.target;
    
        if (type === 'file' && files?.length > 0) {
            const file = files[0];
            setFormData(prev => ({ ...prev, [name]: file }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                // Add any specific logic from your CreateEvent.jsx here
            }));
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    const handleTicketChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const updatedTickets = [...formData.ticket_types];
        updatedTickets[index][name] = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, ticket_types: updatedTickets });
    };

    const handleAddTicket = () => {
        setFormData(prev => ({ ...prev, ticket_types: [...prev.ticket_types, createNewTicket()] }));
    };

    const handleRemoveTicket = (index) => {
        const updatedTickets = formData.ticket_types.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, ticket_types: updatedTickets }));
    };

    const handleLocationChange = (loc) => {
        setFormData((prev) => ({
            ...prev,
            venue_place_id: loc.place_id || "",
            venue_name: loc.name || "",
            venue_address: loc.address || loc.display_name || "",
        }));
    };

    const convertTo24Hour = (hour, minute, period) => {
        let h = parseInt(hour || "0", 10);
        const m = String(minute || "0").padStart(2, "0");
        if (period === "PM" && h < 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        return `${String(h).padStart(2, "0")}:${m}:00`;
    };

    const handleTimeChange = (type, field, value) => {
        setFormData(prev => {
            let updated = { ...prev };
            if (type === "start") {
                if (field === "hour") updated.startHour = value;
                if (field === "minute") updated.startMinute = value;
                if (field === "period") updated.startPeriod = value;
                updated.start_time = convertTo24Hour(updated.startHour, updated.startMinute, updated.startPeriod);
            }
            if (type === "end") {
                if (field === "hour") updated.endHour = value;
                if (field === "minute") updated.endMinute = value;
                if (field === "period") updated.endPeriod = value;
                updated.end_time = convertTo24Hour(updated.endHour, updated.endMinute, updated.endPeriod);
            }
            return updated;
        });
    };
    // End of helper functions

    useEffect(() => {
        const fetchEventData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/events/${eventcode}/`);
                const eventData = response.data;
                setFormData({
                    ...eventData,
                    start_date: eventData.start_date.split('T')[0],
                    end_date: eventData.end_date.split('T')[0],
                    ticket_types: eventData.ticket_types || [createNewTicket()],
                    reg_form_template: eventData.reg_form_template || [{ // Change here
                        is_active: true,
                        questions: [createNewQuestion()],
                    }],
                });
            } catch (err) {
                console.error("Failed to fetch event data:", err);
                navigate(`/org/${userCode}/my-event`);
            } finally {
                setIsLoading(false);
            }
        };

        if (eventcode) {
            fetchEventData();
        }
    }, [eventcode, navigate, userCode]);

    // src/pages/EditEvent.jsx

// ... all other imports and functions remain the same ...

const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    const form = new FormData();

    // The filter below is the problem. Let's make it more flexible.
    // We will now only check that a ticket has a name to be considered valid.
    const validTicketTypes = formData.ticket_types.filter(ticket =>
        ticket.ticket_name?.trim()
    );

    // Check if there are any valid tickets.
    if (validTicketTypes.length === 0) {
        console.error("Validation Error: You must have at least one valid ticket type.");
        setAlert({ show: true, message: "You must have at least one valid ticket type." });
        setIsLoading(false);
        return; // Prevent the API call
    }

    // Append all top-level fields
    Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'ticket_types' && key !== 'reg_form_template' && key !== 'event_poster' && key !== 'seating_map' && key !== 'event_qr_image') {
            if (value !== null && value !== undefined) {
                form.append(key, value);
            }
        }
    });

    // Handle files: only append a new File object if it exists.
    if (formData.event_poster instanceof File) {
        form.append("event_poster", formData.event_poster);
    }
    if (formData.seating_map instanceof File) {
        form.append("seating_map", formData.seating_map);
    }

    // Append valid ticket types with proper ID handling
    validTicketTypes.forEach((ticket, index) => {
        const { id, ...ticketData } = ticket;
        Object.entries(ticketData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                form.append(`ticket_types[${index}][${key}]`, value);
            }
        });
        if (id) {
            form.append(`ticket_types[${index}][id]`, id);
        }
    });

    // Append reg form templates
    const validRegFormTemplates = formData.reg_form_template.filter(template =>
        template.questions.some(q => q.question_label?.trim())
    );

    validRegFormTemplates.forEach((template, index) => {
        const { id, questions, ...templateData } = template;
        Object.entries(templateData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                form.append(`reg_form_template[${index}][${key}]`, value);
            }
        });
        if (id) {
            form.append(`reg_form_template[${index}][id]`, id);
        }

        questions.filter(q => q.question_label?.trim()).forEach((question, qIndex) => {
            const { id: qId, options, ...questionData } = question;
            Object.entries(questionData).forEach(([questionKey, questionValue]) => {
                if (questionValue !== null && questionValue !== undefined) {
                    // Corrected this line to use `reg_form_template` (singular)
                    form.append(`reg_form_template[${index}][questions][${qIndex}][${questionKey}]`, questionValue);
                }
            });
            if (qId) {
                form.append(`reg_form_template[${index}][questions][${qIndex}][id]`, qId);
            }

            options.forEach((option, oIndex) => {
                const { id: oId, ...optionData } = option;
                Object.entries(optionData).forEach(([optionKey, optionValue]) => {
                    if (optionValue !== null && optionValue !== undefined) {
                        // Corrected this line to use `reg_form_template` (singular)
                        form.append(`reg_form_template[${index}][questions][${qIndex}][options][${oIndex}][${optionKey}]`, optionValue);
                    }
                });
                if (oId) {
                    form.append(`reg_form_template[${index}][questions][${qIndex}][options][${oIndex}][id]`, oId);
                }
            });
        });
    });

    try {
        await api.patch(`/update/${eventcode}/`, form, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setIsLoading(false);
        navigate(`/org/${userCode}/my-event`);
    } catch (err) {
        console.error("Error updating event:", err.response?.data || err.message);
        setIsLoading(false);
    }
};

    if (!formData || isLoading) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: 9999 }}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    return (
        <div className="bg-alice-blue min-h-screen flex items-center justify-center font-outfit p-4 sm:p-8 text-gray-900 antialiased">
            <div className="max-w-3xl w-full">
                {step > 1 && (
                    <div className="flex items-center gap-1 mb-8 cursor-pointer text-teal-600 hover:text-teal-700 transition-colors duration-200" onClick={() => setStep(prevStep => Math.max(prevStep - 1, 1))}>
                        <IoIosArrowBack className="text-2xl" />
                        <span className="text-xl font-medium">Back</span>
                    </div>
                )}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900">Edit Event</h1>
                    <p className="text-gray-600 mt-2">Update your event details.</p>
                </div>
                {/* Step Indicator and Form are the same as CreateEvent.jsx */}
                <form onSubmit={handleUpdate} encType="multipart/form-data" className="space-y-6">
                    {alert.show && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{alert.message}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setAlert({ show: false, message: '' })}>
                                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.03a1.2 1.2 0 1 1-1.697-1.697l2.651-3.03-2.651-3.03a1.2 1.2 0 1 1 1.697-1.697l2.651 3.03 2.651-3.03a1.2 1.2 0 1 1 1.697 1.697l-2.651 3.03 2.651 3.03a1.2 1.2 0 0 1 0 1.697z"/></svg>
                            </span>
                        </div>
                    )}
                    {step === 1 && <CEStep1 formData={formData} handleEventChange={handleEventChange} isPosterErr={isPosterErr} posterErr={posterErr} />}
                    {step === 2 && <CEStep2 formData={formData} setFormData={setFormData} handleLocationChange={handleLocationChange} handleEventChange={handleEventChange} handleCheckboxChange={handleCheckboxChange} handleTimeChange={handleTimeChange} />}
                    {step === 3 && <CEStep3 formData={formData} setFormData={setFormData} handleEventChange={handleEventChange} handleAddTicket={handleAddTicket} seatingMapErr={seatingMapErr} isSeatingMapErr={isSeatingMapErr} handleTicketChange={handleTicketChange} handleRemoveTicket={handleRemoveTicket} />}
                    {step === 4 && <CEStep4 formData={formData} setFormData={setFormData} />}
                    <div className="flex justify-between items-center mt-8">
                        <div className="flex justify-end ml-auto space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/org/${userCode}/my-event`)}
                                className="px-6 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-colors duration-200 cursor-pointer"
                            >
                                Cancel
                            </button>
                            {step < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(prevStep => Math.min(prevStep + 1, totalSteps));
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors duration-200 cursor-pointer"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors duration-200 cursor-pointer"
                                >
                                    Update Event
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventForm;
