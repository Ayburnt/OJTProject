import React from 'react';

const FormSection = ({ title, children }) => (
  <div className="p-4 md:p-6 rounded-2xl mb-6 bg-white shadow-sm">
    <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">{title}</h2>
    <div className='px-4 w-full flex flex-col gap-4'>
      {children}
    </div>
  </div>
);

const InputField = ({ label, inputType, inputName, inputValue, inputOnChange, inputPlaceholder }) => (
  <div className='flex flex-col w-full gap-2'>
    <label htmlFor="" className='font-outfit text-sm leading-none m-0 text-gray-700'>{label}</label>
    <input className="w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-3"
      type={inputType} name={inputName} value={inputValue} placeholder={inputPlaceholder} onChange={inputOnChange} required/>
  </div>
)

const EventCodeInput = ({ label, inputType, inputName, inputValue, inputOnChange, inputPlaceholder, maxLength, disabled }) => (
  <div className='flex flex-col w-full gap-2'>
    <label htmlFor="" className='font-outfit text-sm leading-none m-0 text-gray-700'>{label}</label>
    <input className={`${disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'} w-full border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-3`}
      type={inputType} maxLength={maxLength} name={inputName} value={inputValue} placeholder={inputPlaceholder} onChange={inputOnChange} required disabled={disabled} />
  </div>
)

const EventDescInput = ({ label, inputName, inputValue, inputOnChange, inputPlaceholder }) => (
  <div className='flex flex-col w-full gap-2'>
    <label htmlFor="" className='font-outfit text-sm leading-none m-0 text-gray-700'>{label}</label>
    <textarea rows={4} name={inputName} value={inputValue} onChange={inputOnChange} placeholder={inputPlaceholder} required
      className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
    ></textarea>
  </div>
)


function CEStep1({
  formData,
  handleEventChange,
  isPosterErr,
  posterErr
}) {
  return (
    <>
      <FormSection title="EVENT DETAILS">
        <InputField label='Event Title' inputType='text' inputName='title'
          inputValue={formData.title} inputOnChange={handleEventChange}
          inputPlaceholder='e.g., Technolympics Summit 2000'
        />
        <EventCodeInput label='Event Code' inputType='text' inputName='event_code'
          inputValue={formData.event_code} inputOnChange={handleEventChange}
          inputPlaceholder='e.g., TS-2000' maxLength={50} disabled={!!formData.id}
        />
        <EventDescInput label='Event Description' inputName='description'
          inputValue={formData.description} inputOnChange={handleEventChange}
          inputPlaceholder='Tell attendees what to expect: the agenda, speakers, etc.'
        />

        <div className='flex flex-col w-full gap-2'>
          <label htmlFor="category" className="font-outfit text-sm leading-none m-0 text-gray-700">Event Category</label>
          <select id="category" name="category"
            value={formData.category}
            onChange={handleEventChange} required className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4 cursor-pointer">
            <option value="">Select</option>
            <option value='corporate'>Corporate Event</option>
            <option value='social'>Social Event</option>
            <option value='cultural'>Cultural Event</option>
            <option value='sports & Recreational'>Sports & Recreational Event</option>
            <option value='political & Government'>Political & Government Event</option>
            <option value='educational'>Educational Event</option>
            <option value="fundraising">Fundraising Event</option>
          </select>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4`}>
          <div>
            <label htmlFor="event_type" className="font-outfit text-sm leading-none m-0 text-gray-700">Event Type</label>
            <select id="event_type" name="event_type" value={formData.event_type} onChange={handleEventChange} required className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4  cursor-pointer">
              <option value="">Select</option>
              <option value='virtual'>Virtual</option>
              <option value='in-person'>In-person</option>
            </select>
          </div>

          <div>
            <label htmlFor="event_type" className={`text-sm ${formData.event_type !== 'virtual' ? 'text-gray-400' : 'text-gray-700'} font-outfit text-sm leading-none m-0`}>Meeting Plaform</label>
            <input type="text" name='meeting_platform' value={formData.meeting_platform} disabled={formData.event_type !== 'virtual'} onChange={handleEventChange} placeholder='e.g. Google Meet' className={`${formData.event_type !== 'virtual' ? 'cursor-not-allowed border-gray-100' : 'border-gray-300'} mt-1 rounded-xl block w-full bg-white border-2 focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4`} />
          </div>

          {formData.event_type === 'virtual' && (
            <div className='sm:col-span-2'>
              <label htmlFor="event_type" className={`block text-sm text-gray-700`}>Meeting Link</label>
              <input type="url" name='meeting_link' value={formData.meeting_link} disabled={formData.event_type !== 'virtual'} onChange={handleEventChange} required={formData.event_type === "virtual"} className={`border-gray-300 block w-full bg-white border-b-2 focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4`} />
            </div>
          )}
          
        </div>

        <div className="col-span-2">
            <label className="font-outfit text-sm leading-none m-0 text-gray-700">
              Set your audience
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Single-day event */}
              <input
                type="radio"
                id="audience_public"
                name="audience"
                value="public"
                checked={formData.audience === "public"}
                onChange={handleEventChange}
                className="hidden peer/public"
              />
              <label
                htmlFor="audience_public"
                className="block w-full py-4 px-3 text-center text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 hover:bg-gray-50 peer-checked/public:bg-teal-500 peer-checked/public:border-teal-500 peer-checked/public:text-white hover:text-secondary"
              >
                <span className="text-sm font-medium">Public</span>
              </label>

              {/* Multi-day event */}
              <input
                type="radio"
                id="audience_private"
                name="audience"
                value="private"
                checked={formData.audience === "private"}
                onChange={handleEventChange}
                className="hidden peer/private"
              />
              <label
                htmlFor="audience_private"
                className="block w-full py-4 px-3 text-center text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 hover:bg-gray-50 peer-checked/private:bg-teal-500 peer-checked/private:border-teal-500 peer-checked/private:text-white hover:text-secondary"
              >
                <span className="text-sm font-medium">Private</span>
              </label>
            </div>
          </div>

          {formData.audience === 'private' && (
            <>
            <InputField label='Event Private Code' inputType='text' inputName='private_code'
              inputValue={formData.private_code} inputOnChange={handleEventChange}
              inputPlaceholder='e.g., my-event-password'
              required={formData.audience === "private"}
            />

            <div className="col-span-2">
            <label className="font-outfit text-sm leading-none m-0 text-gray-700">
              Broadcast Event <br />
              <span className='text-gray-400'>Manage how your event will appear and be shared.</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Single-day event */}
              <input
                type="radio"
                id="broadcast_yes"
                name="is_broadcast"
                value="broadcast"
                checked={formData.is_broadcast === "broadcast"}
                onChange={handleEventChange}
                className="hidden peer/broadcast"
              />
              <label
                htmlFor="broadcast_yes"
                className="block w-full py-4 px-3 text-center text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 hover:bg-gray-50 peer-checked/broadcast:bg-teal-500 peer-checked/broadcast:border-teal-500 peer-checked/broadcast:text-white hover:text-secondary"
              >
                <span className="text-sm font-medium">Broadcast</span>
              </label>

              {/* Multi-day event */}
              <input
                type="radio"
                id="broadcast_no"
                name="is_broadcast"
                value="do-not-broadcast"
                checked={formData.is_broadcast === "do-not-broadcast"}
                onChange={handleEventChange}
                className="hidden peer/do-not-broadcast"
              />
              <label
                htmlFor="broadcast_no"
                className="block w-full py-4 px-3 text-center text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 hover:bg-gray-50 peer-checked/do-not-broadcast:bg-teal-500 peer-checked/do-not-broadcast:border-teal-500 peer-checked/do-not-broadcast:text-white hover:text-secondary"
              >
                <span className="text-sm font-medium">Do not broadcast</span>
              </label>
            </div>
          </div>
          </>
          )}
          
      </FormSection>

      <FormSection title={ <>  EVENT IMAGE / POSTER{" "}
      <span className="text-red-500">*</span> </>}>
        <p className="text-sm text-gray-500 mb-4">Recommended size: 16:9 ratio (JPG or PNG)</p>
        <div className={`flex justify-center items-center aspect-16/9 border-2 ${isPosterErr ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-xl relative overflow-hidden`}>
          {formData.event_poster ? (
            formData.event_poster instanceof File ? (
              <img
                src={URL.createObjectURL(formData.event_poster)}
                alt="Event Poster Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src={formData.event_poster} // Use string URL directly (e.g., from backend)
                alt="Event Poster Preview"
                className="object-cover w-full h-full"
              />
            )
          ) : (
            <span className="text-gray-500">Upload an image here</span>
          )}

          <input id="event_poster" name="event_poster" type="file" accept="image/*" onChange={handleEventChange} className="hidden" required/>
          <button type="button" onClick={() => document.getElementById('event_poster').click()} className="absolute bottom-4 right-4 bg-teal-500 text-white font-semibold py-2 px-4 rounded-xl hover:bg-teal-600 transition-colors duration-200 cursor-pointer">
            Upload
          </button>
        </div>
        {isPosterErr && (
          <p className='text-xs text-red-500 font-medium'>{posterErr}</p>
        )}
      </FormSection>
    </>
  )
}
export default CEStep1;