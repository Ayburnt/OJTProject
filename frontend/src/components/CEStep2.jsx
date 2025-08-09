import React, { useState, useRef, useEffect, memo } from 'react';

function CEStep2({
    formData,
    handleCheckboxChange,
    handleChange,
    setFormData
}){
    return(
        <>
              <FormSection title="DATE AND LOCATION">
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Event</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Checkbox id="type-seminar" name="typeOfEvent" value="Seminar (3 or More Hours)" label="Seminar 3 or More Hours" checkedValues={formData.typeOfEvent} onChange={handleCheckboxChange} />
                  <Checkbox id="type-single-day" name="typeOfEvent" value="Single day Event" label="Single day Event" checkedValues={formData.typeOfEvent} onChange={handleCheckboxChange} />
                  <Checkbox id="type-multi-day" name="typeOfEvent" value="Multi-day Event" label="Multi-day Event" checkedValues={formData.typeOfEvent} onChange={handleCheckboxChange} />
                </div>
                <h3 className="block text-sm font-medium text-gray-700 mb-4 mt-6">Date & Time</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <CustomDateInput label="Start Date" id="eventStartDate" name="eventStartDate" value={formData.eventStartDate} onChange={handleChange} />
                  <CustomDateInput label="End Date" id="eventEndDate" name="eventEndDate" value={formData.eventEndDate} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <input type="text" name="startHour" value={formData.startHour} onChange={handleChange} placeholder="00" className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2" />
                      <span>:</span>
                      <input type="text" name="startMinute" value={formData.startMinute} onChange={handleChange} placeholder="00" className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2" />
                      <button type="button" onClick={() => handleChange({ target: { name: 'startPeriod', value: formData.startPeriod === 'AM' ? 'PM' : 'AM' } })} className="flex-1 bg-teal-500 text-white font-semibold rounded-xl px-4 py-2 hover:bg-teal-600 transition-colors duration-200 cursor-pointer">
                        {formData.startPeriod}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <input type="text" name="endHour" value={formData.endHour} onChange={handleChange} placeholder="00" className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2" />
                      <span>:</span>
                      <input type="text" name="endMinute" value={formData.endMinute} onChange={handleChange} placeholder="00" className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2" />
                      <button type="button" onClick={() => handleChange({ target: { name: 'endPeriod', value: formData.endPeriod === 'AM' ? 'PM' : 'AM' } })} className="flex-1 bg-teal-500 text-white font-semibold rounded-xl px-4 py-2 hover:bg-teal-600 transition-colors duration-200 cursor-pointer">
                        {formData.endPeriod}
                      </button>
                    </div>
                  </div>
                </div>
                <LocationInput initialValue={formData.location} onBlurCallback={val => setFormData({ ...formData, location: val })} />
                <div className="mt-4 h-64 bg-gray-200 rounded-xl overflow-hidden shadow-inner">
                  <img src="https://placehold.co/800x400/E5E7EB/6B7280?text=Map+Preview" alt="Map placeholder" className="object-cover w-full h-full" />
                </div>
              </FormSection>
              <FormSection title="ADD HIGHLIGHTS ABOUT YOUR EVENT">
                <label className="block text-sm font-medium text-gray-700 mb-2">What time can attendees check in before the event?</label>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <input type="text" name="timeCheckIn" value={formData.timeCheckIn} onChange={handleChange} placeholder="Type here" className="mt-1 flex-1 bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4" />
                  <RadioBox id="time-minutes" name="timeUnit" value="Minutes" label="Minutes" checkedValue={formData.timeUnit} onChange={handleChange} />
                  <RadioBox id="time-hours" name="timeUnit" value="Hours" label="Hours" checkedValue={formData.timeUnit} onChange={handleChange} />
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Is there an age restriction?</label>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <RadioBox id="age-all" name="ageRestriction" value="All ages allowed" label="All ages allowed" checkedValue={formData.ageRestriction} onChange={handleChange} />
                  <RadioBox id="age-restriction" name="ageRestriction" value="There's an age restriction" label="There's an age restriction" checkedValue={formData.ageRestriction} onChange={handleChange} />
                  <RadioBox id="age-guardian" name="ageRestriction" value="Parent or guardian needed" label="Parent or guardian needed" checkedValue={formData.ageRestriction} onChange={handleChange} />
                </div>
                {formData.ageRestriction === "There's an age restriction" && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What age is allowed</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {['12+', '13+', '14+', '15+', '16+', '17+', '18+', '19+', '20+', '21+'].map((age, index) => (
                        <RadioBox key={index} id={`age-${age}`} name="allowedAges" value={age} label={age} checkedValue={formData.allowedAges} onChange={handleChange} />
                      ))}
                    </div>
                  </>
                )}
                <label className="block text-sm font-medium text-gray-700 mb-2">Is there parking at your venue?</label>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <RadioBox id="parking-free" name="parking" value="Free Parking" label="Free Parking" checkedValue={formData.parking} onChange={handleChange} />
                  <RadioBox id="parking-paid" name="parking" value="Paid Parking" label="Paid Parking" checkedValue={formData.parking} onChange={handleChange} />
                  <RadioBox id="parking-none" name="parking" value="No Parking" label="No Parking" checkedValue={formData.parking} onChange={handleChange} />
                </div>
              </FormSection>
            </>
    );
}
export default CEStep2;

const FormSection = ({ title, children }) => (
  <div className="p-4 md:p-6 rounded-2xl mb-6 bg-white shadow-sm">
    <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">{title}</h2>
    {children}
  </div>
);

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
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          )}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </label>
    </div>
  );
});

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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
        </button>
      </div>
      <div ref={calendarRef} className={`absolute z-10 mt-2 p-4 bg-white rounded-xl shadow-lg border border-gray-200 transition-opacity duration-200 ${isCalendarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <span className="font-semibold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button type="button" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
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

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};