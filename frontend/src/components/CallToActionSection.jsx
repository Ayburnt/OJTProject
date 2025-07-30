import React from 'react';

function CallToActionSection() {
  return (
    <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 md:py-20 rounded-lg shadow-xl text-white text-center mb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow">
          Become An Event Organizer!
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 drop-shadow">
          Join our growing community and seamlessly manage your events with our powerful tools.
        </p>
        <button className="bg-white text-orange-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-2xl">
          Start Organizing Today
        </button>
      </div>
    </section>
  );
}

export default CallToActionSection;