import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { BsDownload } from "react-icons/bs"; // Download icon
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';

function EventTransactions({ currentEvent, transactions, filteredTransactions, loadingAttendees, setSelectedTransaction, searchTransactions, setSearchTransactions }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const paginatedTransactions = filteredTransactions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // ✅ Download CSV function
    // ✅ Download CSV function
    const downloadCsv = () => {
        if (!filteredTransactions || filteredTransactions.length === 0) {
            alert("No transactions to export.");
            return;
        }

        const headers = ["Transaction Code", "Date", "Type", "Payment", "Amount", "Status"];
        const rows = filteredTransactions.map(tx => {
            const date = new Date(tx.created_at);
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            return [
                tx.payment_ref || "",
                formattedDate,
                tx.transaction_type || "",
                tx.payment || "",
                tx.amount || "",
                tx.status || "",
            ];
        });

        const csvContent = [headers, ...rows]
            .map(e => e.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${currentEvent.title || "transactions"}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <>
            {/* Search + Download */}
            <>
                {/* Header: Title + Download */}
                <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {currentEvent.title || "Event Transactions"}
                    </h1>

                    <button
                        onClick={downloadCsv}
                        className="mt-2 md:mt-0 flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all"
                    >
                        Download CSV <BsDownload />
                    </button>
                </div>

                {/* Search input */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 w-full">
                    <div className="relative w-full lg:max-w-sm">
                        <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                        <input
                            type="text"
                            placeholder="Search transactions"
                            value={searchTransactions}
                            onChange={(e) => setSearchTransactions(e.target.value)}
                            className="w-full pl-10 border-b border-gray-400 focus:border-teal-500 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
                        />
                    </div>
                </div>
            </>


            {/* Table */}
            <Paper sx={{ width: '100%', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Transaction Code</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Payment</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loadingAttendees ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-6 text-center text-gray-500">
                                        Loading transactions...
                                    </TableCell>
                                </TableRow>
                            ) : paginatedTransactions.length > 0 ? (
                                paginatedTransactions.map((a, idx) => (
                                    <Tooltip key={a.id} title="Click to view details" placement="top" arrow>
                                        <TableRow
                                            className={`text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition cursor-pointer`}
                                            onClick={() => setSelectedTransaction(a)}
                                        >
                                            <TableCell>{a.payment_ref || "—"}</TableCell>
                                            <TableCell>{new Date(a.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>{a.transaction_type}</TableCell>
                                            <TableCell>{a.payment || '—'}</TableCell>
                                            <TableCell>₱{a.amount || '—'}</TableCell>
                                            <TableCell>
                                                <span className={`px-3 py-1 rounded-full text-xs ${a.status === 'completed' || a.status === 'success' ? 'bg-green-100 text-green-700' :
                                                    a.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        a.status === 'failed' || a.status === 'error' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {a.status || 'Unknown'}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    </Tooltip>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-6 text-gray-500 text-center">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={filteredTransactions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    )
}

export default EventTransactions
