import { useState } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

function CEStep3({
  formData,
  handleTicketChange,
  removeTicketType,
  addTicketType,
  setFormData,
  handleEventChange,
  isSeatingMapErr,
  seatingMapErr,
  handleAddTicket,
  handleRemoveTicket,
  selectedTier,
}) {
  const location = useLocation();
  const isEditPage = location.pathname.startsWith("/org/edit/");
  const [hasSeatingMap, setHasSeatingMap] = useState(false);

  const handleSeatingMapChange = (e) => {
    const isChecked = e.target.value === 'true';
    setHasSeatingMap(isChecked);

    // If "No" is selected, clear the seating map from formData
    if (!isChecked) {
      setFormData((prevData) => ({
        ...prevData,
        seating_map: null,
      }));
    }
  };

  // max number of ticket TYPES per tier
const ticketTypeLimits = {
  Free: 1,
  Basic: 3,
  Premium: 10,
  Mega: Infinity,
};

// max TOTAL quantity of tickets across all types
const totalQuantityLimits = {
  Free: 500,
  Basic: 1000,
  Premium: 5000,
  Mega: Infinity,
};

const maxTicketTypes = ticketTypeLimits[selectedTier] ?? Infinity;
const maxTotalQty = totalQuantityLimits[selectedTier] ?? Infinity;

const getCurrentTotalQty = () =>
  formData.ticket_types.reduce(
    (sum, t) => sum + (parseInt(t.quantity_total, 10) || 0),
    0
  );


  const handleAddTicketWithLimit = () => {
  const currentTotalQty = getCurrentTotalQty();

  if (formData.ticket_types.length >= maxTicketTypes && maxTicketTypes !== Infinity) {
    toast.error(
      `The ${selectedTier} plan allows up to ${maxTicketTypes} ticket type${
        maxTicketTypes > 1 ? "s" : ""
      }.`
    );
    return;
  }

  if (currentTotalQty >= maxTotalQty && maxTotalQty !== Infinity) {
    toast.error(
      `The ${selectedTier} plan allows a maximum of ${maxTotalQty.toLocaleString()} tickets in total.`
    );
    return;
  }

  addTicketType(); // your prop
};


const handleQuantityChange = (index, e) => {
  const value = parseInt(e.target.value, 10) || 0;
  const otherQty = formData.ticket_types
    .filter((_, i) => i !== index)
    .reduce((sum, t) => sum + (parseInt(t.quantity_total, 10) || 0), 0);

  if (maxTotalQty !== Infinity && otherQty + value > maxTotalQty) {
    toast.error(
      `Total quantity for the ${selectedTier} plan cannot exceed ${maxTotalQty.toLocaleString()}.`
    );
    return;
  }

  handleTicketChange(index, e);
};


  return (
    <FormSection title="TICKETING FOR EVENT">
      <div className="mb-5">
        <label htmlFor="" className="font-outfit text-gray-700">Do you have a seating map?</label>
        <div className="grid grid-cols-2 gap-3">
          {/* Yes */}
          <input
            type="radio"
            id="has_map_yes"
            name="hasSeatingMap"
            value={true}
            checked={hasSeatingMap === true}
            onChange={handleSeatingMapChange}
            className="hidden peer/yes"
          />
          <label
            htmlFor="has_map_yes"
            className="block w-full py-4 px-3 text-center text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 hover:bg-gray-50 peer-checked/yes:bg-teal-500 peer-checked/yes:border-teal-500 peer-checked/yes:text-white hover:text-secondary"
          >
            <span className="text-sm font-medium">Yes</span>
          </label>

          {/* No */}
          <input
            type="radio"
            id="has_map_no"
            name="hasSeatingMap"
            value={false}
            checked={hasSeatingMap === false}
            onChange={handleSeatingMapChange}
            className="hidden peer/no"
          />
          <label
            htmlFor="has_map_no"
            className="block w-full py-4 px-3 text-center text-gray-700 bg-white rounded-xl cursor-pointer border-2 border-gray-300 transition-all duration-200 hover:bg-gray-50 peer-checked/no:bg-teal-500 peer-checked/no:border-teal-500 peer-checked/no:text-white hover:text-secondary"
          >
            <span className="text-sm font-medium">No</span>
          </label>
        </div>
      </div>

      {hasSeatingMap && (
        <>
          <p className="text-sm text-gray-500 mb-4">Seating Map Visual</p>
          <div
            className={`flex justify-center items-center aspect-16/9 border-2 ${isSeatingMapErr ? 'border-red-500' : 'border-gray-300'
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
              required={hasSeatingMap === true}
            />
            <button
              type="button"
              onClick={() => document.getElementById('seating_map').click()}
              className="absolute bottom-4 right-4 bg-teal-500 text-white font-semibold py-2 px-4 rounded-xl hover:bg-teal-600 transition-colors duration-200 cursor-pointer"
            >
              Upload
            </button>
          </div>
        </>
      )}



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
                disabled={isEditPage}
                className={`${isEditPage ? "cursor-not-allowed bg-gray-100 text-gray-500" : "bg-white cursor-pointer"} mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4`}
              >
                <option value='free'>Free</option>
                <option value='paid'>Paid</option>
              </select>
            </div>
            <div>
              <label htmlFor={`ticket-price-${index}`} className="block text-sm font-medium text-gray-700">Price(Php)</label>
              <input
                disabled={ticket.ticket_type === 'free' || isEditPage}
                type="number"
                id={`ticket-price-${index}`}
                name="price"
                value={ticket.price}
                onChange={(e) => handleTicketChange(index, e)}
                className={`mt-1 block w-full bg-white border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4 ${ticket.ticket_type === 'free' || isEditPage ? "cursor-not-allowed bg-gray-100 text-gray-500" : "bg-white cursor-pointer"}`}
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
                onChange={(e) => handleQuantityChange(index, e)}
                className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-b-teal-500 focus:ring-0 focus:outline-none transition-colors duration-200 py-2 px-4"
              />
            </div>

          </div>
          <div className="flex justify-start mt-4">
            <button
              type="button"
              onClick={() => handleRemoveTicket(index)}
              disabled={isEditPage}
              className={`${isEditPage ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors duration-200 max-w-xs w-full sm:w-auto cursor-pointer`}
            >
              Remove Ticket Type
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-start">
        <button
          type="button"
          onClick={handleAddTicketWithLimit}
          disabled={
            maxTicketTypes !== Infinity && formData.ticket_types.length >= maxTicketTypes || isEditPage
          }
          className={`flex items-center px-4 py-2 font-semibold rounded-xl transition-colors duration-200 cursor-pointer
      ${maxTicketTypes !== Infinity &&
              formData.ticket_types.length >= maxTicketTypes || isEditPage
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
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