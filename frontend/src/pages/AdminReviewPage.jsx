import React, { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import api from '../api.js';
import { FaArrowLeft } from "react-icons/fa6"; // Assuming you have this icon for the back button

function fileExt(url = "") {
  const parts = url.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

function isImage(url) {
  return ["png", "jpg", "jpeg", "gif", "webp"].includes(fileExt(url));
}

function DocTile({ label, file }) {
  if (!file) {
    return (
      <div className="rounded-xl border p-4 bg-gray-50">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-gray-500 mt-1">— Not uploaded —</p>
      </div>
    );
  }

  const isImg = isImage(file);

  return (
    <div className="rounded-xl border p-4 bg-white shadow-sm">
      <p className="text-sm font-semibold mb-2">{label}</p>
      <div className="flex items-center gap-3">
        {isImg ? (
          <img
            src={file}
            alt={label}
            className="h-20 w-20 rounded-lg object-cover border"
          />
        ) : (
          <div className="h-20 w-20 rounded-lg border flex items-center justify-center text-xs">
            {fileExt(file).toUpperCase() || "FILE"}
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {file.split("/").pop() || "Document"}
          </p>
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline hover:no-underline"
          >
            Open in new tab
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminReviewPage() {
  const [selected, setSelected] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get("/organizer-applications/pending/");
      setPendingRequests(response.data);
    } catch (err) {
      console.error("Failed to fetch pending requests:", err);
      setError("Failed to load pending applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleUpdate = async (status) => {
    if (!selected) return;

    try {
      await api.patch(`/organizer-applications/${selected.id}/${status}/`);
      alert(`${status === "accept" ? "Accepted" : "Declined"}: ${selected.organizer_name}`);

      // Optimistically update the UI by filtering out the handled request
      setPendingRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== selected.id)
      );
      setSelected(null);
    } catch (err) {
      console.error(`Failed to ${status} request:`, err);
      alert(`Failed to ${status} application.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading pending requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-aliceblue font-outfit grid grid-cols-1 md:grid-cols-6 xl:grid-cols-9">
      <AdminNav />

      <main className="overflow-y-scroll col-span-6 md:col-span-4 xl:col-span-7 flex flex-col px-6 mt-10 md:px-8 lg:px-12 py-6">
        {!selected ? (
          <div className="bg-white rounded-2xl shadow border p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <h1 className="text-2xl font-bold font-outfit">Admin Review</h1>
              <p className="text-sm text-gray-500">
                {pendingRequests.length} pending account
                {pendingRequests.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="overflow-auto rounded-xl border">
              <table className="min-w-[800px] w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="p-3 border font-medium">Organizer</th>
                    <th className="p-3 border font-medium">Business</th>
                    <th className="p-3 border font-medium">DTI Reg. #</th>
                    <th className="p-3 border font-medium">Email</th>
                    <th className="p-3 border font-medium">Submitted</th>
                    <th className="p-3 border font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{req.organizer_name}</td>
                      <td className="p-3 border">{req.business_name}</td>
                      <td className="p-3 border">
                        {req.dti_registration_number}
                      </td>
                      <td className="p-3 border">{req.contact_email}</td>
                      <td className="p-3 border">
                        {new Date(req.submitted_at).toLocaleString()}
                      </td>
                      <td className="p-3 border">
                        <button
                          onClick={() => setSelected(req)}
                          className="px-4 py-2 rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pendingRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500">
                        No pending verifications.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow border p-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300"
                >
                  <FaArrowLeft />
                  Back
                </button>
                <h1 className="text-2xl font-bold font-outfit">
                  Organizer Details
                </h1>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleUpdate("decline")}
                  className="px-5 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleUpdate("accept")}
                  className="px-5 py-2 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                >
                  Accept
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="rounded-xl border p-5 bg-gray-50">
                <h2 className="font-semibold text-lg mb-3">
                  Organizer Information
                </h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selected.organizer_name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selected.contact_email}
                  </p>
                  <p>
                    <span className="font-medium">Contact Number:</span>{" "}
                    {selected.contact_number}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border p-5 bg-gray-50">
                <h2 className="font-semibold text-lg mb-3">
                  Business Information
                </h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Business Name:</span>{" "}
                    {selected.business_name}
                  </p>
                  <p>
                    <span className="font-medium">DTI Registration #:</span>{" "}
                    {selected.dti_registration_number}
                  </p>
                  <p>
                    <span className="font-medium">Business Address:</span>{" "}
                    {selected.business_address}
                  </p>
                  <p>
                    <span className="font-medium">Submitted:</span>{" "}
                    {new Date(selected.submitted_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <h2 className="font-semibold text-lg mb-3">Uploaded Documents</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DocTile
                label="DTI Business Registration"
                file={selected.dti_file}
              />
              <DocTile label="Valid Government ID" file={selected.govt_id_file} />
              <DocTile
                label="Business Permit"
                file={selected.business_permit_file}
              />
              <DocTile
                label="Tax Identification Number"
                file={selected.tin_file}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}