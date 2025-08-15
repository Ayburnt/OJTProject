import React from "react";
import { BsTrash } from "react-icons/bs";

export default function CreateEventRegForm({ formData, setFormData }) {
  // Create a new empty question object
  const createNewQuestion = () => ({
    question: "",
    question_type: "Short answer",
    required: false,
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
    <div className="space-y-6">
      {formData.reg_form_templates?.map((template, tIndex) => (
        <div key={tIndex} className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold">Registration Form Template {tIndex + 1}</h3>

          {template.questions.map((q, qIndex) => (
            <div key={`${tIndex}-${qIndex}`} className="border p-3 rounded-md space-y-3">
              <div className="flex justify-between">
                <input
                  type="text"
                  name="question"
                  placeholder="Enter question"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(tIndex, qIndex, e)}
                  className="border px-2 py-1 rounded w-full"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(tIndex, qIndex)}
                  className="ml-2 text-red-500"
                >
                  <BsTrash />
                </button>
              </div>

              <select
                name="question_type"
                value={q.question_type}
                onChange={(e) => handleQuestionChange(tIndex, qIndex, e)}
                className="border px-2 py-1 rounded"
              >
                <option value="Short answer">Short answer</option>
                <option value="Multiple choice">Multiple choice</option>
                <option value="Checkboxes">Checkboxes</option>
              </select>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="required"
                  checked={q.required}
                  onChange={(e) => handleQuestionChange(tIndex, qIndex, e)}
                />
                Required
              </label>

              {(q.question_type === "Multiple choice" || q.question_type === "Checkboxes") && (
                <div className="space-y-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={`${tIndex}-${qIndex}-${oIndex}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt.option_value}
                        onChange={(e) => handleOptionChange(tIndex, qIndex, oIndex, e)}
                        placeholder="Option value"
                        className="border px-2 py-1 rounded flex-1"
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
                    className="text-sm text-blue-500"
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => handleAddQuestion(tIndex)}
            className="text-sm text-blue-500"
          >
            + Add Question
          </button>
        </div>
      ))}
    </div>
  );
}
