'use client';

import React, { useState } from 'react';
import styles from './StepForm.module.css';
import wizardStyles from './ListingWizard.module.css';

const Step4Media = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Max size is 5MB.`);
        return false;
      }
      return true;
    });

    if (field === 'featuredImage') {
      if (validFiles.length > 0) {
        updateFormData({ featuredImage: validFiles[0] });
      }
    } else if (field === 'gallery') {
      updateFormData({ gallery: validFiles });
    }
  };

  const handleNext = () => {
    const newErrors = {};
    if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Must start with http:// or https://';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      nextStep();
    }
  };

  return (
    <div className={styles['step-form']}>
      <header className={styles['step-form__header']}>
        <span className="material-symbols-outlined">perm_media</span>
        <h2>Media & Gallery</h2>
      </header>

      <div className={styles['step-form__group']}>
        <label htmlFor="featuredImage" className={styles['step-form__label']}>Featured Image</label>
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

      <div className={styles['step-form__group']}>
        <label htmlFor="gallery" className={styles['step-form__label']}>Gallery Images</label>
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

      <div className={styles['step-form__group']}>
        <label htmlFor="videoUrl" className={styles['step-form__label']}>Video URL (YouTube/Vimeo)</label>
        <input
          type="url"
          id="videoUrl"
          className={`${styles['step-form__input']} ${errors.videoUrl ? styles['step-form__input--error'] : ''}`}
          placeholder="https://www.youtube.com/watch?v=..."
          value={formData.videoUrl}
          onChange={(e) => updateFormData({ videoUrl: e.target.value })}
        />
        {errors.videoUrl && <span className={styles['step-form__error-message']}>{errors.videoUrl}</span>}
      </div>

      <div className={wizardStyles['wizard__actions']}>
        <button className={`${wizardStyles['wizard__button']} ${wizardStyles['wizard__button--secondary']}`} onClick={prevStep}>
          Back
        </button>
        <button className={`${wizardStyles['wizard__button']} ${wizardStyles['wizard__button--primary']}`} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step4Media;
