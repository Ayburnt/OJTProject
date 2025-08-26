import React from "react";
import { useNavigate } from "react-router-dom";


function RegisterSuccess({setIsModalOpen}) {
  const navigate = useNavigate();

  return (
      
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-100 font-outfit">
          <div className="bg-white p-6 rounded-lg max-w-md w-full text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4">Registration Successful!</h2>
            <p>Success! You’re officially registered. We look forward to seeing you there!🎉🎉</p>
            <p>Your QR Code will be sent to your email — keep an eye on your inbox!</p>
                <div className="flex justify-center mt-4">
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                    Okay
                </button>
                </div>
          </div>
        </div>
    
  );
}

export default RegisterSuccess;
