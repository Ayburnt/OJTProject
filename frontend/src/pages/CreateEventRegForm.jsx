import React from "react";
import { BsTrash } from "react-icons/bs";
import { IoIosArrowDown, IoIosEye, IoIosArrowBack } from "react-icons/io";

export default function CreateEventRegForm({ formData, setFormData }) {
  // Create a new empty question object
  const createNewQuestion = () => ({
    question_label: "",
    question_type: "short",
    is_required: false,
    options: []
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
    updatedTemplates[templateIndex].questions = updatedTemplates[templateIndex].questions.filter(
      (_, i) => i !== questionIndex
    );
    setFormData({ ...formData, reg_form_templates: updatedTemplates });
  };

  const handleOptionChange = (templateIndex, questionIndex, optionIndex, e) => {
    const { value } = e.target;
    const updatedTemplates = [...formData.reg_form_templates];
    updatedTemplates[templateIndex].questions[questionIndex].options[optionIndex].option_value = value;
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
                <h1 className="text-3xl font-semibold">{formData.title || 'Event Title'}</h1>
                <p className="text-sm text-gray-500 whitespace-pre-wrap">{formData.description || 'Event Description'}</p>
              </div>
              <IoIosEye className="text-secondary text-xl cursor-pointer" />
            </div>

            <div className="flex flex-col mt-10">
              <label htmlFor="" className="font-outfit text-base">Email <span className="text-red-500">*</span></label>
              <input type="text" disabled placeholder="Email required" className="outline-none border-1 px-2 rounded border-gray-300 font-outfit text-base py-2" />
            </div>

            <div className="flex flex-col mt-10">
              <label htmlFor="" className="font-outfit text-base">Full Name (FirstName LastName [e.g., Jane Doe]) <span className="text-red-500">*</span></label>
              <input type="text" disabled placeholder="Full Name required" className="outline-none border-1 px-2 rounded border-gray-300 font-outfit text-base py-2" />
            </div>

            <div className="flex flex-col mt-10">
              <label htmlFor="" className="font-outfit text-base">Contact Number<span className="text-red-500">*</span></label>
              <input type="text" disabled placeholder="Contact Number required" className="outline-none border-1 px-2 rounded border-gray-300 font-outfit text-base py-2" />
            </div>
          </div>


          {formData.reg_form_templates?.map((template, tIndex) => (
          <div key={tIndex} className="w-full flex flex-col items-center">

            {template.questions.map((q, qIndex) => (
              <div key={`${tIndex}-${qIndex}`} className="flex-1 w-full bg-white border-2 border-gray-200 rounded-lg p-3 mb-3 relative py-8">
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
                </select>                

                {(q.question_type === "radio" || q.question_type === "checkbox") && (
                  <div className="space-y-2">                    
                    {q.options.map((opt, oIndex) => (
                      <div key={`${tIndex}-${qIndex}-${oIndex}`} className="flex flex-row items-center gap-2 xl:gap-4">
                        <div className={`h-3 w-3 ${q.question_type === 'radio' && 'rounded-full'} border-1 border-gray-600`}> </div>
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
