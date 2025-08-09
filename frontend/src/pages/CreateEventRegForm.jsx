import React, { useState, useRef } from "react";
import { IoIosArrowDown, IoIosEye, IoIosArrowBack } from "react-icons/io";
import { BsGripVertical, BsImage, BsTrash } from "react-icons/bs";
import { FiUploadCloud } from "react-icons/fi";

export default function CreateEventRegForm() {
  const [questions, setQuestions] = useState([
    { id: 1, type: "Question Type", content: "", options: [""] },
    { id: 2, type: "Short Answer", content: "", options: [""] },
    { id: 3, type: "Multiple Choice", content: "", options: ["Option 1"] },
  ]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [imageUploadFor, setImageUploadFor] = useState(null);

  const dropdownTypes = [
    "Short Answer",
    "Long Answer",
    "Multiple Choice",
    "Check boxes",
    "Dropdowns",
  ];

  const fileRef = useRef(null);

  const addQuestion = () => {
    const newId = Date.now();
    setQuestions((prev) => [
      ...prev,
      { id: newId, type: "Question Type", content: "", options: [""] },
    ]);
  };

  const updateType = (id, type) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, type, options: type === "Short Answer" || type === "Long Answer" ? [""] : ["Option 1"] }
          : q
      )
    );
  };

  const updateOption = (id, idx, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === idx ? value : opt)),
            }
          : q
      )
    );
  };

  const addOption = (id) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] } : q
      )
    );
  };

  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const renderInputField = (q) => {
    switch (q.type) {
      case "Short Answer":
        return (
          <input
            type="text"
            className="mt-3 w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-outfit"
            placeholder="Short answer text"
          />
        );
      case "Long Answer":
        return (
          <textarea
            className="mt-3 w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-outfit"
            placeholder="Long answer text"
            rows={4}
          />
        );
      case "Multiple Choice":
      case "Check boxes":
      case "Dropdowns":
        return (
          <div className="mt-3 space-y-2 font-outfit">
            {q.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {q.type === "Check boxes" ? (
                  <input type="checkbox" disabled />
                ) : q.type === "Multiple Choice" ? (
                  <input type="radio" disabled />
                ) : null}
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(q.id, idx, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(q.id)}
              className="text-sm text-teal-600 hover:underline"
            >
              + Add option
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white rounded-xl border-gray-600 flex justify-center py-8 px-4 font-outfit shadow-lg">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-semibold">Create a Event</h1>
          <h1 className="text-3xl font-semibold">Registration Form</h1>
        </header>

        {/* Event Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 relative mb-6 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-semibold">Event Title</h1>
              <p className="text-sm text-gray-500">Event Description</p>
            </div>
            <IoIosEye className="text-secondary text-xl cursor-pointer" />
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, idx) => (
          <React.Fragment key={q.id}>
            {/* Question box */}
            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 mb-3 relative py-8">
              <BsGripVertical
                size={22}
                className="text-gray-400 cursor-move absolute top-3 left-3"
              />

              <div className="flex items-center gap-3 pl-8">
                {/* Label + Dropdown */}
                <div className="flex flex-col w-full">
                  <p className="text-lg mb-1">Add Question</p>
                  <hr className="border-gray-300 mb-5 md:w-[90%] -ml-2" />
                  <div
                    className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-1 text-sm w-48 bg-white cursor-pointer"
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === q.id ? null : q.id)
                    }
                  >
                    {q.type}
                    <IoIosArrowDown className="text-gray-500" />
                  </div>

                  {/* Render input fields based on type */}
                  {renderInputField(q)}
                </div>

                {/* Right icons */}
                <div className="flex gap-3 ml-auto">
                  <BsImage
                    className="text-teal-500 cursor-pointer"
                    size={18}
                    onClick={() =>
                      setImageUploadFor(imageUploadFor === q.id ? null : q.id)
                    }
                  />
                  <BsTrash
                    className="text-teal-500 cursor-pointer"
                    size={18}
                    onClick={() => deleteQuestion(q.id)}
                  />
                </div>
              </div>

              {/* Dropdown menu */}
              {dropdownOpen === q.id && (
                <div className="absolute top-29 left-10 bg-white border border-gray-200 rounded-md shadow-md w-48 z-10">
                  {dropdownTypes.map((type) => (
                    <div
                      key={type}
                      onClick={() => {
                        updateType(q.id, type);
                        setDropdownOpen(null);
                      }}
                      className="px-3 py-1.5 hover:bg-gray-100 text-sm text-gray-700 cursor-pointer"
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* upload container */}
          {imageUploadFor === q.id && (
  <div className="mt-3">
    <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
      
      <div className="flex items-center">
        {/* Drag Handle */}
        <BsGripVertical
          size={22}
          className="text-gray-400 cursor-move"
        />
        
        {/* Trash Icon aligned to right */}
              <BsTrash
                className="text-teal-500 cursor-pointer ml-auto"
                size={18}
                onClick={() => deleteQuestion(q.id)}
              />
            </div>
            <p className="text-lg font-medium mb-2 mt-2">Add Image</p>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex justify-center items-center text-gray-400 cursor-pointer"
              onClick={() => fileRef.current.click()}
            >
              <FiUploadCloud className="text-4xl" />
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      )}

            {/* Divider with plus */}
            {idx < questions.length - 1 && (
              <div className="flex items-center justify-center mb-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <button
                  className="mx-2 w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 text-sm hover:bg-gray-100"
                  onClick={addQuestion}
                >
                  +
                </button>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Final Add Question button */}
        <div className="flex justify-center mt-4">
          <button
            className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 text-sm hover:bg-gray-100"
            onClick={addQuestion}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
