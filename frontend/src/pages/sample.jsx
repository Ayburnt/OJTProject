import React, { useState } from 'react';
import api from '../events';
import CEStep1 from '../components/CEStep1.jsx';
import CEStep2 from '../components/CEStep2.jsx';
import CEStep3 from '../components/CEStep3.jsx';
import CEStep4 from './CreateEventRegForm.jsx'; // Assuming this component exists
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { IoIosArrowBack } from "react-icons/io";

// A helper function to create a new, empty ticket object
const createNewTicket = () => ({
    id: '',
  ticket_name: '',
  ticket_type: 'free',
  price: '',  
  quantity_total: 0,
  quantity_available: 0,
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
  const { userCode } = useAuth();
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_code: '',
    audience: 'public',
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
    venue_name: '',
    venue_address: '',
    age_restriction: 'all',
    age_allowed: '',
    parking: '',
    isFee_paid: false,
    posting_fee: 0,
    seating_map: null,
    ticket_types: [createNewTicket()],
    reg_form_templates: [{
      is_active: true,
      questions: [createNewQuestion()],
    }],
  });

  const [ posterErr, setPosterErr ] = useState('');
  const [ isPosterErr, setIsPosterErr ] = useState(false);

  // Separate state for seating map
const [isSeatingMapErr, setIsSeatingMapErr] = useState(false);
const [seatingMapErr, setSeatingMapErr] = useState('');

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

    // Seating map: no aspect ratio validation
    if (name === 'seating_map') {
      setFormData(prev => ({ ...prev, seating_map: file }));
      return;
    }

    // Poster: validate aspect ratio
    if (name === 'event_poster') {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const ratio16by9 = 16 / 9;

        if (img.width <= img.height) {
          setIsPosterErr(true);
          setPosterErr('Image must be landscape.');
          return;
        }
        if (Math.abs(aspectRatio - ratio16by9) > 0.01) {
          setIsPosterErr(true);
          setPosterErr('Image must be 16:9 ratio.');
          return;
        }

        setFormData(prev => ({ ...prev, event_poster: file }));
      };
      img.src = URL.createObjectURL(file);
      return;
    }
  } else {
    // Handle text fields
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  console.log(formData);
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

  // Handlers for Registration Form Template
  const handleQuestionChange = (templateIndex, questionIndex, e) => {
    const { name, value, type, checked } = e.target;
    const updatedTemplates = [...formData.reg_form_templates];
    updatedTemplates[templateIndex].questions[questionIndex][name] = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
  };
  
  const handleAddQuestion = (templateIndex) => {
    const updatedTemplates = [...formData.reg_form_templates];
    updatedTemplates[templateIndex].questions.push(createNewQuestion());
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
  };
  
  const handleRemoveQuestion = (templateIndex, questionIndex) => {
    const updatedTemplates = [...formData.reg_form_templates];
    updatedTemplates[templateIndex].questions = updatedTemplates[templateIndex].questions.filter((_, i) => i !== questionIndex);
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
  };

  const handleOptionChange = (templateIndex, questionIndex, optionIndex, e) => {
    const { value } = e.target;
    const updatedTemplates = [...formData.reg_form_templates];
    updatedTemplates[templateIndex].questions[questionIndex].options[optionIndex].option_value = value;
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
  };

  const handleAddOption = (templateIndex, questionIndex) => {
    const updatedTemplates = [...formData.reg_form_templates];
    updatedTemplates[templateIndex].questions[questionIndex].options.push({ option_value: '' });
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
  };
  
  const handleRemoveOption = (templateIndex, questionIndex, optionIndex) => {
    const updatedTemplates = [...formData.reg_form_templates];
    updatedTemplates[templateIndex].questions[questionIndex].options = updatedTemplates[templateIndex].questions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    
    // Add logic to remove empty questions or options before submitting
    // ...

    try {
      const response = await api.post('/list-create/', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Event created successfully!', response.data);
      navigate(`/org/${userCode}/my-event`); // Redirect on success
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error.response ? error.response.data : error.message);
      alert('Error creating event. Check console for details.');
    }
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


  return (
    <>
      {/* Cancellation Confirmation Modal */}
      {isCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm md:max-w-md p-6 relative text-center">
            <button
              onClick={() => setIsCancelConfirm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              You have unsaved changes
            </h2>
            <p className="mb-6 text-base text-gray-600">
              What would you like to do before exiting?
            </p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate(`/org/${userCode}/my-event`)}
                className="px-6 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-colors duration-200 cursor-pointer"
              >
                Discard Changes
              </button>
              <button
                type="button"
                // Add a save draft functionality here
                className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors duration-200 cursor-pointer"
              >
                Save Draft
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
          <div className="flex justify-center items-center mb-12 space-x-6">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all duration-300
                ${step === s ? 'bg-teal-500 text-white shadow-lg' : 'bg-gray-300 text-gray-700'}`}>
                  {s}
                </div>
                <span className="mt-2 text-sm text-gray-600">
                  {s === 1 && "Details"}
                  {s === 2 && "Date & Location"}
                  {s === 3 && "Ticketing"}
                  {s === 4 && "Registration Form"}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <CEStep1 formData={formData} handleEventChange={handleEventChange} isPosterErr={isPosterErr} posterErr={posterErr} />
            )}
            {step === 2 && (
              <CEStep2 formData={formData} setFormData={setFormData} handleLocationChange={handleLocationChange} handleEventChange={handleEventChange} handleCheckboxChange={handleCheckboxChange} handleTimeChange={handleTimeChange} />
            )}
            {step === 3 && (
              <CEStep3 formData={formData} handleEventChange={handleEventChange} handleRemoveTicket={handleRemoveTicket} handleAddTicket={handleAddTicket} seatingMapErr={seatingMapErr} isSeatingMapErr={isSeatingMapErr} handleTicketChange={handleTicketChange} handleRemoveTicket={handleRemoveTicket} handleAddTicket={handleAddTicket} />
            )}
            {step === 4 && (
              <CEStep4 
                formData={formData} 
                handleQuestionChange={handleQuestionChange}
                handleAddQuestion={handleAddQuestion}
                handleRemoveQuestion={handleRemoveQuestion}
                handleOptionChange={handleOptionChange}
                handleAddOption={handleAddOption}
                handleRemoveOption={handleRemoveOption}
              />
            )}

            {/* Buttons Section */}
            <div className="flex justify-between items-center mt-8">
              <div className="flex justify-end ml-auto space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors duration-200 cursor-pointer"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
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