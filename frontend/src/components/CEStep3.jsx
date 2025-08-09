function CEStep3({
    formData,
    handleTicketChange,
    removeTicketType,
    addTicketType
}){
    return(
        <FormSection title="TICKETING FOR EVENT">
              {formData.ticketTypes.map((ticket) => (
                <div key={ticket.id} className="space-y-4 mb-6 p-4 border rounded-xl border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor={`ticket-name-${ticket.id}`} className="block text-sm font-medium text-gray-700">Ticket Name</label>
                      <input type="text" id={`ticket-name-${ticket.id}`} name="name" value={ticket.name} onChange={(e) => handleTicketChange(ticket.id, e)} className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4" />
                    </div>
                    <div>
                      <label htmlFor={`ticket-type-${ticket.id}`} className="block text-sm font-medium text-gray-700">Type</label>
                      <select id={`ticket-type-${ticket.id}`} name="type" value={ticket.type} onChange={(e) => handleTicketChange(ticket.id, e)} className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4 cursor-pointer">
                        <option>Free</option>
                        <option>Paid</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`ticket-price-${ticket.id}`} className="block text-sm font-medium text-gray-700">Price(Php)</label>
                      <input type="number" id={`ticket-price-${ticket.id}`} name="price" value={ticket.price} onChange={(e) => handleTicketChange(ticket.id, e)} className="mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-end">
                    <div>
                      <label htmlFor={`ticket-quantity-${ticket.id}`} className="block text-sm font-medium text-gray-700">Quantity</label>
                      <input type="text" id={`ticket-quantity-${ticket.id}`} name="quantity" value={ticket.quantity} onChange={(e) => handleTicketChange(ticket.id, e)} className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4" />
                    </div>
                    <div className="flex justify-start items-center">
                      <button type="button" className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                        Upload Seating Map
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-start mt-4">
                    <button type="button" onClick={() => removeTicketType(ticket.id)} className="bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-xl hover:bg-red-600 transition-colors duration-200 max-w-xs w-full sm:w-auto cursor-pointer">
                      Remove Ticket Type
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-start">
                <button type="button" onClick={addTicketType} className="flex items-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors duration-200 cursor-pointer">
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