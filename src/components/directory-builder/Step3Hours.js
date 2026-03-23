'use client';

import React from 'react';
import './StepForm.css';

const Step3Hours = ({ formData, updateFormData, nextStep, prevStep }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleHoursChange = (day, value) => {
    const newHours = { ...formData.hours, [day]: value };
    updateFormData({ hours: newHours });
  };

  const handleToggle247 = (e) => {
    updateFormData({ is247: e.target.checked });
  };

  return (
    <div className="step-form">
      <header className="step-form__header">
        <span className="material-symbols-outlined">schedule</span>
        <h2>Business Hours</h2>
      </header>

      <div className="step-form__group">
        <label className="step-form__label">Timezone</label>
        <select
          className="step-form__select"
          value={formData.timezone}
          onChange={(e) => updateFormData({ timezone: e.target.value })}
        >
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
        </select>
      </div>

      <div className="step-form__group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          id="is247"
          checked={formData.is247 || false}
          onChange={handleToggle247}
          style={{ width: 'auto' }}
        />
        <label htmlFor="is247" className="step-form__label" style={{ marginBottom: 0 }}>
          Open 24/7
        </label>
      </div>

      {!formData.is247 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {days.map((day) => (
            <div key={day} className="step-form__group" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '1rem' }}>
              <label className="step-form__label" style={{ marginBottom: 0 }}>{day}</label>
              <input
                type="text"
                className="step-form__input"
                placeholder="e.g. 9:00 AM - 5:00 PM"
                value={formData.hours?.[day] || ''}
                onChange={(e) => handleHoursChange(day, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="wizard__actions">
        <button className="wizard__button wizard__button--secondary" onClick={prevStep}>
          Back
        </button>
        <button className="wizard__button wizard__button--primary" onClick={nextStep}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step3Hours;
