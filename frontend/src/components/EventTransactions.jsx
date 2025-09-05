import React from 'react'
import { CiSearch } from "react-icons/ci";

function EventTransactions({ currentEvent, transactions, filteredTransactions, loadingAttendees, setSelectedTransaction, searchTransactions, setSearchTransactions }) {
    return (
        <>
            {/* Search + Upload/Download */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 md:col-span-2">
                    {currentEvent.title || "Event Attendees"}
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 w-full">
                <div className="relative w-full lg:max-w-sm">
                    <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                    <input
                        type="text"
                        placeholder="Search attendees"
                        value={searchTransactions}
                        onChange={(e) => setSearchTransactions(e.target.value)}
                        className="w-full pl-10 border-b border-gray-400 focus:border-teal-500 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-md">
                <table className="w-full text-center border-collapse rounded-md">
                    <thead>
                        <tr className="text-gray-600 text-sm bg-gray-100">
                            <th className="py-3 px-4 border border-gray-300">Transaction Code</th>
                            <th className="py-3 px-4 border border-gray-300">Date</th>
                            <th className="py-3 px-4 border border-gray-300">Type</th>
                            <th className="py-3 px-4 border border-gray-300">Payment</th>
                            <th className="py-3 px-4 border border-gray-300">Amount</th>
                            <th className="py-3 px-4 border border-gray-300">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingAttendees ? (
                            <tr>
                                <td colSpan="7" className="py-6 text-center text-gray-500 border border-gray-300">
                                    Loading attendees...
                                </td>

                            </tr>
                        ) : filteredTransactions.length > 0 ? (
                            filteredTransactions.map((a, idx) => (
                                <tr
                                    key={a.id}
                                    className={`text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition cursor-pointer`}
                                    onClick={() => setSelectedTransaction(a)}
                                >
                                    {/* Reference Code */}
                                    <td onClick={() => setSelectedTransaction(a)} className="py-3 px-4 border border-gray-300 text-gray-600">
                                        {a.payment_ref || "—"}
                                    </td>

                                    {/* Reg.date */}
                                    <td className="py-3 px-4 border border-gray-300 text-gray-600">
                                        {new Date(a.created_at).toLocaleDateString()}
                                    </td>

                                    {/* Name */}
                                    <td className="py-3 px-4 border border-gray-300 text-gray-600">{a.transaction_type}</td>
                                    <td className="py-3 px-4 border border-gray-300 text-gray-600">{a.payment || ''}</td>
                                    <td className="py-3 px-4 border border-gray-300 text-gray-600">₱{a.amount || ''}</td>
                                    <td className="py-3 px-4 border border-gray-300 text-gray-600">{a.status || ''}</td>


                                    {/* Paid toggle */}
                                    {/* <td
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!a.paid) {
                                a.paid = "yes";
                              } else if (a.paid === "yes") {
                                a.paid = "no";
                              } else {
                                a.paid = null;
                              }
                              setTransactions([...transactions]); // refresh UI
                            }}
                            className="py-3 px-4 border border-gray-300 text-gray-600"
                          >
                            {a.paid === "yes" ? (
                              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">Yes</span>
                            ) : a.paid === "no" ? (
                              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs">No</span>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-400 text-xs">—</span>
                            )}
                          </td>                           */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-6 text-gray-500 border">No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default EventTransactions
