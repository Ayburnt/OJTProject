import React, { useState, useRef, useEffect, memo } from 'react';
import LocationPicker from './LocationPicker.jsx'


function CEStep2({
  formData,
  handleCheckboxChange,
  handleLocationChange,
  handleChange,
  setFormData,
  handleEventChange,
  handleTimeChange
}) {
  return (
    <>
      <FormSection title="DATE AND LOCATION">
        <div className="col-span-2">
          <label className="font-outfit text-sm leading-none m-0 text-gray-700">
            Type of Event
          </label>

          <div className="grid grid-cols-2 gap-3">
            {/* Single-day event */}
            <input
              type="radio"
              id="duration_type_single"
              name="duration_type"
              value="single"
              checked={formData.duration_type === "single"}
              onChange={handleEventChange}
              className="hidden peer/single"
            />
            <label
              htmlFor="duration_type_single"
              className="block w-full py-4 px-3 text-center text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 hover:bg-gray-50 peer-checked/single:bg-teal-500 peer-checked/single:border-teal-500 peer-checked/single:text-white hover:text-secondary"
            >
              <span className="text-sm font-medium">Single-day event</span>
            </label>

            {/* Multi-day event */}
            <input
              type="radio"
              id="duration_type_multiple"
              name="duration_type"
              value="multiple"
              checked={formData.duration_type === "multiple"}
              onChange={handleEventChange}
              className="hidden peer/multiple"
            />
            <label
              htmlFor="duration_type_multiple"
              className="block w-full py-4 px-3 text-center text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 hover:bg-gray-50 peer-checked/multiple:bg-teal-500 peer-checked/multiple:border-teal-500 peer-checked/multiple:text-white hover:text-secondary"
            >
              <span className="text-sm font-medium">Multi-day event</span>
            </label>
          </div>
        </div>


        <h3 className="block text-sm font-medium text-gray-700 mt-4 mb-2">Date & Time</h3>
        <div className={`grid grid-cols-1 gap-6 mb-4 ${formData.duration_type === 'multiple' ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
          <CustomDateInput
            label={`${formData.duration_type === 'multiple' ? 'Start Date' : 'Date'}`}
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleEventChange}
            required
          />

          {formData.duration_type === 'multiple' && (
            <CustomDateInput
              label="End Date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleEventChange}
              required
            />
          )}

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="number"
                name="startHour"
                value={formData.startHour}
                onChange={(e) => handleTimeChange("start", "hour", e.target.value)}
                placeholder="00"
                maxLength={2}
                min={1}
                max={12}
                required
                className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
              />
              <span>:</span>
              <input
                type="number"
                name="startMinute"
                value={formData.startMinute || "00" }
                onChange={(e) => handleTimeChange("start", "minute", e.target.value)}
                placeholder="00"
                maxLength={2}
                min={0}
                max={59}
                required
                className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleTimeChange("start", "period", "AM")}
                  required
                  className={`px-4 py-2 rounded-xl font-semibold transition-colors duration-200 cursor-pointer ${formData.startPeriod === "AM"
                      ? "bg-teal-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handleTimeChange("start", "period", "PM")}
                  required
                  className={`px-4 py-2 rounded-xl font-semibold transition-colors duration-200 cursor-pointer ${formData.startPeriod === "PM"
                      ? "bg-teal-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="number"
                name="endHour"
                value={formData.endHour}
                onChange={(e) => handleTimeChange("end", "hour", e.target.value)}
                placeholder="00"
                maxLength={2}
                min={1}
                max={12}
                required
                className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
              />
              <span>:</span>
              <input
                type="number"
                name="endMinute"
                value={formData.endMinute || "00"}
                onChange={(e) => handleTimeChange("end", "minute", e.target.value)}
                maxLength={2}
                min={0}
                max={59}
                required
                className="w-12 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2"
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleTimeChange("end", "period", "AM")}
                  required
                  className={`px-4 py-2 rounded-xl font-semibold transition-colors duration-200 cursor-pointer ${formData.endPeriod === "AM"
                      ? "bg-teal-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handleTimeChange("end", "period", "PM")}
                  required
                  className={`px-4 py-2 rounded-xl font-semibold transition-colors duration-200 cursor-pointer ${formData.endPeriod === "PM"
                      ? "bg-teal-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  PM
                </button>
              </div>
            </div>
          </div>


        </div>

        <div className="mt-4 py-2 rounded-xl">
          <input
    type="hidden"
    name="venue_address"
    value={formData.venue_address || ""}
    required
  />
          <LocationPicker
            value={{
              lat: formData.venue_lat ?? 14.5995,
              lng: formData.venue_lng ?? 120.9842,
              name: formData.venue_name || "",
              address: formData.venue_address || "",
            }}
            formData={formData}
            handleEventChange={handleEventChange}
            handleLocationChange={handleLocationChange}
          />

        </div>
      </FormSection>
      <FormSection title="ADD HIGHLIGHTS ABOUT YOUR EVENT">
        <label className="block text-sm font-medium text-gray-700 mb-2">Is there an age restriction?</label>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* all */}
          <input
            type="radio"
            id="age_restriction_all"
            name="age_restriction"
            value="all"
            checked={formData.age_restriction === "all"}
            onChange={handleEventChange}
            className="hidden peer/all"
          />
          <label
            htmlFor="age_restriction_all"
            className="block w-full py-4 px-3 text-center text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 hover:bg-gray-50 peer-checked/all:bg-teal-500 peer-checked/all:border-teal-500 peer-checked/all:text-white hover:text-secondary"
          >
            <span className="text-sm font-medium">All ages allowed</span>
          </label>

          {/* restricted */}
          <input
            type="radio"
            id="age_restriction_restricted"
            name="age_restriction"
            value="restricted"
            checked={formData.age_restriction === "restricted"}
            onChange={handleEventChange}
            required
            className="hidden peer/restricted"
          />
          <label
            htmlFor="age_restriction_restricted"
            className="block w-full py-4 px-3 text-center text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 hover:bg-gray-50 peer-checked/restricted:bg-teal-500 peer-checked/restricted:border-teal-500 peer-checked/restricted:text-white hover:text-secondary"
          >
            <span className="text-sm font-medium">There's an age restriction</span>
          </label>


          {/* guardian needed */}
          <input
            type="radio"
            id="age_restriction_guardian_needed"
            name="age_restriction"
            value="guardian_needed"
            checked={formData.age_restriction === "guardian_needed"}
            onChange={handleEventChange}
            className="hidden peer/guardian_needed"
          />
          <label
            htmlFor="age_restriction_guardian_needed"
            className="block w-full py-4 px-3 text-center text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 hover:bg-gray-50 peer-checked/guardian_needed:bg-teal-500 peer-checked/guardian_needed:border-teal-500 peer-checked/guardian_needed:text-white hover:text-secondary"
          >
            <span className="text-sm font-medium">Parent or guardian needed</span>
          </label>
        </div>

        {formData.age_restriction === "restricted" && (
          <>
           <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">
  What age is allowed?
</label>

<div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
  {['12+', '13+', '14+', '15+', '16+', '17+', '18+', '19+', '20+', '21+'].map(
    (age, index) => (
      <RadioBox
        key={index}
        id={`age-${age}`}
        name="age_allowed"
        value={age}
        label={age}
        checkedValue={formData.age_allowed}
        onChange={handleEventChange}
        required ={formData.age_restriction === 'restricted'}
        className="px-2 py-1 text-xs rounded-md" // 👈 makes them smaller
      />
    )
  )}
</div>


          </>
        )}
        {formData.event_type !== 'virtual' && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-6">
              Parking Options
            </label>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {["Free Parking", "Paid Parking", "No Parking"].map((option) => {
                const isChecked = formData.parking.split(", ").includes(option);
                return (
                  <label
                    key={option}
                    className="flex items-center space-x-2 min-w-[140px] sm:min-w-[160px] md:min-w-[180px] max-w-full justify-center"
                  >
                    <input
                      type="checkbox"
                      name="parking"
                      value={option}
                      checked={isChecked}
                      required={formData.parking.length === 0}
                      onChange={(e) => {
                        const { value, checked } = e.target;
                        let selected = formData.parking
                          ? formData.parking.split(", ")
                          : [];

                        if (checked) {
                          selected.push(value);
                        } else {
                          selected = selected.filter((p) => p !== value);
                        }

                        setFormData((prev) => ({
                          ...prev,
                          parking: selected.join(", "),
                        }));
                      }}
                      className="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{option}</span>
                  </label>
                );
              })}
            </div>
          </>
        )}



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

// const Checkbox = memo(({ id, name, value, label, checkedValues, onChange }) => {
//   const isChecked = checkedValues.includes(value);
//   const handleCheckboxChange = () => {
//     onChange(value, !isChecked);
//   };
//   return (
//     <div className="flex-1 min-w-0">
//       <input
//         type="checkbox"
//         id={id}
//         name={name}
//         value={value}
//         checked={isChecked}
//         onChange={handleCheckboxChange}
//         className="hidden peer"
//       />
//       <label
//         htmlFor={id}
//         className="flex items-center gap-3 p-4 text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-50
//           peer-checked:border-teal-500 peer-checked:bg-teal-500 peer-checked:shadow-lg peer-checked:text-white"
//       >
//         <div className="w-5 h-5 flex items-center justify-center border-2 rounded-md transition-colors duration-200 peer-checked:bg-teal-500 peer-checked:border-teal-500">
//           {isChecked && (
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
//               <path d="M20 6 9 17l-5-5" />
//             </svg>
//           )}
//         </div>
//         <span className="text-sm font-medium">{label}</span>
//       </label>
//     </div>
//   );
// });

const CustomDateInput = memo(({ label, id, name, value, onChange, required = false }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState("");
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
    setError("");
  };

   // This will be called from the parent form before submit
  const validate = () => {
    if (required && !value) {
      setError("This field is required");
      return false;
    }
    setError("");
    return true;
  };

  // expose validate method to parent via ref (so parent can call it on submit)
  useEffect(() => {
    if (onChange) {
      onChange.validate = validate;
    }
  }, [value]);


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
    <div className="relative z-100">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input type="text" id={id} ref={inputRef} value={value} readOnly required={required} onFocus={() => setIsCalendarOpen(true)} className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4" />
        <button type="button" onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
        </button>
      </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        
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
const RadioBox = memo(({ id, name, value, label, checkedValue, onChange, required }) => (
  <div className="flex-1 min-w-0">
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checkedValue === value}
      onChange={onChange}
      required
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