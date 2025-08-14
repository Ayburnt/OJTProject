function CEStep3({
    formData,
    handleTicketChange,
    removeTicketType,
    addTicketType,
    isPosterErr,
    handleEventChange,
    isSeatingMapErr,
    seatingMapErr,
    handleAddTicket,
    handleRemoveTicket
}){
    return(
         <FormSection title="TICKETING FOR EVENT">
      <p className="text-sm text-gray-500 mb-4">Seating Map Visual</p>
      <div
        className={`flex justify-center items-center aspect-16/9 border-2 ${
          isSeatingMapErr ? 'border-red-500' : 'border-gray-300'
        } border-dashed rounded-xl relative overflow-hidden`}
      >
        {formData.seating_map ? (
  <img
    src={typeof formData.seating_map === 'object' && formData.seating_map instanceof File
      ? URL.createObjectURL(formData.seating_map)
      : formData.seating_map
    }
    alt="Seating Map Preview"
    className="object-cover w-full h-full"
  />
) : (
  <span className="text-gray-500">Upload an image here</span>
)}


        <input
          id="seating_map"
          name="seating_map"
          type="file"
          accept="image/*"
          onChange={handleEventChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => document.getElementById('seating_map').click()}
          className="absolute bottom-4 right-4 bg-teal-500 text-white font-semibold py-2 px-4 rounded-xl hover:bg-teal-600 transition-colors duration-200 cursor-pointer"
        >
          Upload
        </button>
      </div>

      {formData.ticket_types.map((ticket, index) => (
        <div key={index} className="space-y-4 mb-6 p-4 border rounded-xl border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor={`ticket-name-${index}`} className="block text-sm font-medium text-gray-700">Ticket Name</label>
              <input
                type="text"
                id={`ticket-name-${index}`}
                name="ticket_name"
                value={ticket.ticket_name}
                onChange={(e) => handleTicketChange(index, e)}
                className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
              />
            </div>
            <div>
              <label htmlFor={`ticket-type-${index}`} className="block text-sm font-medium text-gray-700">Type</label>
              <select
                id={`ticket-type-${index}`}
                name="ticket_type"
                value={ticket.ticket_type}
                onChange={(e) => handleTicketChange(index, e)}
                className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4 cursor-pointer"
              >
                <option value='free'>Free</option>
                <option value='paid'>Paid</option>
              </select>
            </div>
            <div>
              <label htmlFor={`ticket-price-${index}`} className="block text-sm font-medium text-gray-700">Price(Php)</label>
              <input
                disabled={ticket.ticket_type === 'free'}
                type="number"
                id={`ticket-price-${index}`}
                name="price"
                value={ticket.price}
                onChange={(e) => handleTicketChange(index, e)}
                className={`mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4 ${ticket.ticket_type === 'free' && 'cursor-not-allowed'}`}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-end">
            <div>
              <label htmlFor={`ticket-quantity-${index}`} className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="text"
                id={`ticket-quantity-${index}`}
                name="quantity_total"
                value={ticket.quantity_total}
                onChange={(e) => handleTicketChange(index, e)}
                className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
              />
            </div>
            <div className="flex justify-start items-center">
              <button type="button" className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                Upload Seating Map
              </button>
            </div>
          </div>
          <div className="flex justify-start mt-4">
            <button
              type="button"
              onClick={() => handleRemoveTicket(index)}
              className="bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-xl hover:bg-red-600 transition-colors duration-200 max-w-xs w-full sm:w-auto cursor-pointer"
            >
              Remove Ticket Type
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-start">
        <button
          type="button"
          onClick={handleAddTicket}
          className="flex items-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors duration-200 cursor-pointer"
        >
          <span className="text-xl mr-2">+</span> Add Another Ticket Type
        </button>
      </div>
    </FormSection>
    );
}

export default CEStep3;

const FormSection = ({ title, children }) => (
  <div className="p-4 md:p-6 rounded-2xl mb-6 bg-white shadow-sm">
    <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">{title}</h2>
    {children}
  </div>
);