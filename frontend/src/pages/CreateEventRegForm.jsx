import React from "react";
import { BsTrash } from "react-icons/bs";
import { IoIosEye } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";

export default function CreateEventRegForm({ formData, setFormData, handleEventChange }) {
  // Create a new empty question object
  const createNewQuestion = () => ({
    question_label: "",
    question_type: "short",
    is_required: false,
    options: [],
    allow_specific_types: false,
    file_types: [],
    max_files: 1,
    max_file_size: 5,
  });

  // Handlers for Registration Form Template
  const handleQuestionChange = (templateIndex, questionIndex, e) => {
    const { name, value, type, checked } = e.target;
    const updatedTemplates = [...formData.reg_form_templates];
    updatedTemplates[templateIndex].questions[questionIndex][name] =
      type === "checkbox" ? checked : value;
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
  };

  const handleAddQuestion = (templateIndex) => {
    const updatedTemplates = [...formData.reg_form_templates];
    updatedTemplates[templateIndex].questions.push(createNewQuestion());
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
  };

  const handleRemoveQuestion = (templateIndex, questionIndex) => {
    const updatedTemplates = [...formData.reg_form_templates];
    updatedTemplates[templateIndex].questions =
      updatedTemplates[templateIndex].questions.filter((_, i) => i !== questionIndex);
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
  };

  const handleOptionChange = (templateIndex, questionIndex, optionIndex, e) => {
    const { value } = e.target;
    const updatedTemplates = [...formData.reg_form_templates];
    updatedTemplates[templateIndex].questions[questionIndex].options[optionIndex].option_value =
      value;
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
  };

  const handleAddOption = (templateIndex, questionIndex) => {
    const updatedTemplates = [...formData.reg_form_templates];
    updatedTemplates[templateIndex].questions[questionIndex].options.push({ option_value: "" });
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
  };

  const handleRemoveOption = (templateIndex, questionIndex, optionIndex) => {
    const updatedTemplates = [...formData.reg_form_templates];
    updatedTemplates[templateIndex].questions[questionIndex].options =
      updatedTemplates[templateIndex].questions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
  };

  const handleFileTypeToggle = (templateIndex, questionIndex, type) => {
    const updatedTemplates = [...formData.reg_form_templates];
    let fileTypes = [...(updatedTemplates[templateIndex].questions[questionIndex].file_types || [])];

    if (fileTypes.includes(type)) {
      fileTypes = fileTypes.filter((t) => t !== type);
    } else {
      fileTypes.push(type);
    }

    updatedTemplates[templateIndex].questions[questionIndex].file_types = fileTypes;
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
  };

  return (
    <>
      <div className="min-h-screen bg-white rounded-xl border-gray-600 flex justify-center py-8 px-4 font-outfit shadow-lg">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl font-semibold">Create a Event</h1>
            <h1 className="text-3xl font-semibold">Registration Form</h1>
          </header>

          {/* Event Header */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 relative mb-6 py-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-semibold">{formData.title || "Event Title"}</h1>
                <p className="text-sm text-gray-500 whitespace-pre-wrap">
                  {formData.description || "Event Description"}
                </p>
              </div>
              <IoIosEye className="text-secondary text-xl cursor-pointer" />
            </div>

            {/* Email */}
            <div className="flex flex-col mt-5 border-t border-gray-300 pt-4 mb-5">
              <label htmlFor="" className="font-outfit text-lg">
                Email
              </label>
              <p className="font-outfit text-sm text-gray-600 font-light mb-3">
                Manage how email addresses are collected and protected.
              </p>

              <div
                className="flex flex-col md:flex-row md:justify-between md:p-6 md:py-5 gap-3 w-full items-start justify-start mt-3 
                shadow-[inset_0_2px_5px_rgba(0,0,0,0.25)] 
                p-3 rounded-lg bg-white"
              >
                <div className="flex flex-row items-start gap-3">
                  <MdOutlineMail className="text-4xl text-secondary" />
                  <div>
                    <p>Collect email address</p>
                    <p className="text-sm text-gray-600 font-light">
                      Respondent email addresses will be collected.
                    </p>
                  </div>
                </div>

                <select
                  name="collect_email"
                  value={formData.collect_email}
                  className="self-center px-5 border mt-2 text-sm rounded-lg border-gray-300 py-2 outline-none cursor-pointer"
                  onChange={handleEventChange}
                >
                  <option value="collect">Collect</option>
                  <option value="do-not-collect">Do not collect</option>
                </select>
              </div>
            </div>

            {/* First Name */}
            <label className="font-outfit text-lg">First Name</label>
            <p className="font-outfit text-sm text-gray-600 font-light mb-3">
              Respondent first name are collected and protected.
            </p>

            {/* Last Name */}
            <label className="font-outfit text-lg">Last Name</label>
            <p className="font-outfit text-sm text-gray-600 font-light mb-3">
              Respondent last name are collected and protected.
            </p>
          </div>

          {/* Dynamic Questions */}
          {formData.reg_form_templates?.map((template, tIndex) => (
            <div key={tIndex} className="w-full flex flex-col items-center">
              {template.questions.map((q, qIndex) => (
                <div
                  key={`${tIndex}-${qIndex}`}
                  className="flex-1 w-full bg-white border-2 border-gray-200 rounded-lg p-3 mb-3 relative py-8"
                >
                  <div className="flex flex-row justify-between mb-3">
                    <input
                      type="text"
                      name="question_label"
                      placeholder="Enter question"
                      value={q.question_label}
                      onChange={(e) => handleQuestionChange(tIndex, qIndex, e)}
                      className="outline-none font-outfit text-base py-1 border-b-1 border-gray-300 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(tIndex, qIndex)}
                      className="ml-2 text-red-500"
                    >
                      <BsTrash className="cursor-pointer" />
                    </button>
                  </div>

                  <select
                    name="question_type"
                    value={q.question_type}
                    onChange={(e) => handleQuestionChange(tIndex, qIndex, e)}
                    className="font-outfit bg-white cursor-pointer border mb-4 border-gray-200 rounded-md p-2 shadow-sm w-50 z-10"
                  >
                    <option value="short">Short answer</option>
                    <option value="long">Long answer</option>
                    <option value="radio">Multiple choice</option>
                    <option value="checkbox">Checkboxes</option>
                    <option value="file-upload">File Upload</option>
                  </select>

                  {/* File Upload Settings (show only if file-upload is selected) */}
                  {q.question_type === "file-upload" && (
                    <div className="flex flex-col gap-4 bg-white shadow-md p-4 rounded-xl mt-3 border border-gray-200">
                      {/* Allow only specific file types */}
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-700 font-medium">Allow only specific file types</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            name="allow_specific_types"
                            checked={q.allow_specific_types}
                            onChange={(e) => handleQuestionChange(tIndex, qIndex, e)}
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
                        </label>
                      </div>

                      {/* File type checkboxes */}
                      {q.allow_specific_types && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {[
                            "Document",
                            "Presentation",
                            "Spreadsheet",
                            "Drawing",
                            "PDF",
                            "Image",
                            "Video",
                            "Audio",
                          ].map((type) => (
                            <label key={type} className="flex items-center gap-2 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                checked={q.file_types?.includes(type)}
                                onChange={() => handleFileTypeToggle(tIndex, qIndex, type)}
                                className="w-4 h-4 cursor-pointer"
                              />
                              {type}
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Max number of files */}
                      <div>
                        <label className="text-sm text-gray-700 font-medium">Maximum number of files</label>
                        <select
                          name="max_files"
                          value={q.max_files}
                          onChange={(e) => handleQuestionChange(tIndex, qIndex, e)}
                          className="w-full mt-1 px-3 py-2 border rounded-lg outline-none shadow-sm cursor-pointer"
                        >
                          <option value="1">1</option>
                          <option value="5">5</option>
                          <option value="10">10</option>
                        </select>
                      </div>

                      {/* Max file size */}
                      <div>
                        <label className="text-sm text-gray-700 font-medium">Maximum file size</label>
                        <select
                          name="max_file_size"
                          value={q.max_file_size}
                          onChange={(e) => handleQuestionChange(tIndex, qIndex, e)}
                          className="w-full mt-1 px-3 py-2 border rounded-lg outline-none shadow-sm cursor-pointer"
                        >
                          <option value="5">5 MB</option>
                          <option value="10">10 MB</option>
                          <option value="50">50 MB</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Radio / Checkbox Options */}
                  {(q.question_type === "radio" || q.question_type === "checkbox") && (
                    <div className="space-y-2">
                      {q.options.map((opt, oIndex) => (
                        <div
                          key={`${tIndex}-${qIndex}-${oIndex}`}
                          className="flex flex-row items-center gap-2 xl:gap-4"
                        >
                          <div
                            className={`h-3 w-3 ${
                              q.question_type === "radio" && "rounded-full"
                            } border-1 border-gray-600`}
                          ></div>
                          <input
                            type="text"
                            value={opt.option_value}
                            onChange={(e) => handleOptionChange(tIndex, qIndex, oIndex, e)}
                            placeholder={`option${oIndex + 1}`}
                            className="border px-2 py-1 rounded flex-1 font-outfit border-gray-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(tIndex, qIndex, oIndex)}
                            className="text-red-500"
                          >
                            <BsTrash />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddOption(tIndex, qIndex)}
                        className="text-sm text-blue-500 cursor-pointer"
                      >
                        + Add Option
                      </button>
                    </div>
                  )}

                  {/* Required Checkbox */}
                  <label className="flex items-center gap-2 mt-5 font-outfit text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_required"
                      checked={q.is_required}
                      onChange={(e) => handleQuestionChange(tIndex, qIndex, e)}
                    />
                    Required
                  </label>
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddQuestion(tIndex)}
                className="w-6 h-6 cursor-pointer rounded-full border border-gray-400 flex items-center justify-center text-gray-500 text-sm hover:bg-gray-100"
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
