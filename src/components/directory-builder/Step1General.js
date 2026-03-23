'use client';

import React, { useState } from 'react';
import './StepForm.css';

const Step1General = ({ formData, updateFormData, nextStep }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Business Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      nextStep();
    }
  };

  return (
    <div className="step-form">
      <header className="step-form__header">
        <span className="material-symbols-outlined" style={{ color: '#e04c4c' }}>edit</span>
        <h2>General Information</h2>
      </header>

      <div className="step-form__group">
        <label className="step-form__label">
          Business Name <span className="step-form__required">*</span>
        </label>
        <input
          type="text"
          className={`step-form__input ${errors.title ? 'step-form__input--error' : ''}`}
          placeholder="e.g. Cape Coral Plumbing"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
        />
        {errors.title && <span className="step-form__error-message">{errors.title}</span>}
      </div>

      <div className="step-form__group">
        <label className="step-form__label">
          Category <span className="step-form__required">*</span>
        </label>
        <select
          className={`step-form__select ${errors.category ? 'step-form__select--error' : ''}`}
          value={formData.category}
          onChange={(e) => updateFormData({ category: e.target.value })}
        >
          <option value="">Select One</option>
          <option value="Construction">Construction</option>
          <option value="Home Services">Home Services</option>
          <option value="Restaurants">Restaurants</option>
          <option value="Retail">Retail</option>
        </select>
        {errors.category && <span className="step-form__error-message">{errors.category}</span>}
      </div>

      <div className="step-form__group">
        <label className="step-form__label">
          Description <span className="step-form__required">*</span>
        </label>
        <textarea
          className={`step-form__textarea ${errors.description ? 'step-form__textarea--error' : ''}`}
          placeholder="Tell us about your business..."
          rows={5}
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
        />
        {errors.description && <span className="step-form__error-message">{errors.description}</span>}
      </div>

      <div className="wizard__actions">
        <button className="wizard__button wizard__button--primary" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1General;
