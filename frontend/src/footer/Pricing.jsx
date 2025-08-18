import React from "react";
import FooterNav from "../components/FooterNav";

 function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "₱0.00/month",
      features: [
        "Manage 1 event per month",
        "Basic ticketing & registration",
        "Email support",
      ],
      highlight: false,
    },
    {
      name: "Pro",
      price: "₱0.00/month",
      features: [
        "Manage up to 5 events per month",
        "Advanced ticketing & registration",
        "Event promotion tools",
        "Attendee management & check-in",
        "Priority support",
      ],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom Pricing",
      features: [
        "Unlimited events",
        "Full analytics & reporting",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced marketing & automation",
      ],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
         <FooterNav />

      {/* Hero Section */}
      <section className="bg-teal-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">Plans that grow with your events</h2>
          <p className="text-lg">Flexible pricing designed for organizers of all sizes.</p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center transition transform hover:scale-105 ${
              plan.highlight ? "border-2 border-teal-600" : ""
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold text-gray-800 mb-4">{plan.price}</p>
            <ul className="text-gray-600 mb-6 space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx}>• {feature}</li>
              ))}
            </ul>
            <button
              className={`px-6 py-2 rounded-md font-medium ${
                plan.highlight
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition`}
            >
              Select Plan
            </button>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="bg-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Need a custom solution?</h2>
          <p className="text-gray-600 mb-6">
            Contact us to design a plan that perfectly fits your event management needs.
          </p>
          <button className="bg-teal-600 text-white px-6 py-2 rounded-md font-medium hover:bg-teal-700 transition">
            Contact Sales
          </button>
        </div>
      </section>
    </div>
  );
}

export default Pricing;