import React, { useState, memo } from 'react';

function CEStep1({
  formData,
  setFormData,
  handleChange
}) {
  return (
    <>
      <FormSection title="EVENT DETAILS">
        <EventTitleInput initialValue={formData.eventTitle} onBlurCallback={val => setFormData({ ...formData, eventTitle: val })} />
        <EventDescriptionTextarea initialValue={formData.eventDescription} onBlurCallback={val => setFormData({ ...formData, eventDescription: val })} />
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-4`}>
          <div>
            <label htmlFor="eventCategory" className="block text-sm font-medium text-gray-700">Event Category</label>
            <select id="eventCategory" name="eventCategory" value={formData.eventCategory} onChange={handleChange} className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4 cursor-pointer">
              <option>Concert</option>
              <option>Workshop</option>
              <option>Conference</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="eventCategory" className={`block text-sm italic ${formData.eventCategory !== 'Other' ? 'text-gray-400' : 'text-gray-700'}`}>Please specify</label>
            <input type="text" disabled={formData.eventCategory !== 'Other'} className={`${formData.eventCategory !== 'Other' ? 'cursor-not-allowed border-gray-100' : 'border-gray-300'} block w-full bg-white border-b-2 focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4`} />
          </div>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4`}>
          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">Event Type</label>
            <select id="eventType" name="eventType" value={formData.eventType} onChange={handleChange} className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4  cursor-pointer">
              <option value='Virtual'>Virtual</option>
              <option>In-person</option>
            </select>
          </div>

          <div>
            <label htmlFor="eventType" className={`block text-sm ${formData.eventType !== 'Virtual' ? 'text-gray-400' : 'text-gray-700'}`}>Meeting Plaform</label>
            <input type="text" disabled={formData.eventType !== 'Virtual'} placeholder='e.g. Google Meet' className={`${formData.eventType !== 'Virtual' ? 'cursor-not-allowed border-gray-100' : 'border-gray-300'} rounded-xl block w-full bg-white border-2 focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4`} />
          </div>

          {formData.eventType === 'Virtual' && (
            <div className='sm:col-span-2'>
              <label htmlFor="eventCategory" className={`block text-sm italic text-gray-700`}>Meeting Link</label>
              <input type="url" disabled={formData.eventType !== 'Virtual'} className={`border-gray-300 block w-full bg-white border-b-2 focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4`} />
            </div>
          )}
        </div>

      </FormSection>

      <FormSection title="EVENT IMAGE / POSTER">
        <p className="text-sm text-gray-500 mb-4">Main Event Image / Poster</p>
        <div className="flex justify-center items-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl relative overflow-hidden">
          {formData.eventImage ? (
            <img src={URL.createObjectURL(formData.eventImage)} alt="Event Poster Preview" className="object-cover w-full h-full" />
          ) : (
            <span className="text-gray-500">Upload an image here</span>
          )}
          <input id="eventImage" name="eventImage" type="file" accept="image/*" onChange={handleChange} className="hidden" />
          <button type="button" onClick={() => document.getElementById('eventImage').click()} className="absolute bottom-4 right-4 bg-teal-500 text-white font-semibold py-2 px-4 rounded-xl hover:bg-teal-600 transition-colors duration-200 cursor-pointer">
            Upload
          </button>
        </div>
      </FormSection>
    </>
  )
}
export default CEStep1;

const FormSection = ({ title, children }) => (
  <div className="p-4 md:p-6 rounded-2xl mb-6 bg-white shadow-sm">
    <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">{title}</h2>
    {children}
  </div>
);

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