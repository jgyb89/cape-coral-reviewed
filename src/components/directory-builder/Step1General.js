'use client';

import React, { useState } from 'react';
import styles from './StepForm.module.css';
import wizardStyles from './ListingWizard.module.css';

// TEMPORARY MOCK DATA: We will replace this with a WPGraphQL fetch later!
const AVAILABLE_CATEGORIES = [
  'Bar', 'Seafood', 'Medical', 'Dentist', 'Lawn Care', 
  'Plumbing', 'HVAC', 'Roofing', 'Restaurant', 'Cafe',
  'Electrician', 'Cleaning', 'Real Estate', 'Fitness',
  'Automotive', 'Beauty Salon', 'Legal Services'
];

const Step1General = ({ formData, updateFormData, nextStep }) => {
  const [errors, setErrors] = useState({});
  const [catInput, setCatInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Business Name is required';
    if (!formData.category) newErrors.category = 'Directory Type is required';
    if (!formData.categories || formData.categories.length === 0) newErrors.categories = 'At least one category is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Allow adding custom categories via Enter key
  const handleAddCategory = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = catInput.trim();
      if (val && !(formData.categories || []).includes(val)) {
        updateFormData({ categories: [...(formData.categories || []), val] });
      }
      setCatInput('');
      setIsFocused(false);
    }
  };

  // Handle clicking a category from the dropdown suggestion list
  const handleSelectSuggestion = (suggestion) => {
    if (!(formData.categories || []).includes(suggestion)) {
      updateFormData({ categories: [...(formData.categories || []), suggestion] });
    }
    setCatInput('');
    setIsFocused(false);
  };

  const removeCategory = (catToRemove) => {
    updateFormData({ categories: (formData.categories || []).filter(c => c !== catToRemove) });
  };

  const handleNext = () => {
    if (validate()) {
      nextStep();
    }
  };

  // Filter suggestions based on input, ignoring ones already selected
  const filteredSuggestions = AVAILABLE_CATEGORIES.filter(cat => 
    cat.toLowerCase().includes(catInput.toLowerCase()) && 
    !(formData.categories || []).includes(cat)
  );

  return (
    <div className={styles['step-form']}>
      <header className={styles['step-form__header']}>
        <span className="material-symbols-outlined" style={{ color: '#e04c4c' }}>edit</span>
        <h2>General Information</h2>
      </header>

      <div className={styles['step-form__group']}>
        <label htmlFor="title" className={styles['step-form__label']}>
          Business Name <span className={styles['step-form__required']}>*</span>
        </label>
        <input
          type="text"
          id="title"
          className={`${styles['step-form__input']} ${errors.title ? styles['step-form__input--error'] : ''}`}
          placeholder="e.g. Cape Coral Plumbing"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          required
        />
        {errors.title && <span className={styles['step-form__error-message']}>{errors.title}</span>}
      </div>

      {/* Horizontal Radio Buttons for Directory Type */}
      <div className={styles['step-form__group']}>
        <label className={styles['step-form__label']}>
          Directory Type <span className={styles['step-form__required']}>*</span>
        </label>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {['Food & Drink', 'Health & Wellness', 'Home & Local Services'].map(type => (
            <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500, color: '#475569', fontSize: '0.95rem' }}>
              <input
                type="radio"
                name="directoryType"
                value={type}
                checked={formData.category === type}
                onChange={(e) => updateFormData({ category: e.target.value })}
                style={{ width: '1.2rem', height: '1.2rem', accentColor: '#e04c4c', cursor: 'pointer' }}
              />
              {type}
            </label>
          ))}
        </div>
        {errors.category && <span className={styles['step-form__error-message']} style={{ marginTop: '0.5rem', display: 'block' }}>{errors.category}</span>}
      </div>

      {/* Dynamic Tag Input with Auto-Suggest */}
      <div className={styles['step-form__group']}>
        <label className={styles['step-form__label']}>
          Categories <span className={styles['step-form__required']}>*</span>
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {(formData.categories || []).map(cat => (
            <span key={cat} style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #e2e8f0', color: '#334155', fontWeight: 500 }}>
              {cat}
              <button type="button" onClick={() => removeCategory(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, color: '#94a3b8' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
              </button>
            </span>
          ))}
        </div>
        
        {/* Input Wrapper for Absolute Menu Positioning */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className={`${styles['step-form__input']} ${errors.categories ? styles['step-form__input--error'] : ''}`}
            placeholder="Type a category (e.g. Seafood, Plumber)..."
            value={catInput}
            onChange={(e) => {
              setCatInput(e.target.value);
              setIsFocused(true);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Small delay to allow click event on dropdown to fire
            onKeyDown={handleAddCategory}
            style={{ width: '100%' }}
          />
          
          {/* The Dropdown Menu */}
          {isFocused && catInput.trim() && filteredSuggestions.length > 0 && (
            <ul style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)', listStyle: 'none',
              padding: '0.5rem 0', margin: '0.25rem 0 0 0', zIndex: 50,
              maxHeight: '220px', overflowY: 'auto'
            }}>
              {filteredSuggestions.map(suggestion => (
                <li
                  key={suggestion}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevents the input blur from interrupting the click
                    handleSelectSuggestion(suggestion);
                  }}
                  style={{
                    padding: '0.6rem 1rem', cursor: 'pointer',
                    fontSize: '0.95rem', color: '#1e293b', transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onFocus={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onBlur={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Highlight matching text */}
                  <span style={{ fontWeight: 600 }}>{suggestion.slice(0, catInput.length)}</span>
                  <span>{suggestion.slice(catInput.length)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.4rem', display: 'block' }}>Type to search categories, or press Enter to add a custom one.</span>
        {errors.categories && <span className={styles['step-form__error-message']}>{errors.categories}</span>}
      </div>

      <div className={styles['step-form__group']}>
        <label htmlFor="description" className={styles['step-form__label']}>
          Description <span className={styles['step-form__required']}>*</span>
        </label>
        <textarea
          id="description"
          className={`${styles['step-form__textarea']} ${errors.description ? styles['step-form__textarea--error'] : ''}`}
          placeholder="Tell us about your business..."
          rows={5}
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          required
        />
        {errors.description && <span className={styles['step-form__error-message']}>{errors.description}</span>}
      </div>

      <div className={wizardStyles['wizard__actions']}>
        <button className={`${wizardStyles['wizard__button']} ${wizardStyles['wizard__button--primary']}`} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1General;
