import React, { useState, useRef, useEffect, memo } from 'react';
import { IoIosArrowBack } from "react-icons/io";


// Main App component
const CreateEvent = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-outfit p-4 sm:p-8 text-gray-900">
      <div className="mx-auto max-w-3xl">
        <EventForm />
      </div>
    </div>
  );
};

// Custom component for the boxed radio buttons, memoized for performance
const RadioBox = memo(({ id, name, value, label, checkedValue, onChange }) => (
  <div className="flex-1">
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
      className="block w-full h-full py-4 px-6 text-center text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-50 peer-checked:bg-teal-500 peer-checked:border-teal-500 peer-checked:text-white"
    >
      <span className="text-sm font-medium">{label}</span>
    </label>
  </div>
));

// New dedicated component for the Event Title input, managing its own state
const EventTitleInput = memo(({ initialValue, onBlurCallback }) => {
  const [title, setTitle] = useState(initialValue);

  // Update parent state only when the input is blurred
  const handleBlur = () => {
    onBlurCallback(title);
  };

  const handleChange = (e) => {
    // Update local state on every keystroke
    setTitle(e.target.value);
  };

  return (
    <div>
      <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700">Event Title</label>
      <input
        type="text"
        id="eventTitle"
        name="eventTitle"
        value={title}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="e.g., Technolympics Summit 2000"
        className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
      />
    </div>
  );
});

// New dedicated component for the Event Description input, managing its own state
const EventDescriptionTextarea = memo(({ initialValue, onBlurCallback }) => {
  const [description, setDescription] = useState(initialValue);

  // Update parent state only when the input is blurred
  const handleBlur = () => {
    onBlurCallback(description);
  };

  const handleChange = (e) => {
    // Update local state on every keystroke
    setDescription(e.target.value);
  };

  return (
    <div>
      <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mt-4">Event Description</label>
      <textarea
        id="eventDescription"
        name="eventDescription"
        value={description}
        onChange={handleChange}
        onBlur={handleBlur}
        rows="4"
        placeholder="Tell attendees what to expect: the agenda, speakers, etc."
        className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
      ></textarea>
    </div>
  );
});

// Dedicated component for the Location input, now managing its own state
const LocationInput = memo(({ initialValue, onBlurCallback }) => {
  const [location, setLocation] = useState(initialValue);

  const handleBlur = () => {
    onBlurCallback(location);
  };

  const handleChange = (e) => {
    setLocation(e.target.value);
  };

  return (
    <div>
      <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location of the Event/Address</label>
      <input
        type="text"
        id="location"
        name="location"
        value={location}
        onChange={handleChange}
        onBlur={handleBlur}
        className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
      />
    </div>
  );
});

// Dedicated component for the "No. of Event Days" input, now managing its own state
const NumberOfEventDaysInput = memo(({ initialValue, onBlurCallback }) => {
  const [noOfEventDays, setNoOfEventDays] = useState(initialValue);

  const handleBlur = () => {
    onBlurCallback(noOfEventDays);
  };

  const handleChange = (e) => {
    setNoOfEventDays(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="noOfEventDays" className="block text-sm font-medium text-gray-700">No. of Event Day</label>
      <input
        type="number"
        id="noOfEventDays"
        name="noOfEventDays"
        value={noOfEventDays}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-24 bg-white border-2 border-gray-300 rounded-xl text-center focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
      />
    </div>
  );
});

// Helper function to format a date object into 'YYYY-MM-DD' string
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// New custom component for date inputs, memoized for performance
const CustomDateInput = memo(({ label, id, name, value, onChange }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const inputRef = useRef(null);
  const calendarRef = useRef(null);

  // Close calendar if a click is detected outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current && !calendarRef.current.contains(event.target) &&
        inputRef.current && !inputRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDayClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onChange({
      target: {
        name: name,
        value: formatDate(newDate),
      },
    });
    setIsCalendarOpen(false);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = value === formatDate(new Date(year, month, i));
      days.push(
        <button
          key={i}
          type="button"
          onClick={() => handleDayClick(i)}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200
            ${isSelected ? 'bg-teal-500 text-white' : 'hover:bg-gray-200 text-gray-800'}`
          }
        >
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
        <input
          type="text"
          id={id}
          ref={inputRef}
          value={value}
          readOnly
          onFocus={() => setIsCalendarOpen(true)}
          className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
        />
        <button
          type="button"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
        </button>
      </div>

      <div
        ref={calendarRef}
        className={`absolute z-10 mt-2 p-4 bg-white rounded-xl shadow-lg border border-gray-200 transition-opacity duration-200 ${isCalendarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <span className="font-semibold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
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

// EventForm component
const EventForm = () => {
  // All form data state is centralized
  const [formData, setFormData] = useState({
    eventTitle: '',
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
    typeOfEvent: '',
    location: '',
    noOfEventDays: ''
  });

  // Handle input changes for select and radio button fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Dedicated handler for the title field, which is called on blur
  const handleTitleBlur = (newTitle) => {
    setFormData(prevData => ({
      ...prevData,
      eventTitle: newTitle,
    }));
  };

  // Dedicated handler for the description field, which is called on blur
  const handleDescriptionBlur = (newDescription) => {
    setFormData(prevData => ({
      ...prevData,
      eventDescription: newDescription,
    }));
  };

  // Dedicated handler for the location field, which is called on blur
  const handleLocationBlur = (newLocation) => {
    setFormData(prevData => ({
      ...prevData,
      location: newLocation,
    }));
  };

  // Dedicated handler for the number of event days field, which is called on blur
  const handleNoOfEventDaysBlur = (newCount) => {
    setFormData(prevData => ({
      ...prevData,
      noOfEventDays: newCount,
    }));
  };

  // Handle dynamic ticket type changes using a unique ID
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

  // Add a new ticket type field with a unique ID
  const addTicketType = () => {
    setFormData(prevData => ({
      ...prevData,
      ticketTypes: [...prevData.ticketTypes, { id: crypto.randomUUID(), name: '', type: 'Free', price: '', quantity: '' }],
    }));
  };

  // Remove a ticket type field using its unique ID
  const removeTicketType = (idToRemove) => {
    setFormData(prevData => ({
      ...prevData,
      ticketTypes: prevData.ticketTypes.filter(ticket => ticket.id !== idToRemove),
    }));
  };

  // Form submission handler to prevent page reload
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  // Handle save draft button click
  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
  };

  // Helper component for form sections with a consistent style
  const FormSection = ({ title, children }) => (
    <div className="p-4 md:p-6 rounded-2xl mb-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 border-b-2 border-teal-500 pb-2">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-8">

        <div className="flex items-center gap-1 mb-6 cursor-pointer" onClick={() => window.history.back()}>
                    <IoIosArrowBack className="text-secondary text-2xl" />
                    <span className="text-secondary text-xl font-medium font-outfit">Back</span>
                  </div>

        <h1 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900">Create a New Event</h1>
        <p className="text-gray-600 mt-2">Fill out the form below to publish your event.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Event Details Section */}
        <FormSection title="EVENT DETAILS">
          {/* Using the new dedicated component for the title input */}
          <EventTitleInput
            initialValue={formData.eventTitle}
            onBlurCallback={handleTitleBlur}
          />
          {/* Using the new dedicated component for the description textarea */}
          <EventDescriptionTextarea
            initialValue={formData.eventDescription}
            onBlurCallback={handleDescriptionBlur}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="eventCategory" className="block text-sm font-medium text-gray-700">Event Category</label>
              <select
                id="eventCategory"
                name="eventCategory"
                value={formData.eventCategory}
                onChange={handleChange}
                className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
              >
                <option>Concert</option>
                <option>Workshop</option>
                <option>Conference</option>
              </select>
            </div>
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">Event Type</label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
              >
                <option>Virtual</option>
                <option>In-person</option>
              </select>
            </div>
          </div>
        </FormSection>

        {/* Date and Location Section */}
        <FormSection title="DATE AND LOCATION">
          <label className="block text-sm font-medium text-gray-700 mb-2">Type of Event</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <RadioBox
              id="type-seminar"
              name="typeOfEvent"
              value="Seminar (3 or More Hours)"
              label="Seminar 3 or More Hours"
              checkedValue={formData.typeOfEvent}
              onChange={handleChange}
            />
            <RadioBox
              id="type-single-day"
              name="typeOfEvent"
              value="Single day Event"
              label="Single day Event"
              checkedValue={formData.typeOfEvent}
              onChange={handleChange}
            />
            <RadioBox
              id="type-multi-day"
              name="typeOfEvent"
              value="Multi-day Event"
              label="Multi-day Event"
              checkedValue={formData.typeOfEvent}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-end justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
            <NumberOfEventDaysInput
              initialValue={formData.noOfEventDays}
              onBlurCallback={handleNoOfEventDaysBlur}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <CustomDateInput
              label="Start Date"
              id="eventStartDate"
              name="eventStartDate"
              value={formData.eventStartDate}
              onChange={handleChange}
            />
            <CustomDateInput
              label="End Date"
              id="eventEndDate"
              name="eventEndDate"
              value={formData.eventEndDate}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="text"
                  name="startHour"
                  value={formData.startHour}
                  onChange={handleChange}
                  placeholder="00"
                  className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
                />
                <span>:</span>
                <input
                  type="text"
                  name="startMinute"
                  value={formData.startMinute}
                  onChange={handleChange}
                  placeholder="00"
                  className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
                />
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'startPeriod', value: formData.startPeriod === 'AM' ? 'PM' : 'AM' } })}
                  className="flex-1 bg-teal-500 text-white font-semibold rounded-xl px-4 py-2 hover:bg-teal-600 transition-colors duration-200"
                >
                  {formData.startPeriod}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="text"
                  name="endHour"
                  value={formData.endHour}
                  onChange={handleChange}
                  placeholder="00"
                  className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
                />
                <span>:</span>
                <input
                  type="text"
                  name="endMinute"
                  value={formData.endMinute}
                  onChange={handleChange}
                  placeholder="00"
                  className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
                />
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'endPeriod', value: formData.endPeriod === 'AM' ? 'PM' : 'AM' } })}
                  className="flex-1 bg-teal-500 text-white font-semibold rounded-xl px-4 py-2 hover:bg-teal-600 transition-colors duration-200"
                >
                  {formData.endPeriod}
                </button>
              </div>
            </div>
          </div>

          <LocationInput
            initialValue={formData.location}
            onBlurCallback={handleLocationBlur}
          />

          <div className="mt-4 h-64 bg-gray-200 rounded-xl overflow-hidden shadow-inner">
            {/* Placeholder for map */}
            <img
              src="https://placehold.co/800x400/E5E7EB/6B7280?text=Map+Preview"
              alt="Map placeholder"
              className="object-cover w-full h-full"
            />
          </div>
        </FormSection>

        {/* Highlights Section */}
        <div className="p-4 md:p-6 rounded-2xl mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 border-b-2 border-teal-500 pb-2">ADD HIGHLIGHTS ABOUT YOUR EVENT</h2>
          <label className="block text-sm font-medium text-gray-700 mb-2">What time can attendees check in before the event?</label>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              name="timeCheckIn"
              value={formData.timeCheckIn}
              onChange={handleChange}
              placeholder="Type here"
              className="mt-1 flex-1 bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
            />
            <RadioBox
              id="time-minutes"
              name="timeUnit"
              value="Minutes"
              label="Minutes"
              checkedValue={formData.timeUnit}
              onChange={handleChange}
            />
            <RadioBox
              id="time-hours"
              name="timeUnit"
              value="Hours"
              label="Hours"
              checkedValue={formData.timeUnit}
              onChange={handleChange}
            />
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">Is there an age restriction?</label>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <RadioBox
              id="age-all"
              name="ageRestriction"
              value="All ages allowed"
              label="All ages allowed"
              checkedValue={formData.ageRestriction}
              onChange={handleChange}
            />
            <RadioBox
              id="age-restriction"
              name="ageRestriction"
              value="There's an age restriction"
              label="There's an age restriction"
              checkedValue={formData.ageRestriction}
              onChange={handleChange}
            />
            <RadioBox
              id="age-guardian"
              name="ageRestriction"
              value="Parent or guardian needed"
              label="Parent or guardian needed"
              checkedValue={formData.ageRestriction}
              onChange={handleChange}
            />
          </div>

          {/* Conditional rendering for the age restriction radio buttons. */}
          {formData.ageRestriction === "There's an age restriction" && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2">What age is allowed</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {['12+', '13+', '14+', '15+', '16+', '17+', '18+', '19+', '20+', '21+'].map((age, index) => (
                  <RadioBox
                    key={index}
                    id={`age-${age}`}
                    name="allowedAges"
                    value={age}
                    label={age}
                    checkedValue={formData.allowedAges}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-2">Is there parking at your venue?</label>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <RadioBox
              id="parking-free"
              name="parking"
              value="Free Parking"
              label="Free Parking"
              checkedValue={formData.parking}
              onChange={handleChange}
            />
            <RadioBox
              id="parking-paid"
              name="parking"
              value="Paid Parking"
              label="Paid Parking"
              checkedValue={formData.parking}
              onChange={handleChange}
            />
            <RadioBox
              id="parking-none"
              name="parking"
              value="No Parking"
              label="No Parking"
              checkedValue={formData.parking}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Ticketing Section */}
        <div className="p-4 md:p-6 rounded-2xl mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 border-b-2 border-teal-500 pb-2">TICKETING FOR EVENT</h2>
          {formData.ticketTypes.map((ticket) => (
            <div key={ticket.id} className="space-y-4 mb-6 p-4 border rounded-xl border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor={`ticket-name-${ticket.id}`} className="block text-sm font-medium text-gray-700">Ticket Name</label>
                  <input
                    type="text"
                    id={`ticket-name-${ticket.id}`}
                    name="name"
                    value={ticket.name}
                    onChange={(e) => handleTicketChange(ticket.id, e)}
                    className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
                  />
                </div>
                <div>
                  <label htmlFor={`ticket-type-${ticket.id}`} className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    id={`ticket-type-${ticket.id}`}
                    name="type"
                    value={ticket.type}
                    onChange={(e) => handleTicketChange(ticket.id, e)}
                    className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
                  >
                    <option>Free</option>
                    <option>Paid</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`ticket-price-${ticket.id}`} className="block text-sm font-medium text-gray-700">Price(Php)</label>
                  <input
                    type="number"
                    id={`ticket-price-${ticket.id}`}
                    name="price"
                    value={ticket.price}
                    onChange={(e) => handleTicketChange(ticket.id, e)}
                    className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-end">
                <div>
                  <label htmlFor={`ticket-quantity-${ticket.id}`} className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="text"
                    id={`ticket-quantity-${ticket.id}`}
                    name="quantity"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketChange(ticket.id, e)}
                    className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
                  />
                </div>
                <div className="flex flex-wrap gap-2 items-end">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    Upload Seat Plan
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    Upload Seat Plan
                  </button>
                </div>
              </div>
              <div className="flex justify-start mt-4">
                <button
                  type="button"
                  onClick={() => removeTicketType(ticket.id)}
                  className="bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-xl hover:bg-red-600 transition-colors duration-200 max-w-xs w-full sm:w-auto"
                >
                  Remove Ticket Type
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={addTicketType}
              className="flex items-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors duration-200"
            >
              <span className="text-xl mr-2">+</span> Add Another Ticket Type
            </button>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-6 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-colors duration-200"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors duration-200"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
