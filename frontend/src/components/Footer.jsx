import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'; // Import social media icons

// Assuming you've placed a flag.png in src/assets
import PhilippinesFlag from '../assets/Flag.png'; // Make sure this path is correct

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-12 border-t border-gray-200">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

        {/* Column 1: Logo and Country Selector */}
        <div className="flex flex-col items-start space-y-4">
          <img
            src={PhilippinesFlag}
            alt="Philippines Flag"
            className="h-8 mb-2"
          />
          <div className="relative w-full max-w-[180px]">
            <select
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
              defaultValue="Philippines"
            >
              <option value="Philippines">🇵🇭 Philippines</option>
              <option value="Thailand">🇹🇭 Thailand</option>
              <option value="Malaysia">🇲🇾 Malaysia</option>
              <option value="Singapore">🇸🇬 Singapore</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.096 6.924 4.682 8.338l4.611 4.612z"/></svg>
            </div>
          </div>
        </div>

        {/* Column 2: Need help? */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Need help?</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">How to buy tickets?</a></li> {/* Adjusted font size */}
            <li><a href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Where are my tickets?</a></li> {/* Adjusted font size */}
            <li><a href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">How to use e-ticket?</a></li> {/* Adjusted font size */}
            <li><a href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Help Center</a></li> {/* Adjusted font size */}
          </ul>
        </div>

        {/* Column 3: Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Support</h3>
          <ul className="space-y-2">
            <li><a href="mailto:support@sari-sari.com" className="text-sm text-gray-600 hover:text-teal-600 transition-colors flex items-center"><span className="mr-2">📧</span> support@sari-sari.com</a></li> {/* Adjusted font size */}
            <li><a href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors flex items-center"><span className="mr-2">📷</span> @sarisari</a></li> {/* Adjusted font size */}
            <li><a href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors flex items-center"><span className="mr-2">💬</span> Sarisari</a></li> {/* Adjusted font size */}
          </ul>
          <p className="text-gray-600 text-sm mt-4">Call us: <span className="font-semibold">Philippines</span></p>
          <p className="text-gray-600 text-sm">+63 2 8123 4567</p>
          <p className="text-gray-600 text-sm">Monday - Friday, 10.30-19.00 (UTC+8)</p>
        </div>

        {/* Column 4: For Event Organizers */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">For Event Organizers</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Our Solutions</a></li> {/* Adjusted font size */}
            <li><a href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Pricing</a></li> {/* Adjusted font size */}
            <li><a href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Contact Us</a></li> {/* Adjusted font size */}
          </ul>
        </div>

        {/* Column 5: Legal */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Terms</a></li> {/* Adjusted font size */}
            <li><a href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Policy</a></li> {/* Adjusted font size */}
            <li><a href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Security</a></li> {/* Adjusted font size */}
          </ul>
        </div>

      </div>

      {/* Copyright and Social Media */}
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm">
        <p className="mb-4 md:mb-0">
          © {currentYear} SariSari Inc. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-xl">
            <FaInstagram />
          </a>
          <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-xl">
            <FaFacebookF />
          </a>
          <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-xl">
            <FaTwitter />
          </a>
          <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors text-xl">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;