import React from "react";
import { useNavigate } from "react-router-dom";

function RegisterSuccess({ setIsModalOpen, ticketLinks, transacCode }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] font-outfit">
      <div className="bg-white p-6 rounded-lg max-w-md w-full text-center items-center flex flex-col shadow-lg">
        <h2 className="text-xl font-bold mb-4">Registration Complete 🎉</h2>
        <p className="mb-2">
          Thank you for registering! Keep your ticket links safe — you’ll need
          them for entry.
        </p>
        <p>Here are your ticket(s):</p>

        <ul className="flex flex-row flex-wrap items-center justify-center space-x-4 space-y-1 w-3/4">
          {ticketLinks.map((link, idx) => {
            const cleanLink = link?.trim();
            console.log(`Ticket ${idx + 1} link:`, cleanLink);
            return (
              <li key={idx}>
                <a
                  href={`/attendee/${cleanLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline cursor-pointer hover:text-blue-800 font-outfit whitespace-nowrap"
                >
                  Ticket {idx + 1}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-3">
          <p>Transaction Link: </p>
          <a
          href={`/transaction/${transacCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline cursor-pointer hover:text-blue-800 font-outfit"
          >{transacCode}</a>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterSuccess;
