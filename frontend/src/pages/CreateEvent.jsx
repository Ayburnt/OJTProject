import React, { useState } from 'react';

// Main App component
const CreateEvent = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-8 flex items-center justify-center text-gray-900">
      <EventForm />
    </div>
  );
};

// EventForm component
const EventForm = () => {
  // State for form data
  const [formData, setFormData] = useState({
    eventTitle: '',
    eventDescription: '',
    eventCategory: 'Concert',
    eventType: 'Virtual',
    eventImage: null,
    timeCheckIn: '',
    timeUnit: 'Minutes',
    ageRestriction: 'All ages allowed',
    allowedAges: [],
    parking: 'Free Parking',
    ticketTypes: [{ name: '', type: 'Free', price: '', quantity: '' }],
    // Separating date and time fields for clarity and new design
    eventStartDate: '',
    eventEndDate: '',
    startHour: '',
    startMinute: '',
    startPeriod: 'AM',
    endHour: '',
    endMinute: '',
    endPeriod: 'PM',
    location: '',
    noOfEventDays: '',
    typeOfEvent: '',
  });

  // Handle input changes for text and select fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      eventImage: e.target.files[0],
    }));
  };

  // Handle dynamic ticket type changes
  const handleTicketChange = (index, e) => {
    const { name, value } = e.target;
    const newTicketTypes = [...formData.ticketTypes];
    newTicketTypes[index][name] = value;
    setFormData(prevData => ({
      ...prevData,
      ticketTypes: newTicketTypes,
    }));
  };

  // Add a new ticket type field
  const addTicketType = () => {
    setFormData(prevData => ({
      ...prevData,
      ticketTypes: [...prevData.ticketTypes, { name: '', type: 'Free', price: '', quantity: '' }],
    }));
  };

  // Handle age restriction checkboxes
  const handleAgeCheckboxChange = (age) => {
    setFormData(prevData => {
      const newAllowedAges = prevData.allowedAges.includes(age)
        ? prevData.allowedAges.filter(a => a !== age)
        : [...prevData.allowedAges, age];
      return { ...prevData, allowedAges: newAllowedAges };
    });
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Here you would typically send the data to an API
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
  };

  // Helper component for form sections
  const FormSection = ({ title, children }) => (
    <div className="p-4 md:p-6 rounded-2xl mb-6">
      <h2 className="text-xl md:text-2xl font-bold font-outfit mb-6 text-gray-800 border-b-2 border-teal-500 pb-2">{title}</h2>
      {children}
    </div>
  );

  // Custom component for the boxed radio buttons with a circular indicator
  const RadioBox = ({ id, name, value, label, checkedValue, onChange }) => (
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
        <span className="text-sm font-outfit font-medium">{label}</span>
      </label>
    </div>
  );

  const CheckboxButton = ({ id, name, value, label, isChecked, onChange }) => (
    <div className="flex-1">
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        onChange={onChange}
        className="hidden peer"
      />
      <label
        htmlFor={id}
        className="block w-full py-2 px-4 text-center text-gray-700 bg-transparent rounded-xl cursor-pointer border-2 border-transparent transition-all duration-200 ease-in-out hover:bg-gray-100 peer-checked:bg-teal-500 peer-checked:text-white peer-checked:border-teal-500"
      >
        {label}
      </label>
    </div>
  );

  // Custom Time Input component to match the image
  const TimeInput = ({ name, hour, minute, period, onChange }) => (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        name={`${name}Hour`}
        value={hour}
        onChange={onChange}
        placeholder="00"
        className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
      />
      <span>:</span>
      <input
        type="text"
        name={`${name}Minute`}
        value={minute}
        onChange={onChange}
        placeholder="00"
        className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
      />
      <button
        type="button"
        onClick={() => onChange({ target: { name: `${name}Period`, value: period === 'AM' ? 'PM' : 'AM' } })}
        className="flex-1 bg-teal-500 text-white font-semibold rounded-xl px-4 py-2 hover:bg-teal-600 transition-colors duration-200"
      >
        {period}
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-8">
        <button className="flex items-center text-teal-600 hover:text-teal-800 transition-colors duration-200">
          {/* Replaced ChevronLeft with inline SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="font-semibold text-lg">Back</span>
        </button>
        <h1 className="text-3xl md:text-4xl font-bold font-outfit mt-4 text-gray-900">Create a New Event</h1>
        <p className="text-gray-600 font-outfit mt-2">Fill out the form below to publish your event.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Event Details Section */}
        <FormSection title="EVENT DETAILS">
          <label htmlFor="eventTitle" className="block text-sm font-medium font-outfit text-gray-700">Event Title</label>
          <input
            type="text"
            id="eventTitle"
            name="eventTitle"
            value={formData.eventTitle}
            onChange={handleChange}
            placeholder="e.g., Technolympics Summit 2000"
            className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
          />

          <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mt-4">Event Description</label>
          <textarea
            id="eventDescription"
            name="eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
            rows="4"
            placeholder="Tell attendees what to expect: the agenda, speakers, etc."
            className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
          ></textarea>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="eventCategory" className="block text-sm font-medium text-gray-700">Event Category</label>
              <select
                id="eventCategory"
                name="eventCategory"
                value={formData.eventCategory}
                onChange={handleChange}
                className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
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
                className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
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
            <div className="flex items-center space-x-2">
              <label htmlFor="noOfEventDays" className="block text-sm font-medium text-gray-700">No. of Event Day</label>
              <input
                type="text"
                id="noOfEventDays"
                name="noOfEventDays"
                value={formData.noOfEventDays}
                onChange={handleChange}
                className="w-16 bg-transparent border-0 border-b-2 border-gray-300 text-center focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="eventStartDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                id="eventStartDate"
                name="eventStartDate"
                value={formData.eventStartDate}
                onChange={handleChange}
                className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
              />
            </div>
            <div>
              <label htmlFor="eventEndDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                id="eventEndDate"
                name="eventEndDate"
                value={formData.eventEndDate}
                onChange={handleChange}
                className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <div className="mt-1">
                <TimeInput
                  name="start"
                  hour={formData.startHour}
                  minute={formData.startMinute}
                  period={formData.startPeriod}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <div className="mt-1">
                <TimeInput
                  name="end"
                  hour={formData.endHour}
                  minute={formData.endMinute}
                  period={formData.endPeriod}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location of the Event/Address</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Bahay ni Gerlyn"
            className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
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
        <FormSection title="ADD HIGHLIGHTS ABOUT YOUR EVENT">
          <label className="block text-sm font-medium text-gray-700 mb-2">What time can attendees check in before the event?</label>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              name="timeCheckIn"
              value={formData.timeCheckIn}
              onChange={handleChange}
              placeholder="Type here"
              className="mt-1 flex-1 bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
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

          {/* Conditional rendering for the age restriction checkboxes. This section 'pops out' when the corresponding radio button is selected. */}
          {formData.ageRestriction === "There's an age restriction" && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2">What ages are allowed</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {['12+', '13+', '14+', '15+', '16+', '17+', '18+', '19+', '20+', '21+'].map((age, index) => (
                  <CheckboxButton
                    key={index}
                    id={`age-${age}`}
                    name="allowedAges"
                    value={age}
                    label={age}
                    isChecked={formData.allowedAges.includes(age)}
                    onChange={() => handleAgeCheckboxChange(age)}
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
        </FormSection>

        {/* Ticketing Section */}
        <div className="p-4 md:p-6 rounded-2xl mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 border-b-2 border-teal-500 pb-2">TICKETING FOR EVENT</h2>
          {formData.ticketTypes.map((ticket, index) => (
            <div key={index} className="space-y-4 mb-6 p-4 border rounded-xl border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor={`ticket-name-${index}`} className="block text-sm font-medium text-gray-700">Ticket Name</label>
                  <input
                    type="text"
                    id={`ticket-name-${index}`}
                    name="name"
                    value={ticket.name}
                    onChange={(e) => handleTicketChange(index, e)}
                    className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
                  />
                </div>
                <div>
                  <label htmlFor={`ticket-type-${index}`} className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    id={`ticket-type-${index}`}
                    name="type"
                    value={ticket.type}
                    onChange={(e) => handleTicketChange(index, e)}
                    className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
                  >
                    <option>Free</option>
                    <option>Paid</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`ticket-price-${index}`} className="block text-sm font-medium text-gray-700">Price(Php)</label>
                  <input
                    type="number"
                    id={`ticket-price-${index}`}
                    name="price"
                    value={ticket.price}
                    onChange={(e) => handleTicketChange(index, e)}
                    className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor={`ticket-quantity-${index}`} className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="text"
                    id={`ticket-quantity-${index}`}
                    name="quantity"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketChange(index, e)}
                    className="mt-1 block w-54 bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
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
            </div>
          ))}
          <button
            type="button"
            onClick={addTicketType}
            className="flex items-center justify-center w-60 px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors duration-200"
          >
            <span className="text-xl mr-2">+</span> Add Another Ticket Type
          </button>
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

