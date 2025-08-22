import React from "react";


function RegisterSuccess({setIsModalOpen}) {
  

  return (
    <div className="min-h-screen flex items-center justify-center font-outfit">
      
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Registration Successful!</h2>
            <p>Success! You’re officially registered. We look forward to seeing you there!🎉🎉</p>
                <div className="flex justify-center mt-4">
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                    Close
                </button>
                </div>
          </div>
        </div>
     
    </div>
  );
}

export default RegisterSuccess;
