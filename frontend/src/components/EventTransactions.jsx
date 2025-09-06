import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Get the current page data
    const paginatedTransactions = filteredTransactions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );
    return (
        <>
            {/* Search + Upload/Download */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 md:col-span-2">
                    {currentEvent.title || "Event Transactions"}
                </h1>
            </div>

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

            {/* Table */}
            <Paper sx={{ width: '100%', overflow: 'hidden', fontFamily: 'Outfit, sans-serif' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}>Transaction Code</TableCell>
                                <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}>Date</TableCell>
                                <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}>Type</TableCell>
                                <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}>Payment</TableCell>
                                <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}>Amount</TableCell>
                                <TableCell sx={{fontFamily: 'Outfit, sans-serif'}}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loadingAttendees ? (
                                <TableRow>
                                    <TableCell  sx={{fontFamily: 'Outfit, sans-serif'}} colSpan={6} className="py-6 text-center text-gray-500">
                                        Loading transactions...
                                    </TableCell>
                                </TableRow>
                            ) : paginatedTransactions.length > 0 ? (
                                paginatedTransactions.map((a, idx) => (
                                    <Tooltip key={a.id} title="Click to view details" placement="top" arrow>
                                        <TableRow
                                            className={`text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition cursor-pointer`}
                                            onClick={() => setSelectedTransaction(a)}
                                            sx={{ 
                                                '&:hover': { 
                                                    backgroundColor: '#f3f4f6' 
                                                } 
                                            }}
                                        >
                                            {/* Transaction Code */}
                                            <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} className="py-3 px-4 text-gray-600">
                                                {a.payment_ref || "—"}
                                            </TableCell>

                                            {/* Date */}
                                            <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} className="py-3 px-4 text-gray-600">
                                                {new Date(a.created_at).toLocaleDateString()}
                                            </TableCell>

                                            {/* Type */}
                                            <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} className="py-3 px-4 text-gray-600">
                                                {a.transaction_type}
                                            </TableCell>

                                            {/* Payment */}
                                            <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} className="py-3 px-4 text-gray-600">
                                                {a.payment || '—'}
                                            </TableCell>

                                            {/* Amount */}
                                            <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} className="py-3 px-4 text-gray-600">
                                                ₱{a.amount || '—'}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} className="py-3 px-4 text-gray-600">
                                                <span className={`px-3 py-1 rounded-full text-xs ${
                                                    a.status === 'completed' || a.status === 'success' ? 'bg-green-100 text-green-700' :
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
                                    <TableCell sx={{fontFamily: 'Outfit, sans-serif'}} colSpan={6} className="py-6 text-gray-500 text-center">
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