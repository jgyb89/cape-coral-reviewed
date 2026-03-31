'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitListing, uploadWPImage } from '@/lib/actions';
import './StepForm.css';

const Step5Finish = ({ formData, prevStep }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slugify = (text) => {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replaceAll(/&/g, '-and-')         // Replace & with 'and'
      // Use a more standard non-alphanumeric replacement
      .replaceAll(/[^a-z0-9]+/g, '-')     
      .replaceAll(/^-+|-+$/g, '');        // Combined trim for leading/trailing hyphens
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // 1. Upload Featured Image
      let featuredImageId = '';
      if (formData.featuredImage) {
        const fileData = new FormData();
        fileData.append('file', formData.featuredImage);
        featuredImageId = await uploadWPImage(fileData);
      }

      // 2. Upload Gallery Images
      const galleryIds = [];
      if (formData.gallery && formData.gallery.length > 0) {
        for (const file of formData.gallery) {
          const fileData = new FormData();
          fileData.append('file', file);
          const id = await uploadWPImage(fileData);
          if (id) galleryIds.push(id);
        }
      }

      // 3. Map wizard formData to Server Action expected keys
      const submissionData = {
        businessName: formData.title,
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
        priceRange: '', // Optional/Not in wizard yet
        phoneNumber: formData.phone,
        businessEmail: formData.email || '',
        websiteUrl: formData.website || '',
        videoUrl: formData.videoUrl || '',
        socialUrl: formData.socialUrls?.[0] || '',
        hoursMonday: formData.hours?.Monday || '',
        hoursTuesday: formData.hours?.Tuesday || '',
        hoursWednesday: formData.hours?.Wednesday || '',
        hoursThursday: formData.hours?.Thursday || '',
        hoursFriday: formData.hours?.Friday || '',
        hoursSaturday: formData.hours?.Saturday || '',
        hoursSunday: formData.hours?.Sunday || '',
        businessDescription: formData.description,
        streetAddress: formData.address,
        directoryType: formData.category,
        businessTypeCategories: formData.category,
        featuredImage: featuredImageId ? featuredImageId.toString() : '',
        galleryImages: galleryIds.length > 0 ? galleryIds.join(',') : ''
      };

      const result = await submitListing(submissionData);

      if (result.success) {
        const expectedSlug = slugify(submissionData.businessName);
        const directoryTypeSlug = slugify(submissionData.directoryType);
        
        router.push(`/directory/${directoryTypeSlug}/${expectedSlug}`);
      } else {
        alert(`Error: ${result.message}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="step-form">
      <header className="step-form__header">
        <span className="material-symbols-outlined">task_alt</span>
        <h2>Review & Submit</h2>
      </header>

      <div className="step-form__summary" style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>Listing Summary</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.75rem', fontSize: '0.95rem' }}>
          <span style={{ fontWeight: 600 }}>Title:</span>
          <span>{formData.title}</span>
          
          <span style={{ fontWeight: 600 }}>Category:</span>
          <span>{formData.category}</span>
          
          <span style={{ fontWeight: 600 }}>Address:</span>
          <span>{formData.address}, {formData.city} {formData.state} {formData.zipCode}</span>
          
          <span style={{ fontWeight: 600 }}>Phone:</span>
          <span>{formData.phone}</span>
          
          <span style={{ fontWeight: 600 }}>Email:</span>
          <span>{formData.email || 'N/A'}</span>
          
          <span style={{ fontWeight: 600 }}>Website:</span>
          <span>{formData.website || 'N/A'}</span>
        </div>
      </div>

      <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '1.5rem' }}>
        By submitting this listing, you agree to our terms of service and confirm that the information provided is accurate.
      </p>

      <div className="wizard__actions">
        <button 
          className="wizard__button wizard__button--secondary" 
          onClick={prevStep}
          disabled={isSubmitting}
        >
          Back
        </button>
        <button 
          className="wizard__button wizard__button--primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{ backgroundColor: isSubmitting ? '#ccc' : '#e04c4c' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Listing'}
        </button>
      </div>
    </div>
  );
};
export default Step5Finish;

