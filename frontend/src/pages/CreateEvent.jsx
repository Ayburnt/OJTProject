import React, { useState, useRef, useEffect, memo } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import CreateEventRegForm from './CreateEventRegForm.jsx';
import CEStep1 from '../components/CEStep1.jsx';
import CEStep2 from '../components/CEStep2.jsx';
import CEStep3 from '../components/CEStep3.jsx';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

// Main App component
const CreateEvent = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { userCode } = useAuth();
  const totalSteps = 4; // Now there are 4 steps

  const [formData, setFormData] = useState({
    eventTitle: '',
    eventCode: '',
    eventDescription: '',
    eventCategory: 'Concert',
    eventType: 'Virtual',
    eventImage: null,
    timeCheckIn: '',
    timeUnit: 'Minutes',
    ageRestriction: 'All ages allowed',
    allowedAges: '',
    parking: 'Free Parking',
    ticketTypes: [{ id: crypto.randomUUID(), name: '', type: 'Free', price: '', quantity: '' }],
    eventStartDate: '',
    eventEndDate: '',
    startHour: '',
    startMinute: '',
    startPeriod: 'AM',
    endHour: '',
    endMinute: '',
    endPeriod: 'PM',
    typeOfEvent: [],
    location: '',
    registrationForm: [], // State to hold the custom registration form questions
  });

  const handleNext = () => {
    setStep(prevStep => Math.min(prevStep + 1, totalSteps));
  };

  const handleBack = () => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleCodeChange = (e) => {
    const { name, value } = e.target;

  // Remove all spaces from input
  const sanitizedValue = value.replace(/\s/g, '');

  setFormData((prev) => ({
    ...prev,
    [name]: sanitizedValue,
  }));
  };

  const handleTicketChange = (id, e) => {
    const { name, value } = e.target;
    const newTicketTypes = formData.ticketTypes.map(ticket =>
      ticket.id === id ? { ...ticket, [name]: value } : ticket
    );
    setFormData(prevData => ({
      ...prevData,
      ticketTypes: newTicketTypes,
    }));
  };

  const addTicketType = () => {
    setFormData(prevData => ({
      ...prevData,
      ticketTypes: [...prevData.ticketTypes, { id: crypto.randomUUID(), name: '', type: 'Free', price: '', quantity: '' }],
    }));
  };

  const removeTicketType = (idToRemove) => {
    setFormData(prevData => ({
      ...prevData,
      ticketTypes: prevData.ticketTypes.filter(ticket => ticket.id !== idToRemove),
    }));
  };

  const handleCheckboxChange = (value, checked) => {
    setFormData(prevData => {
      const newArray = checked
        ? [...prevData.typeOfEvent, value]
        : prevData.typeOfEvent.filter(item => item !== value);
      return {
        ...prevData,
        typeOfEvent: newArray,
      };
    });
  };

  // Handler for the custom registration form questions
  const handleAddQuestion = (questionType) => {
    const newQuestion = {
      id: crypto.randomUUID(),
      type: questionType,
      label: 'New Question',
      options: questionType === 'multiple-choice' || questionType === 'checkbox' ? ['Option 1'] : [],
      required: false,
    };
    setFormData(prevData => ({
      ...prevData,
      registrationForm: [...prevData.registrationForm, newQuestion],
    }));
  };

  const handleUpdateQuestion = (id, newQuestionData) => {
    setFormData(prevData => ({
      ...prevData,
      registrationForm: prevData.registrationForm.map(q =>
        q.id === id ? { ...q, ...newQuestionData } : q
      ),
    }));
  };

  const handleRemoveQuestion = (id) => {
    setFormData(prevData => ({
      ...prevData,
      registrationForm: prevData.registrationForm.filter(q => q.id !== id),
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Here you would typically send the formData to a server
  };

  const handleSaveDraft = () => {
    if (formData.eventTitle === '' && formData.eventDescription === '' && formData.eventCode === '') {
      navigate(`/org/${userCode}/my-event`);
      setIsCancelConfirm(false);
    } else {
      setIsCancelConfirm(true);
    }
  };

  const [isCancelConfirm, setIsCancelConfirm] = useState(false);

  return (
    <>
      {isCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm md:max-w-md p-6 relative text-center">
            {/* Close Button */}
            <button
              onClick={() => setIsCancelConfirm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
              aria-label="Close"
            >
              &times;
            </button>

            {/* Message */}
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              You have unsaved changes
            </h2>
            <p className="mb-6 text-base text-gray-600">
              What would you like to do before exiting?
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate(`/org/${userCode}/my-event`)}
                className="px-6 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-colors duration-200 cursor-pointer"
              >
                Discard Changes
              </button>
              <button

                className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors duration-200 cursor-pointer"
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-alice-blue min-h-screen flex items-center justify-center font-outfit p-4 sm:p-8 text-gray-900 antialiased">

        <div className="max-w-3xl w-full">

          <div className={`${step === 1 ? 'hidden' : 'flex'} items-center gap-1 mb-8 cursor-pointer text-teal-600 hover:text-teal-700 transition-colors duration-200`} onClick={handleBack}>
            <IoIosArrowBack className="text-2xl" />
            <span className="text-xl font-medium">Back</span>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900">Create a New Event</h1>
            <p className="text-gray-600 mt-2">Fill out the form below to publish your event.</p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center items-center mb-12 space-x-6">
            {[1, 2, 3, 4].map(s => ( // Updated to 4 steps
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
              <CEStep1 formData={formData} setFormData={setFormData} handleChange={handleChange} />
            )}

            {step === 2 && (
              <CEStep2 formData={formData} setFormData={setFormData} handleCheckboxChange={handleCheckboxChange} handleChange={handleChange} />
            )}

            {step === 3 && (
              <CEStep3 formData={formData} handleTicketChange={handleTicketChange} removeTicketType={removeTicketType} addTicketType={addTicketType} />
            )}

            {step === 4 && (
              <CreateEventRegForm />
            )}

            {/* Buttons Section for navigation and submission */}
            <div className="flex justify-between items-center mt-8">

              <div className="flex justify-end ml-auto space-x-4">
                <button
                  type="button"
                  onClick={handleSaveDraft}
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

export default CreateEvent;

// Helper components (RadioBox, Checkbox, etc.) remain the same
const RadioBox = memo(({ id, name, value, label, checkedValue, onChange }) => (
  <div className="flex-1 min-w-0">
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checkedValue === value}
      onChange={onChange}
      className="hidden peer"
    />
    <label
      htmlFor={id}
      className="block w-full h-full py-4 px-3 text-center text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-50 peer-checked:bg-teal-500 peer-checked:border-teal-500 peer-checked:text-white"
    >
      <span className="text-sm font-medium">{label}</span>
    </label>
  </div>
));

const Checkbox = memo(({ id, name, value, label, checkedValues, onChange }) => {
  const isChecked = checkedValues.includes(value);
  const handleCheckboxChange = () => {
    onChange(value, !isChecked);
  };
  return (
    <div className="flex-1 min-w-0">
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="hidden peer"
      />
      <label
        htmlFor={id}
        className="flex items-center gap-3 p-4 text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-50
          peer-checked:border-teal-500 peer-checked:bg-teal-500 peer-checked:shadow-lg peer-checked:text-white"
      >
        <div className="w-5 h-5 flex items-center justify-center border-2 rounded-md transition-colors duration-200 peer-checked:bg-teal-500 peer-checked:border-teal-500">
          {isChecked && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </label>
    </div>
  );
});

const EventTitleInput = memo(({ initialValue, onBlurCallback }) => {
  const [title, setTitle] = useState(initialValue);
  const handleBlur = () => { onBlurCallback(title); };
  const handleChange = (e) => { setTitle(e.target.value); };
  return (
    <div>
      <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700">Event Title</label>
      <input type="text" id="eventTitle" name="eventTitle" value={title} onChange={handleChange} onBlur={handleBlur} placeholder="e.g., Technolympics Summit 2000" className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4" />
    </div>
  );
});

const EventDescriptionTextarea = memo(({ initialValue, onBlurCallback }) => {
  const [description, setDescription] = useState(initialValue);
  const handleBlur = () => { onBlurCallback(description); };
  const handleChange = (e) => { setDescription(e.target.value); };
  return (
    <div>
      <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mt-4">Event Description</label>
      <textarea id="eventDescription" name="eventDescription" value={description} onChange={handleChange} onBlur={handleBlur} rows="4" placeholder="Tell attendees what to expect: the agenda, speakers, etc." className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"></textarea>
    </div>
  );
});

const LocationInput = memo(({ initialValue, onBlurCallback }) => {
  const [location, setLocation] = useState(initialValue);
  const handleBlur = () => { onBlurCallback(location); };
  const handleChange = (e) => { setLocation(e.target.value); };
  return (
    <div>
      <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location of the Event/Address</label>
      <input type="text" id="location" name="location" value={location} onChange={handleChange} onBlur={handleBlur} className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4" />
    </div>
  );
});

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CustomDateInput = memo(({ label, id, name, value, onChange }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const inputRef = useRef(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) && inputRef.current && !inputRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const handleDayClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onChange({ target: { name: name, value: formatDate(newDate) } });
    setIsCalendarOpen(false);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) { days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>); }
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = value === formatDate(new Date(year, month, i));
      days.push(
        <button key={i} type="button" onClick={() => handleDayClick(i)} className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 ${isSelected ? 'bg-teal-500 text-white' : 'hover:bg-gray-200 text-gray-800'}`}>
          {i}
        </button>
      );
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input type="text" id={id} ref={inputRef} value={value} readOnly onFocus={() => setIsCalendarOpen(true)} className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4" />
        <button type="button" onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
        </button>
      </div>
      <div ref={calendarRef} className={`absolute z-10 mt-2 p-4 bg-white rounded-xl shadow-lg border border-gray-200 transition-opacity duration-200 ${isCalendarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <span className="font-semibold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button type="button" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
          {dayNames.map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
});

const FormSection = ({ title, children }) => (
  <div className="p-4 md:p-6 rounded-2xl mb-6 bg-grey shadow-sm ">
    <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">{title}</h2>
    {children}
  </div>
);

// New component for the custom registration form builder
const RegistrationFormBuilder = ({ questions, onAddQuestion, onUpdateQuestion, onRemoveQuestion }) => {
  const Question = ({ question, onUpdate, onRemove }) => {
    const handleOptionChange = (index, e) => {
      const newOptions = [...question.options];
      newOptions[index] = e.target.value;
      onUpdate({ ...question, options: newOptions });
    };

    const addOption = () => {
      onUpdate({ ...question, options: [...question.options, `Option ${question.options.length + 1}`] });
    };

    const removeOption = (indexToRemove) => {
      onUpdate({ ...question, options: question.options.filter((_, index) => index !== indexToRemove) });
    };

    const renderQuestionInput = () => {
      switch (question.type) {
        case 'short-answer':
          return (
            <input
              type="text"
              placeholder="Short answer text"
              className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
            />
          );
        case 'long-answer':
          return (
            <textarea
              rows="3"
              placeholder="Long answer text"
              className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
            ></textarea>
          );
        case 'multiple-choice':
          return (
            <div className="space-y-2 mt-2">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="radio" className="form-radio text-teal-600 focus:ring-teal-500" disabled />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e)}
                    className="flex-1 bg-transparent border-0 border-b border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200"
                  />
                  <button type="button" onClick={() => removeOption(index)} className="text-gray-400 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </button>
                </div>
              ))}
              <button type="button" onClick={addOption} className="text-teal-600 text-sm font-semibold hover:underline">
                + Add Option
              </button>
            </div>
          );
        case 'checkbox':

      }
    };
  };

};
