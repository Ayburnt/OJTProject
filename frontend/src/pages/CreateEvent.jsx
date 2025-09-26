import React, { useEffect, useState } from 'react';
import api from '../api.js';
import CEStep1 from '../components/CEStep1.jsx';
import CEStep2 from '../components/CEStep2.jsx';
import CEStep3 from '../components/CEStep3.jsx';
import CEStep4 from './CreateEventRegForm.jsx';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { IoIosArrowBack } from "react-icons/io";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ReCAPTCHA from "react-google-recaptcha";

// A helper function to create a new, empty ticket object
const createNewTicket = () => ({
  ticket_name: 'Standard',
  ticket_type: 'free',
  price: 0,
  quantity_total: 100,
  quantity_available: 100,
  is_selling: false,
});


// A helper function to create a new, empty question object
const createNewQuestion = () => ({
  question_label: '',
  question_type: 'short',
  is_required: false,
  options: [{ option_value: '' }],
});

const CreateEventForm = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { userCode, userRole } = useAuth();
  const totalSteps = 4;
  const [selectedTier, setSelectedTier] = useState('Free');
  const [selectedPrice, setSelectedPrice] = useState(0.00);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_code: '',
    audience: 'public',
    private_code: '',
    category: '',
    event_type: '',
    meeting_platform: '',
    meeting_link: '',
    event_poster: null,
    duration_type: 'single',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    venue_place_id: '',
    venue_specific: '',
    venue_name: '',
    venue_address: '',
    venue_lat: null,   // 👈 add this
    venue_lng: null,   // 👈 and this
    age_restriction: 'all',
    age_allowed: '',
    parking: '',
    isFee_paid: false,
    posting_fee: 0,
    seating_map: null,
    collect_email: 'collect',
    is_broadcast: 'broadcast',
    status: 'pending',
    ticket_types: [createNewTicket()],
    reg_form_templates: [{
      is_active: true,
      questions: [createNewQuestion()],
    }],
  });

  const [posterErr, setPosterErr] = useState('');
  const [isPosterErr, setIsPosterErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '' });
  const [captchaToken, setCaptchaToken] = useState(null);


  // Separate state for seating map
  const [isSeatingMapErr, setIsSeatingMapErr] = useState(false);
  const [seatingMapErr, setSeatingMapErr] = useState('');

  const handleCloseAlert = () => {
    setAlert({ show: false, message: '' });
  };

  const handleEventChange = (e) => {
    const { name, value, files, type } = e.target;

    // Reset errors for the specific field
    if (name === 'seating_map') {
      setIsSeatingMapErr(false);
      setSeatingMapErr('');
    }
    if (name === 'event_poster') {
      setIsPosterErr(false);
      setPosterErr('');
    }

    if (type === 'file' && files?.length > 0) {
      const file = files[0];
      const validTypes = ["image/png", "image/jpeg"];

      // File type check
      if (!validTypes.includes(file.type)) {
        if (name === 'seating_map') {
          setIsSeatingMapErr(true);
          setSeatingMapErr('Image must be PNG or JPG format.');
        } else {
          setIsPosterErr(true);
          setPosterErr('Image must be PNG or JPG format.');
        }
        return;
      }

      // File type check
      if (!validTypes.includes(file.type)) {
        if (name === 'event_poster') {
          setIsPosterErr(true);
          setPosterErr('Image must be PNG or JPG format.');
        } else {
          setIsPosterErr(true);
          setPosterErr('Image must be PNG or JPG format.');
        }
        return;
      }

      if (name === 'event_poster') {
        setFormData(prev => ({ ...prev, event_poster: file }));
        return;
      }

      if (name === 'seating_map') {
        setFormData(prev => ({ ...prev, seating_map: file }));
        return;
      }

      // // Poster: validate aspect ratio
      // if (name === 'event_poster') {
      //   const img = new Image();
      //   img.onload = () => {
      //     const aspectRatio = img.width / img.height;
      //     const ratio16by9 = 16 / 9;

      //     if (img.width <= img.height) {
      //       setIsPosterErr(true);
      //       setPosterErr('Image must be landscape.');
      //       return;
      //     }

      //     setFormData(prev => ({ ...prev, event_poster: file }));
      //   };
      //   img.src = URL.createObjectURL(file);
      //   return;
      // }
    } else {
      // Handle text fields or radio buttons
      setFormData(prev => {
        const updated = { ...prev, [name]: value };

        // Clear private_code if audience is set to public
        if (name === 'audience' && value === 'public') {
          updated.private_code = '';
          updated.is_broadcast = 'broadcast';
        }

        if (name === 'event_type' && value === 'in-person') {
          updated.meeting_link = '';
          updated.meeting_platform = '';
        }

        // If duration_type is single, set end_date same as start_date
        if (name === 'duration_type' && value === 'single') {
          updated.end_date = updated.start_date || ''; // use current start_date or empty string
        }

        if (name === 'event_code') {
          updated.event_code = value.replace(/\s+/g, "");
        }

        return updated;
      });
    }
  };




  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleTicketChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedTickets = [...formData.ticket_types];

    if (name === 'quantity_total') {
      // Update both total and available quantities
      updatedTickets[index].quantity_total = value;
      updatedTickets[index].quantity_available = value;
      updatedTickets[index][name] = value; // keep quantity field in sync
    } else {
      updatedTickets[index][name] = type === 'checkbox' ? checked : value;
    }

    setFormData({ ...formData, ticket_types: updatedTickets });
  };




  const handleAddTicket = () => {
    setFormData({ ...formData, ticket_types: [...formData.ticket_types, createNewTicket()] });
  };

  const handleRemoveTicket = (index) => {
    const updatedTickets = formData.ticket_types.filter((_, i) => i !== index);
    setFormData({ ...formData, ticket_types: updatedTickets });
  };



  const [isCancelConfirm, setIsCancelConfirm] = useState(false);

  const handleCancel = () => {
    if (formData.title === '' && formData.description === '' && formData.event_code === '') {
      navigate(`/org/${userCode}/my-event`);
      setIsCancelConfirm(false);
    } else {
      setIsCancelConfirm(true);
    }
  };

  const handleNext = () => {
    // Add validation logic here before moving to the next step
    setStep(prevStep => Math.min(prevStep + 1, totalSteps));
  };

  const handleBack = () => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const handleSubmit = async (e, forceDraft = false, redirectTo = null) => {
    if (e) e.preventDefault();

    if (!captchaToken) {
      alert("Please complete the captcha before submitting.");
      return;
    }


    const form = new FormData();

    // add captcha token along with other form fields
    form.append("captcha", captchaToken);

    setIsLoading(true);

    // === Append files only if valid ===
    if (formData.event_poster instanceof File) {
      form.append("event_poster", formData.event_poster);
    }
    if (formData.seating_map instanceof File) {
      form.append("seating_map", formData.seating_map);
    }

    // === Filter and append ticket types ===
    const validTicketTypes = formData.ticket_types.filter(ticket =>
      ticket.ticket_name?.trim() &&
      ticket.quantity_total > 0 &&
      (ticket.ticket_type === "free" || (ticket.ticket_type === "paid" && ticket.price > 0))
    );

    validTicketTypes.forEach((ticket, index) => {
      Object.entries(ticket).forEach(([key, value]) => {
        form.append(`ticket_types[${index}][${key}]`, value);
      });
    });

    // === Determine ticket condition ===
    const hasPaidTickets = validTicketTypes.some(ticket => {
      const price = parseFloat(ticket.price);
      return !isNaN(price) && price > 0;
    });

    // === Status Logic (3 conditions) ===
    // === Status Logic (3 conditions) ===
    // === Status Logic ===
    let verificationStatus = localStorage.getItem("verification_status");

    // 🔄 Always confirm from API if paid tickets are present
    if (hasPaidTickets) {
      try {
        const { data } = await api.get("/me/");
        verificationStatus = data.verification_status;
        localStorage.setItem("verification_status", verificationStatus); // keep it synced
      } catch (err) {
        console.error("Failed to fetch organizer status:", err);
      }
    }

    if (forceDraft) {
      form.append("status", "draft");
    } else if (!hasPaidTickets) {
      form.append("status", "published");
    } else if (hasPaidTickets) {
      if (userRole === 'organizer') {
        if (verificationStatus === "verified") {
          form.append("status", "pending");
          setIsLoading(false);
          navigate(`/org/${userCode}/my-event`);
        } else {
          form.append("status", "pending");
          setIsLoading(false);
          setIsVerifiedConfirm(true);
          return;
        }
      } else if (userRole === 'co-organizer') {
        if (verificationStatus === "verified") {
          form.append("status", "pending");
          setIsLoading(false);
          navigate(`/org/${userCode}/my-event`);
        } else {
          form.append("status", "pending");
          setIsLoading(false);
          setIsVerifiedConfirm(true);
          return;
        }
      }
    }


    // === Append reg form templates ===
    const validRegFormTemplates = formData.reg_form_templates.filter(template =>
      template.questions.some(q => q.question_label?.trim())
    );

    validRegFormTemplates.forEach((template, index) => {
      Object.entries(template).forEach(([key, value]) => {
        if (key === "questions") {
          value
            .filter(q => q.question_label?.trim() && q.question_type?.trim())
            .forEach((question, qIndex) => {
              Object.entries(question).forEach(([questionKey, questionValue]) => {
                if (questionKey === "options") {
                  questionValue.forEach((option, oIndex) => {
                    if (option.option_value?.trim()) {
                      form.append(
                        `reg_form_templates[${index}][questions][${qIndex}][options][${oIndex}][option_value]`,
                        option.option_value
                      );
                    }
                  });
                } else if (questionValue !== null && questionValue !== "") {
                  form.append(
                    `reg_form_templates[${index}][questions][${qIndex}][${questionKey}]`,
                    questionValue
                  );
                }
              });
            });
        } else if (value) {
          form.append(`reg_form_templates[${index}][${key}]`, value);
        }
      });
    });

    // === Append other fields ===
    const fieldsToAppend = { ...formData };
    delete fieldsToAppend.event_poster;
    delete fieldsToAppend.seating_map;
    delete fieldsToAppend.ticket_types;
    delete fieldsToAppend.reg_form_templates;

    // Automatically set parking for virtual events
    if (fieldsToAppend.event_type === "virtual") {
      fieldsToAppend.parking = "No Parking";
    }

    if (fieldsToAppend.duration_type === "single") {
      fieldsToAppend.end_date = fieldsToAppend.start_date;
    }

    if (fieldsToAppend.start_date) {
      fieldsToAppend.start_date = new Date(fieldsToAppend.start_date).toISOString().slice(0, 10);
    }
    if (fieldsToAppend.end_date) {
      fieldsToAppend.end_date = new Date(fieldsToAppend.end_date).toISOString().slice(0, 10);
    }

    Object.entries(fieldsToAppend).forEach(([key, value]) => {
      if (value !== null && value !== undefined && (typeof value !== "string" || value.trim() !== "")) {
        form.append(key, typeof value === "boolean" ? value.toString() : value);
      }
    });

    if (userRole === 'organizer') {
      try {
        const { data: eventData } = await api.post("/list-create/", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        try {
          await api.post("/subscriptions/subscribe/", {
            tier_name: selectedTier,
            price: selectedPrice,
            event: eventData.id,
          });

          setIsLoading(false);
          if (redirectTo) {
            navigate(redirectTo);
          } else {
            if (userRole === 'organizer') {
              navigate(`/org/${userCode}/my-event`);
            } else {
              navigate(`/org/my-event`);
            }
          }
        } catch (subErr) {
          console.error("Error creating subscription:", subErr.response?.data || subErr.message);
          setAlert({ show: true, message: "Subscription failed. Please try again." });
        } finally {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error creating event:", err.response?.data || err.message);
        setIsLoading(false);

        if (err.response?.data) {
          // If backend sends detailed validation error
          const errorData = err.response.data;
          let errorMsg = "Error creating event:\n";

          Object.entries(errorData).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              errorMsg += `${field}: ${messages.join(", ")}\n`;
            } else if (typeof messages === "string") {
              errorMsg += `${field}: ${messages}\n`;
            } else {
              errorMsg += `${field}: ${JSON.stringify(messages)}\n`;
            }
          });
          // REPLACED: alert(errorMsg);
          setAlert({ show: true, message: errorMsg });
        } else {
          // REPLACED: alert("An unexpected error occurred. Please try again.");
          // Generic fallback
          setAlert({ show: true, message: "An unexpected error occurred. Please try again." });
        }
      } finally {
        setIsLoading(false);
      }

    } else {
      try {
        const { data: eventData } = await api.post("/list-create/co-org/", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        try {
          await api.post("/subscriptions/subscribe/", {
            tier_name: selectedTier,
            price: selectedPrice,
            event: eventData.id,
          });

          setIsLoading(false);
          if (redirectTo) {
            navigate(redirectTo);
          } else {
            if (userRole === 'organizer') {
              navigate(`/org/${userCode}/my-event`);
            } else {
              navigate(`/org/my-event`);
            }
          }
        } catch (subErr) {
          console.error("Error creating subscription:", subErr.response?.data || subErr.message);
          setAlert({ show: true, message: "Subscription failed. Please try again." });
        } finally {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error creating event:", err.response?.data || err.message);
        setIsLoading(false);

        if (err.response?.data) {
          // If backend sends detailed validation error
          const errorData = err.response.data;
          let errorMsg = "Error creating event:\n";

          Object.entries(errorData).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              errorMsg += `${field}: ${messages.join(", ")}\n`;
            } else if (typeof messages === "string") {
              errorMsg += `${field}: ${messages}\n`;
            } else {
              errorMsg += `${field}: ${JSON.stringify(messages)}\n`;
            }
          });
          // REPLACED: alert(errorMsg);
          setAlert({ show: true, message: errorMsg });
        } else {
          // REPLACED: alert("An unexpected error occurred. Please try again.");
          // Generic fallback
          setAlert({ show: true, message: "An unexpected error occurred. Please try again." });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };



  const handleLocationChange = (loc) => {
    setFormData((prev) => ({
      ...prev,
      venue_place_id: loc.place_id || "",
      venue_name: loc.name || "",
      venue_address: loc.address || loc.display_name || "",
      venue_lat: loc.lat,
      venue_lng: loc.lng,
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

        updated.start_time = convertTo24Hour(
          updated.startHour,
          updated.startMinute,
          updated.startPeriod
        );
      }

      if (type === "end") {
        if (field === "hour") updated.endHour = value;
        if (field === "minute") updated.endMinute = value;
        if (field === "period") updated.endPeriod = value;

        updated.end_time = convertTo24Hour(
          updated.endHour,
          updated.endMinute,
          updated.endPeriod
        );
      }

      return updated;
    });
  };

  const [isVerifiedConfirm, setIsVerifiedConfirm] = useState(false);

  useEffect(() => {
    document.title = "Create Event | Sari-Sari Events";
  }, []);


  return (
    <>
      {isLoading && (
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={isLoading}
          onClick={() => setIsLoading(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      {isVerifiedConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm md:max-w-md p-6 relative text-center">
            <button
              onClick={() => setIsVerifiedConfirm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Verification Required
            </h2>

            <p className="mb-6 text-base text-gray-600">
              {userRole === 'organizer' ? (
                <>
                  To publish paid events, your organization needs to be verified.
                  Your event will be saved as <span className="font-semibold">pending</span> while you complete the verification process.</>
              ) : (
                <>
                  To publish paid events, your organization needs to be verified.
                  Your event will be saved as <span className="font-semibold">pending</span> while you complete the verification process.
                </>
              )}
            </p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsVerifiedConfirm(false)}
                className="px-6 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-xl hover:bg-teal-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (userRole === 'organizer') {
                    handleSubmit(null, true, `/org/${userCode}/verification-form`);
                  }else {
                    handleSubmit(null, true, `/org/my-event`);
                  }
                }}
                className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700"
              >
                {userRole === 'organizer' ? (
                  'Start Verification'
                ): ('Okay')}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Custom Alert Modal */}
      {alert.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm md:max-w-md p-6 relative text-center">
            <button
              onClick={handleCloseAlert}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-2 text-red-600">
              Error
            </h2>
            <p className="mb-6 text-base text-gray-600 whitespace-pre-line">
              {alert.message}
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleCloseAlert}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Main Container */}
      <div className="bg-alice-blue min-h-screen flex items-center justify-center font-outfit p-4 sm:p-8 text-gray-900 antialiased">
        <div className="max-w-3xl w-full">
          {/* Back Button */}
          {step > 1 && (
            <div className="flex items-center gap-1 mb-8 cursor-pointer text-teal-600 hover:text-teal-700 transition-colors duration-200" onClick={handleBack}>
              <IoIosArrowBack className="text-2xl" />
              <span className="text-xl font-medium">Back</span>
            </div>
          )}

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900">Create a New Event</h1>
            <p className="text-gray-600 mt-2">Fill out the form below to publish your event.</p>
          </div>


          {/* Step Indicator */}
          <div className="flex justify-center items-start mb-12 w-full">
            {[1, 2, 3, 4].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  const form = document.querySelector("form");

                  // ✅ only allow step change if form is valid
                  if (form && form.checkValidity()) {
                    setStep(s);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    form.reportValidity(); // shows built-in validation messages
                  }
                }}
                className="flex-1 flex flex-col items-center focus:outline-none"
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all duration-300
      ${step === s ? 'bg-teal-500 text-white shadow-lg' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                >
                  {s}
                </div>
                <span className="mt-2 text-xs sm:text-sm md:text-base text-gray-600 text-center leading-tight min-h-[32px] flex items-center justify-center">
                  {s === 1 && "Details"}
                  {s === 2 && "Date & Location"}
                  {s === 3 && "Ticketing"}
                  {s === 4 && "Registration Form"}
                </span>
              </button>

            ))}
          </div>

          <form encType="multipart/form-data" className="space-y-6">
            {step === 1 && (
              <CEStep1 formData={formData} handleEventChange={handleEventChange} isPosterErr={isPosterErr} posterErr={posterErr} selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice} selectedTier={selectedTier} setSelectedTier={setSelectedTier} />
            )}
            {step === 2 && (
              <CEStep2 formData={formData} setFormData={setFormData} handleLocationChange={handleLocationChange} handleEventChange={handleEventChange} handleCheckboxChange={handleCheckboxChange} handleTimeChange={handleTimeChange} />
            )}
            {step === 3 && (
              <CEStep3 formData={formData} setFormData={setFormData} handleEventChange={handleEventChange} handleAddTicket={handleAddTicket} seatingMapErr={seatingMapErr} isSeatingMapErr={isSeatingMapErr} handleTicketChange={handleTicketChange} handleRemoveTicket={handleRemoveTicket} selectedTier={selectedTier} />
            )}
            {step === 4 && (
              <CEStep4 formData={formData} setFormData={setFormData} handleEventChange={handleEventChange} />
            )}

            {step === totalSteps && (
              <div className="flex justify-center my-4">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setCaptchaToken(token)}
                />
              </div>
            )}


            {/* Buttons Section */}
            <div className="flex justify-between items-center mt-8">
              <div className="flex justify-end ml-auto space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    if (userRole === 'organizer') {
                      navigate(`/org/${userCode}/my-event`)
                    } else {
                      navigate(`/org/my-event`)
                    }
                  }}
                  className="px-6 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => {
                      const form = document.querySelector("form");
                      if (step === 2 && formData.duration_type === 'single' && !formData.start_date) {
                        console.log('fill upan mo - single')
                        return;
                      } else if (step === 2 && formData.duration_type === 'multiple' && (!formData.start_date || !formData.end_date)) {
                        console.log('fill upan mo - multiple')
                        return;
                      }
                      if (form && form.checkValidity()) {
                        handleNext();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else {
                        form.reportValidity(); // shows browser validation
                      }
                    }}
                    className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleSubmit();
                      window.scrollTo({ top: 0, behavior: "smooth" }); // 👈 also scrolls up on submit
                    }}
                    className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors duration-200 cursor-pointer"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateEventForm;