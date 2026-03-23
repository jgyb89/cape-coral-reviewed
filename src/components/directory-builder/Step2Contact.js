'use client';

import React, { useState } from 'react';
import './StepForm.css';

const Step2Contact = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.address?.trim()) newErrors.address = 'Street Address is required';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone Number is required';

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
        <span className="material-symbols-outlined">contact_mail</span>
        <h2>Contact Information</h2>
      </header>

      <div className="step-form__group">
        <label className="step-form__label">
          Address Street <span className="step-form__required">*</span>
        </label>
        <input
          type="text"
          className={`step-form__input ${errors.address ? 'step-form__input--error' : ''}`}
          placeholder="123 Main St"
          value={formData.address}
          onChange={(e) => updateFormData({ address: e.target.value })}
        />
        {errors.address && <span className="step-form__error-message">{errors.address}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="step-form__group">
          <label className="step-form__label">City</label>
          <input
            type="text"
            className="step-form__input"
            placeholder="Cape Coral"
            value={formData.city || ''}
            onChange={(e) => updateFormData({ city: e.target.value })}
          />
        </div>
        <div className="step-form__group">
          <label className="step-form__label">State</label>
          <input
            type="text"
            className="step-form__input"
            placeholder="FL"
            value={formData.state || ''}
            onChange={(e) => updateFormData({ state: e.target.value })}
          />
        </div>
      </div>

      <div className="step-form__group">
        <label className="step-form__label">Zip Code</label>
        <input
          type="text"
          className="step-form__input"
          placeholder="33904"
          value={formData.zipCode || ''}
          onChange={(e) => updateFormData({ zipCode: e.target.value })}
        />
      </div>

      <div className="step-form__group">
        <label className="step-form__label">
          Phone Number <span className="step-form__required">*</span>
        </label>
        <input
          type="tel"
          className={`step-form__input ${errors.phone ? 'step-form__input--error' : ''}`}
          placeholder="(239) 000-0000"
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
        />
        {errors.phone && <span className="step-form__error-message">{errors.phone}</span>}
      </div>

      <div className="step-form__group">
        <label className="step-form__label">Email Address</label>
        <input
          type="email"
          className="step-form__input"
          placeholder="info@business.com"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
        />
      </div>

      <div className="step-form__group">
        <label className="step-form__label">Website URL</label>
        <input
          type="url"
          className="step-form__input"
          placeholder="https://www.business.com"
          value={formData.website}
          onChange={(e) => updateFormData({ website: e.target.value })}
        />
      </div>

      <div className="step-form__group">
        <label className="step-form__label">Social Media URL</label>
        <input
          type="url"
          className="step-form__input"
          placeholder="https://facebook.com/business"
          value={formData.socialUrls?.[0] || ''}
          onChange={(e) => updateFormData({ socialUrls: [e.target.value] })}
        />
      </div>

      <div className="wizard__actions">
        <button className="wizard__button wizard__button--secondary" onClick={prevStep}>
          Back
        </button>
        <button className="wizard__button wizard__button--primary" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2Contact;
