import { IoExitOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

function OrganizerNav(){
   
   return (
  <div className="w-64 bg-white shadow-md p-4 flex flex-col justify-between items-center">
  <div className="w-full flex flex-col items-center">

    <div className="w-full flex justify-center mt-8 mb-10">
      <img src="/sariLogo.png" alt="Sari-Sari Events Logo" className="h-10" />
    </div>

    <ul className="space-y-8 text-left w-full ml-20">
      <li className="hover:text-teal-600 transition-colors cursor-pointer">Dashboard</li>
      <li className="hover:text-teal-600 transition-colors cursor-pointer">My Events</li>
      <li className="hover:text-teal-600 transition-colors cursor-pointer">Attendees</li>
      <li className="hover:text-teal-600 transition-colors cursor-pointer">Manage Account</li>
    </ul>
    <hr className="w-50 border-gray mt-13" />
  </div>

 <div className="h-screen w-64 bg-white shadow flex flex-col justify-between py-6 px-6">
  {/* Top Section */}
  <div>
    <div
      className="flex items-center gap-2 text-secondary cursor-pointer mt-5"
      onClick={() => console.log('Navigate to /client-dashboard')}
    >
      <IoIosArrowBack className="text-xl" />
      <span className="text-sm font-medium font-outfit">Home</span>
    </div>
  </div>

  {/* Bottom Section */}
  <div>
    <button
      className="flex items-center gap-2 text-secondary hover:underline font-outfit transition-colors mb-10"
      onClick={() => console.log('Logout clicked')}
    >
      <IoExitOutline className="text-xl transform -scale-x-100" />
      <span className="text-sm font-medium">Log Out</span>
    </button>
  </div>
</div>

    
    </div>
    

    )
}

export default OrganizerNav;