'use client';

import React from 'react';
import './StepForm.css';

const Step4Media = ({ formData, updateFormData, nextStep, prevStep }) => {
  const handleFileChange = (e, field) => {
    const files = e.target.files;
    if (field === 'featuredImage') {
      updateFormData({ featuredImage: files[0] });
    } else if (field === 'gallery') {
      updateFormData({ gallery: Array.from(files) });
    }
  };

  return (
    <div className="step-form">
      <header className="step-form__header">
        <span className="material-symbols-outlined">perm_media</span>
        <h2>Media & Gallery</h2>
      </header>

      <div className="step-form__group">
        <label className="step-form__label">Featured Image</label>
        <div style={{ border: '2px dashed #ddd', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
          <input
            type="file"
            id="featuredImage"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'featuredImage')}
            style={{ display: 'none' }}
          />
          <label htmlFor="featuredImage" style={{ cursor: 'pointer', color: '#e04c4c', fontWeight: 600 }}>
            {formData.featuredImage ? formData.featuredImage.name : 'Click to upload featured image'}
          </label>
        </div>
      </div>

      <div className="step-form__group">
        <label className="step-form__label">Gallery Images</label>
        <div style={{ border: '2px dashed #ddd', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
          <input
            type="file"
            id="gallery"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, 'gallery')}
            style={{ display: 'none' }}
          />
          <label htmlFor="gallery" style={{ cursor: 'pointer', color: '#e04c4c', fontWeight: 600 }}>
            {formData.gallery && formData.gallery.length > 0 
              ? `${formData.gallery.length} images selected` 
              : 'Click to upload multiple gallery images'}
          </label>
        </div>
      </div>

      <div className="step-form__group">
        <label className="step-form__label">Video URL (YouTube/Vimeo)</label>
        <input
          type="url"
          className="step-form__input"
          placeholder="https://www.youtube.com/watch?v=..."
          value={formData.videoUrl}
          onChange={(e) => updateFormData({ videoUrl: e.target.value })}
        />
      </div>

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

export default Step4Media;
