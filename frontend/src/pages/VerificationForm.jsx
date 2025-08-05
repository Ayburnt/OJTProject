import React, { useState, useCallback } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa6";
import { Link } from 'react-router-dom';

// A reusable component for the document upload section
const DocumentUploadSection = ({ title, fileTypes, fileSizeLimit, onFileChange, file }) => {
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag over event
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Handle drag leave event
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange({ target: { files: e.dataTransfer.files } });
    }
  }, [onFileChange]);

  // Use a unique ID for the input to connect with the label
  const inputId = `upload-${title.replace(/\s+/g, '-')}`;


  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <FaRegCircle />
      </div>
      <label
        htmlFor={inputId}
        className={`flex flex-col items-center justify-center p-6 text-center rounded-xl cursor-pointer transition-all duration-300
                    ${isDragging ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200'}
                    border-2 border-dashed hover:border-teal-500 hover:bg-teal-50`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <MdOutlineFileUpload isDragging={isDragging} />
        {file ? (
          <p className="text-sm font-outfit font-medium text-gray-700 break-words w-full px-2">{file.name}</p>
        ) : (
          <p className={`text-sm font-outfit text-gray-500 font-medium ${isDragging ? 'text-blue-600' : ''}`}>
            Click to upload documents
          </p>
        )}
        <p className="text-xs font-outfit text-gray-400 mt-1">
          {fileTypes} up to {fileSizeLimit} MB each
        </p>
      </label>
      <input
        id={inputId}
        type="file"
        accept={fileTypes.replace(/ /g, '').split(',').map(type => `.${type.toLowerCase()}`).join(',')}
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
};

// The "Become an Organizer" form component
const OrganizerInfoForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    organizerName: '',
    businessName: '',
    dtiRegistrationNumber: '',
    contactEmail: '',
    contactNumber: '',
    businessAddress: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputStyle = "mt-1 block w-full rounded-xl py-3 px-4 border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm";

  return (
    <div className="bg-white w-full max-w-lg p-6 rounded-3xl shadow-lg border border-gray-200 space-y-6">
      <div className="flex items-center mb-6">
        <Link to="/manage-account">
        <button className="flex items-center font-outfit text-teal-600 hover:text-teal-800 transition-colors duration-200">
          <FaArrowLeft />
          <span className="ml-2 font-outfit font-medium">Back</span>
        </button>
        </Link>
      </div>

      <div className="text-center font-outfit mb-6">
        <h1 className="text-3xl font-bold">Become an Organizer</h1>
        <p className="text-gray-500 mt-1">Create and manage your events with ease.</p>
      </div>

      <h2 className="text-xl font-outfit font-bold mb-4">Organizer Information</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="organizerName" className="block text-sm font-outfit font-medium text-gray-700">Organizer Name</label>
          <input
            type="text"
            id="organizerName"
            name="organizerName"
            value={formData.organizerName}
            onChange={handleChange}
            placeholder="Enter Full Name"
            className={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="businessName" className="block text-sm font-outfit font-medium text-gray-700">Business Name</label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Enter Business Name"
            className={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="dtiRegistrationNumber" className="block text-sm font-outfit font-medium text-gray-700">DTI Registration Number</label>
          <input
            type="text"
            id="dtiRegistrationNumber"
            name="dtiRegistrationNumber"
            value={formData.dtiRegistrationNumber}
            onChange={handleChange}
            placeholder="Enter DTI Number"
            className={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-outfit font-medium text-gray-700">Contact Email</label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Enter Email Address"
            className={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="contactNumber" className="block text-sm font-outfit font-medium text-gray-700">Contact Number</label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter Phone/Telephone Number"
            className={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="businessAddress" className="block text-sm font-outfit font-medium text-gray-700">Business Address</label>
          <textarea
            id="businessAddress"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleChange}
            placeholder="Enter your complete business address"
            rows="3"
            className={inputStyle}
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onNext}
          className="w-full bg-teal-600 text-white py-3 px-6 rounded-full font-outfit font-bold text-lg hover:bg-teal-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// The "Verify Account" form component
const VerificationForm = ({ onBack, onSubmit, dtiFile, govtIdFile, businessPermitFile, tinFile, handleDtiFileChange, handleGovtIdFileChange, handleBusinessPermitFileChange, handleTinFileChange }) => {
  return (
    <div className="bg-white w-full max-w-lg p-6 rounded-3xl shadow-lg border border-gray-200 space-y-6">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 transition-colors duration-200">
          <FaArrowLeft />
          <span className="ml-2 font-outfit font-medium">Back</span>
        </button>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl font-bold font-outfit text-center mb-6">Verify Account</h1>

      {/* Upload Guidelines Section */}
      <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
        <h2 className="font-bold font-outfit text-secondary mb-2">Upload Guidelines</h2>
        <ul className="list-disc list-inside text-sm font-outfit text-black space-y-1">
          <li>Ensure all Documents are clear and readable.</li>
          <li>DTI Registration must be current and valid.</li>
          <li>Government I.D. must match the employee name.</li>
          <li>File formats: PDF, JPG, PNG, DOC, DOCX.</li>
          <li>Maximum file size: 10 MB per Document.</li>
        </ul>
      </div>

      {/* Document Upload Sections */}
      <DocumentUploadSection
        title="DTI Business Registration"
        fileTypes="PDF, JPG, PNG, DOC, DOCX"
        fileSizeLimit="10"
        onFileChange={handleDtiFileChange}
        file={dtiFile}
      />
      <DocumentUploadSection
        title="Valid Government ID"
        fileTypes="PDF, JPG, PNG, DOC, DOCX"
        fileSizeLimit="10"
        onFileChange={handleGovtIdFileChange}
        file={govtIdFile}
      />
      <DocumentUploadSection
        title="Business Permit"
        fileTypes="PDF, JPG, PNG, DOC, DOCX"
        fileSizeLimit="10"
        onFileChange={handleBusinessPermitFileChange}
        file={businessPermitFile}
      />
      <DocumentUploadSection
        title="Tax Identification Number"
        fileTypes="PDF, JPG, PNG, DOC, DOCX"
        fileSizeLimit="10"
        onFileChange={handleTinFileChange}
        file={tinFile}
      />

      {/* Submit Button */}
      <div className="pt-4">
        <button
          onClick={onSubmit}
          className="w-full bg-teal-600 text-white py-3 px-6 rounded-full font-bold text-lg hover:bg-teal-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        >
          Submit for Verification
        </button>
      </div>
    </div>
  );
};

// The main application component
const App = () => {
  const [step, setStep] = useState(1); // 1: Organizer Info, 2: Verification

  // State for the verification document uploads
  const [dtiFile, setDtiFile] = useState(null);
  const [govtIdFile, setGovtIdFile] = useState(null);
  const [businessPermitFile, setBusinessPermitFile] = useState(null);
  const [tinFile, setTinFile] = useState(null);

  // Memoized change handlers for each file input
  const handleDtiFileChange = useCallback((e) => {
    setDtiFile(e.target.files[0] || null);
  }, []);

  const handleGovtIdFileChange = useCallback((e) => {
    setGovtIdFile(e.target.files[0] || null);
  }, []);

  const handleBusinessPermitFileChange = useCallback((e) => {
    setBusinessPermitFile(e.target.files[0] || null);
  }, []);

  const handleTinFileChange = useCallback((e) => {
    setTinFile(e.target.files[0] || null);
  }, []);

  // Navigation functions
  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = () => {
    // In a real application, you would handle the form submission.
    alert("Form submitted!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {step === 1 ? (
        <OrganizerInfoForm onNext={handleNext} />
      ) : (
        <VerificationForm
          onBack={handleBack}
          onSubmit={handleSubmit}
          dtiFile={dtiFile}
          govtIdFile={govtIdFile}
          businessPermitFile={businessPermitFile}
          tinFile={tinFile}
          handleDtiFileChange={handleDtiFileChange}
          handleGovtIdFileChange={handleGovtIdFileChange}
          handleBusinessPermitFileChange={handleBusinessPermitFileChange}
          handleTinFileChange={handleTinFileChange}
        />
      )}
    </div>
  );
};

export default App;
