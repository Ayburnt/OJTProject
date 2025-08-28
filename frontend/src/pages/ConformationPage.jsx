import React from 'react';

// Use this mock data to populate the component
const mockData = {
  headerTitle: "Confirmation Page",
  eventTitle: "HACKANGKONG 2025",
  eventDescription: "Supero duper mahabang haba ang description neto",
  eventType: "Social Event",
  scanLocation: "Scan at Location",
  ticketType: "Standard Access",
  qrCodeUrl: "https://placehold.co/200x200/000/fff?text=QR+Code",
  qrCodeText: "Scan this code at Entrance Venue",
  qrCodeNote: "[-] QR Scanner Required",
  purchaseDate: "Purchased on August 27, 2025",
  eventDetails: {
    date: "March 15, 2026",
    time: "2:00 PM - 8:00 PM",
    venue: "SMX Convention Pasay, 2nd Floor F2 Hall",
    seat: "Standard Seating",
    ticketHolder: "Gerlyn Rama Tanderpet",
    price: "₱ 200.00",
  },
  disclaimerPoints: [
    "Present this ticket upon entry",
    "No refunds or exchange",
    "Don't lose this ticket",
  ],
  footerText: "by : Event Sari - Sari",
};

const App = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-200 p-4 font-sans justify-center" style={{ fontFamily: '"Outfit", sans-serif' }}>
      {/* Header section with title and placeholder logo */}
      <div className="flex flex-col items-center text-center mb-6">
        <h1 className="text-sm font-bold text-gray-800 opacity-80">{mockData.headerTitle}</h1>
        <div className="w-24 h-24 bg-gray-300 rounded-lg mt-4">
          {/* Placeholder for a logo or image */}
        </div>
      </div>

      {/* Main container for mobile and laptop layouts */}
      <div className="w-full max-w-sm md:max-w-4xl flex flex-col md:flex-row md:space-x-8">

        {/* Left column for laptop view (banner and event details) */}
        <div className="w-full md:w-1/2 flex flex-col mb-4 md:mb-0">
          {/* New event banner section */}
          <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-4">
            <img 
              src="https://placehold.co/600x200/5243aa/ffffff?text=EVENT+BANNER" 
              alt="Event Banner" 
              className="w-full h-full object-cover rounded-2xl shadow-lg border border-gray-200" 
            />
          </div>

          {/* Event details section, now outside the card */}
          <div className="w-full p-4 pt-0">
            <h2 className="text-xl md:text-2xl font-bold tracking-wide text-gray-800">{mockData.eventTitle}</h2>
            <p className="text-sm mt-1 text-gray-600">{mockData.eventDescription}</p>
            
            <div className="mt-4 flex flex-col space-y-2 text-gray-600">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h.01M5 12h.01M19 12h.01M5 16h.01M19 16h.01M5 20h.01M19 20h.01" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                </svg>
                <span className="text-sm font-semibold">{mockData.eventDetails.date}, {mockData.eventDetails.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-semibold">{mockData.eventDetails.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column for laptop view (main content card) */}
        <div className="w-full md:w-1/2">
          {/* Main content card with new single structure */}
          <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200">
            {/* Ticket info section at the top of the card */}
            <div className="bg-gray-300 p-6 pb-2 rounded-t-2xl">
              <h2 className="text-xl md:text-2xl font-bold tracking-wide text-gray-800">{mockData.eventTitle}</h2>
              <p className="text-sm mt-1 text-gray-800">{mockData.eventType}</p>
              <div className="mt-6 flex justify-between items-center text-gray-600">
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold uppercase">{mockData.scanLocation}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold uppercase">TICKET CONFIRMED</span>
                  <span className="text-sm md:text-base font-bold text-gray-900" style={{ color: "#009494" }}>{mockData.ticketType}</span>
                </div>
              </div>
            </div>

            {/* Broken line separator */}
            <hr className="border-t border-dashed border-gray-300 w-full" />

            {/* Main white content section with QR code and details */}
            <div className="p-6 pt-2">
              {/* QR Code and related info */}
              <div className="mt-8 text-center flex flex-col items-center">
                <div className="bg-gray-200 rounded-xl p-4 shadow-inner">
                  <img
                    src={mockData.qrCodeUrl}
                    alt="QR Code"
                    className="w-48 h-48 md:w-56 md:h-56 rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-4">{mockData.qrCodeText}</p>
                <p className="text-xs text-gray-500 mt-6">{mockData.purchaseDate}</p>
              </div>
              
              {/* Separator line */}
              <hr className="border-t border-dashed border-gray-300 w-full my-6"/>

              {/* New Event Details section */}
              <div className="text-left mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Event Details</h3>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span className="capitalize font-medium text-gray-500">Date:</span>
                  <span className="font-semibold text-gray-700 text-right">{mockData.eventDetails.date}</span>
                </div>
                <hr className="border-gray-200 my-2" />
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span className="capitalize font-medium text-gray-500">Time:</span>
                  <span className="font-semibold text-gray-700 text-right">{mockData.eventDetails.time}</span>
                </div>
                <hr className="border-gray-200 my-2" />
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span className="capitalize font-medium text-gray-500">Venue:</span>
                  <span className="font-semibold text-gray-700 text-right">{mockData.eventDetails.venue}</span>
                </div>
                <hr className="border-gray-200 my-2" />
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span className="capitalize font-medium text-gray-500">Seat:</span>
                  <span className="font-semibold text-gray-700 text-right">{mockData.eventDetails.seat}</span>
                </div>
                <hr className="border-gray-200 my-2" />
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span className="capitalize font-medium text-gray-500">Ticket Holder:</span>
                  <span className="font-semibold text-gray-700 text-right">{mockData.eventDetails.ticketHolder}</span>
                </div>
                <hr className="border-gray-200 my-2" />
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span className="capitalize font-medium text-gray-500">Price:</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">{mockData.eventDetails.seat}</span>
                    <span className="font-bold text-gray-700 text-lg">{mockData.eventDetails.price}</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer section */}
              <hr className="my-6 border-gray-300 w-full" />
              <div className="mt-8 text-xs text-gray-500">
                <ul className="list-disc list-inside space-y-0">
                  {mockData.disclaimerPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
                <p className="text-right mt-4 opacity-50">{mockData.footerText}</p>
              </div>
              
              {/* Download button */}
              <div className="mt-12 flex justify-center">
                <button className="w-full px-8 py-3 bg-teal-500 text-white font-semibold rounded-xl shadow-lg hover:bg-teal-600 transition-colors flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
