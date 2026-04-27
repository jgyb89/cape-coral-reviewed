"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { updateUserListing, uploadWPImage, deleteWPMedia } from "@/lib/actions";
import { useRouter } from "next/navigation";
import imageCompression from 'browser-image-compression';

// --- Constants & Helpers ---
const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const formatContentForTextarea = (html) => {
  if (!html) return '';
  return html
    .replaceAll(/<\/?p>/gi, '\n\n')
    .replaceAll(/<br\s*\/?>/gi, '\n')
    .replaceAll(/<[^>]{1,512}>/g, '')
    .trim();
};

const validateUrl = (value) => {
  if (!value.trim()) return '';
  try {
    const urlString = value.match(/^https?:\/\//i) ? value : `https://${value}`;
    const url = new URL(urlString);
    return url.hostname.includes('.') ? '' : 'Please enter a valid URL.';
  } catch {
    return 'Please enter a valid URL.';
  }
};

const parseExistingHours = (hoursStr) => {
  if (!hoursStr || hoursStr.toLowerCase() === 'closed') {
    return { open: '', openAmPm: 'AM', close: '', closeAmPm: 'PM', closed: true };
  }
  const match = hoursStr.trim().match(/^(\d{1,2}(?::\d{2})?)(?:\s*(AM|PM))?\s*-\s*(\d{1,2}(?::\d{2})?)(?:\s*(AM|PM))?$/i);
  if (match) {
    return { 
      open: match[1], 
      openAmPm: (match[2]||'AM').toUpperCase(), 
      close: match[3], 
      closeAmPm: (match[4]||'PM').toUpperCase(), 
      closed: false 
    };
  }
  return { open: '', openAmPm: 'AM', close: '', closeAmPm: 'PM', closed: false };
};

const smartFormatTime = (value, currentAmPm) => {
  let digits = value.replaceAll(/\D/g, '');
  if (!digits) return { time: '', amPm: currentAmPm };

  let hours = 0, minutes = 0, newAmPm = currentAmPm;
  if (digits.length <= 2) hours = Number.parseInt(digits);
  else if (digits.length === 3) {
    hours = Number.parseInt(digits.slice(0, 1));
    minutes = Number.parseInt(digits.slice(1, 3));
  } else {
    hours = Number.parseInt(digits.slice(0, 2));
    minutes = Number.parseInt(digits.slice(2, 4));
  }

  hours = Math.min(hours, 23);
  minutes = Math.min(minutes, 59);

  if (hours === 0) { hours = 12; newAmPm = 'AM'; }
  else if (hours === 12) newAmPm = 'PM';
  else if (hours > 12) { hours -= 12; newAmPm = 'PM'; }

  return { time: `${hours}:${minutes.toString().padStart(2, '0')}`, amPm: newAmPm };
};

const compressImage = async (file) => {
  const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true, fileType: file.type };
  try {
    const compressedBlob = await imageCompression(file, options);
    return new File([compressedBlob], file.name, { type: file.type, lastModified: Date.now() });
  } catch (error) {
    console.error("Compression error:", error);
    return file;
  }
};

// --- Custom Hook ---
function useEditListingForm(initialData) {
  const router = useRouter();
  const [uploadStep, setUploadStep] = useState('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [existingFeaturedImage, setExistingFeaturedImage] = useState(initialData.featuredImage?.node || null);
  const [existingGallery, setExistingGallery] = useState(initialData.attachedMedia?.nodes || []);
  const [newFeaturedImage, setNewFeaturedImage] = useState(null);
  const [newGalleryImages, setNewGalleryImages] = useState([]);
  const [mediaToDelete, setMediaToDelete] = useState([]);
  const [fileErrors, setFileErrors] = useState({ featured: "", gallery: "" });
  const [dragState, setDragState] = useState({ featured: false, gallery: false });

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    content: formatContentForTextarea(initialData.content),
    addressStreet: initialData.listingdata?.addressStreet || "",
    addressCity: initialData.listingdata?.addressCity || "",
    addressState: initialData.listingdata?.addressState || "",
    addressZipCode: initialData.listingdata?.addressZipCode || "",
    phoneNumber: initialData.listingdata?.phoneNumber || "",
    businessEmail: initialData.listingdata?.businessEmail || "",
    websiteUrl: initialData.listingdata?.websiteUrl || "",
    videoUrl: initialData.listingdata?.videoUrl || "",
    socialUrls: initialData.listingdata?.socialUrl ? initialData.listingdata.socialUrl.split(',').map(s => s.trim()) : [''],
    hoursParams: daysList.reduce((acc, day) => {
      acc[day] = parseExistingHours(initialData.listingdata?.[`hours${day}`]);
      return acc;
    }, {})
  });

  const [socialErrors, setSocialErrors] = useState(formData.socialUrls.map(() => ''));

  const titleError = !formData.title?.trim() ? "Business Name is required." : "";
  const descriptionError = formData.content?.trim().length < 100 ? "Description must be at least 100 characters." : "";
  const isSubmitting = uploadStep !== 'idle';
  const hasErrors = socialErrors.some(err => err !== '') || !!titleError || !!descriptionError;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialUrlChange = (index, value) => {
    const newUrls = [...formData.socialUrls];
    newUrls[index] = value;
    setFormData(prev => ({ ...prev, socialUrls: newUrls }));
    const newErrors = [...socialErrors];
    newErrors[index] = validateUrl(value);
    setSocialErrors(newErrors);
  };

  const handleAddSocialUrl = () => {
    setFormData(prev => ({ ...prev, socialUrls: [...prev.socialUrls, ''] }));
    setSocialErrors(prev => [...prev, '']);
  };

  const handleRemoveSocialUrl = (index) => {
    setFormData(prev => ({ ...prev, socialUrls: prev.socialUrls.filter((_, i) => i !== index) }));
    setSocialErrors(prev => prev.filter((_, i) => i !== index));
  };

  const handleTimeChange = (day, field, value) => {
    const rawValue = field === 'closed' ? value : (field.includes('AmPm') ? value : value.replaceAll(/[^\d:]/g, '').slice(0, 5));
    setFormData(prev => ({
      ...prev,
      hoursParams: { ...prev.hoursParams, [day]: { ...prev.hoursParams[day], [field]: rawValue } }
    }));
  };

  const handleTimeBlur = (day, field, value) => {
    if (!value) return;
    const amPmField = field === 'open' ? 'openAmPm' : 'closeAmPm';
    const { time, amPm } = smartFormatTime(value, formData.hoursParams[day][amPmField]);
    setFormData(prev => ({
      ...prev,
      hoursParams: { ...prev.hoursParams, [day]: { ...prev.hoursParams[day], [field]: time, [amPmField]: amPm } }
    }));
  };

  const handleFileChange = (files, field) => {
    const validFiles = Array.from(files).filter(file => {
      if (!ALLOWED_TYPES.includes(file.type)) return false;
      if (file.size > MAX_FILE_SIZE) return false;
      return true;
    });

    if (field === "featured") {
      if (validFiles.length > 0) {
        setNewFeaturedImage(validFiles[0]);
        setExistingFeaturedImage(null);
      }
    } else {
      setNewGalleryImages(prev => [...prev, ...validFiles].slice(0, 10 - existingGallery.length));
    }
  };

  const handleRemoveFeatured = () => {
    if (existingFeaturedImage) {
      setMediaToDelete(prev => [...prev, existingFeaturedImage.databaseId]);
    }
    setExistingFeaturedImage(null);
    setNewFeaturedImage(null);
  };

  const handleRemoveExistingGallery = (databaseId) => {
    setMediaToDelete(prev => [...prev, databaseId]);
    setExistingGallery(prev => prev.filter(img => img.databaseId !== databaseId));
  };

  const handleRemoveNewGallery = (index) => {
    setNewGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStep('compressing');
    try {
      const compFeatured = newFeaturedImage ? await compressImage(newFeaturedImage) : null;
      const compGallery = await Promise.all(newGalleryImages.map(compressImage));

      for (const id of mediaToDelete) await deleteWPMedia(id);

      setUploadStep('uploading_featured');
      let featuredImageId = existingFeaturedImage?.databaseId || null;
      if (compFeatured) {
        const fd = new FormData(); fd.append("file", compFeatured);
        featuredImageId = await uploadWPImage(fd);
      }

      setUploadStep('uploading_gallery');
      await Promise.all(compGallery.map(file => {
        const fd = new FormData(); fd.append("file", file);
        return uploadWPImage(fd, initialData.databaseId);
      }));

      setUploadStep('saving_data');
      const hours = daysList.reduce((acc, day) => {
        const p = formData.hoursParams[day];
        acc[`hours${day}`] = p.closed ? 'Closed' : `${p.open} ${p.openAmPm} - ${p.close} ${p.closeAmPm}`;
        return acc;
      }, {});

      const payload = {
        title: formData.title, content: formData.content, featuredImageId,
        listingdata: { 
          ...formData, 
          socialUrl: formData.socialUrls.filter(u => u.trim()).join(','),
          ...hours 
        }
      };

      const result = await updateUserListing(initialData.databaseId, payload);
      if (result.success) { setUploadStep('complete'); setShowSuccessModal(true); }
      else { alert(`Error: ${result.error}`); setUploadStep('idle'); }
    } catch (error) {
      console.error(error); alert(`An error occurred: ${error.message}`); setUploadStep('idle');
    }
  };

  return {
    uploadStep, showSuccessModal, setShowSuccessModal, 
    existingFeaturedImage, existingGallery,
    newFeaturedImage, newGalleryImages,
    fileErrors, setFileErrors,
    formData, socialErrors, titleError, descriptionError,
    isSubmitting, hasErrors, router,
    handleChange, handleSocialUrlChange, handleAddSocialUrl, handleRemoveSocialUrl,
    handleTimeChange, handleTimeBlur, handleFileChange, 
    handleRemoveFeatured, handleRemoveExistingGallery, handleRemoveNewGallery,
    handleSubmit
  };
}

// --- Sub-Components ---

const ProgressOverlay = ({ step }) => {
  const stepsInfo = {
    compressing: { label: '1. Compressing Images...', icon: 'compress', progress: '25%' },
    uploading_featured: { label: '2. Uploading Featured Image...', icon: 'upload', progress: '50%' },
    uploading_gallery: { label: '3. Uploading Gallery Images...', icon: 'cloud_upload', progress: '75%' },
    saving_data: { label: '4. Finalizing Listing Details...', icon: 'save', progress: '90%' }
  };
  if (!stepsInfo[step]) return null;
  return (
    <div className="dashboard-modal-overlay" style={{ zIndex: 1000 }}>
      <div className="dashboard-modal-dialog" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#e04c4c', marginBottom: '1.5rem', animation: 'pulse 2s infinite' }}>
          {stepsInfo[step].icon}
        </div>
        <h3 className="dashboard-modal-title">{stepsInfo[step].label}</h3>
        <p className="dashboard-modal-text">Please wait while we process your request.</p>
        <div style={{ width: '100%', background: '#f1f5f9', height: '8px', borderRadius: '4px', marginTop: '2rem', overflow: 'hidden' }}>
          <div style={{ width: stepsInfo[step].progress, background: '#e04c4c', height: '100%', transition: 'width 0.5s ease' }} />
        </div>
      </div>
    </div>
  );
};

const SectionWrapper = ({ title, children }) => (
  <section style={{ display: "grid", gap: "1.5rem", background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
    <h2 style={{ fontSize: "1.5rem", margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const BasicInfoSection = ({ formData, handleChange, titleError, descriptionError, disabled }) => (
  <SectionWrapper title="General Information">
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <label htmlFor="title" style={{ fontWeight: "600" }}>Business Name</label>
      <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required disabled={disabled} style={{ padding: "0.75rem", borderRadius: "8px", border: `1px solid ${titleError ? '#e04c4c' : '#e2e8f0'}` }} />
      {titleError && <span style={{ color: '#e04c4c', fontSize: '0.8rem' }}>{titleError}</span>}
    </div>
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <label htmlFor="content" style={{ fontWeight: "600" }}>Description</label>
      <textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={6} disabled={disabled} style={{ padding: "0.75rem", borderRadius: "8px", border: `1px solid ${descriptionError ? '#e04c4c' : '#e2e8f0'}`, fontFamily: "inherit" }} />
      {descriptionError && <span style={{ color: '#e04c4c', fontSize: '0.8rem' }}>{descriptionError}</span>}
    </div>
  </SectionWrapper>
);

const MediaGallerySection = ({ 
  existingFeatured, newFeatured,
  existingGallery, newGallery,
  handleFileChange, handleRemoveFeatured, handleRemoveExistingGallery, handleRemoveNewGallery,
  disabled 
}) => {
  const [dragState, setDragState] = useState({ featured: false, gallery: false });
  
  const handleDragOver = (e, field) => { e.preventDefault(); setDragState(p => ({ ...p, [field]: true })); };
  const handleDragLeave = (e, field) => { e.preventDefault(); setDragState(p => ({ ...p, [field]: false })); };
  const handleDrop = (e, field) => { 
    e.preventDefault(); 
    setDragState(p => ({ ...p, [field]: false })); 
    handleFileChange(e.dataTransfer.files, field); 
  };

  return (
    <SectionWrapper title="Media & Gallery">
      <div style={{ display: "grid", gap: "0.5rem" }}>
        <label style={{ fontWeight: "600" }}>Featured Image</label>
        <div onDragOver={e => handleDragOver(e, 'featured')} onDragLeave={e => handleDragLeave(e, 'featured')} onDrop={e => handleDrop(e, 'featured')}
          style={{ border: `2px dashed ${dragState.featured ? "#e04c4c" : "#cbd5e1"}`, backgroundColor: dragState.featured ? "#fef2f2" : "#f8fafc", padding: "2rem", borderRadius: "12px", textAlign: "center" }}>
          {(existingFeatured || newFeatured) ? (
            <div style={{ position: "relative", width: "200px", height: "140px", margin: "0 auto", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
              <Image src={newFeatured ? URL.createObjectURL(newFeatured) : existingFeatured.sourceUrl} alt="Featured" fill unoptimized={!!newFeatured} style={{ objectFit: "cover" }} />
              {!disabled && (
                <button type="button" onClick={handleRemoveFeatured} 
                  style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>close</span>
                </button>
              )}
            </div>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", color: "#94a3b8" }}>add_photo_alternate</span>
              <p>Drag & drop featured image, or</p>
              <input type="file" id="fi" accept="image/*" onChange={e => handleFileChange(e.target.files, 'featured')} style={{ display: "none" }} disabled={disabled} />
              <label htmlFor="fi" style={{ cursor: disabled ? "not-allowed" : "pointer", backgroundColor: "#fff", border: "1px solid #cbd5e1", padding: "0.5rem 1rem", borderRadius: "6px" }}>Browse Files</label>
            </>
          )}
        </div>
      </div>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        <label style={{ fontWeight: "600" }}>Gallery Images (Max 10)</label>
        <div onDragOver={e => handleDragOver(e, 'gallery')} onDragLeave={e => handleDragLeave(e, 'gallery')} onDrop={e => handleDrop(e, 'gallery')}
          style={{ border: `2px dashed ${dragState.gallery ? "#e04c4c" : "#cbd5e1"}`, backgroundColor: dragState.gallery ? "#fef2f2" : "#f8fafc", padding: "2rem", borderRadius: "12px", minHeight: "150px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {existingGallery.map(img => (
              <div key={img.databaseId} style={{ position: "relative", width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                <Image src={img.sourceUrl} alt="Gallery" fill style={{ objectFit: "cover" }} />
                {!disabled && (
                  <button type="button" onClick={() => handleRemoveExistingGallery(img.databaseId)}
                    style={{ position: "absolute", top: "0.25rem", right: "0.25rem", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>close</span>
                  </button>
                )}
              </div>
            ))}
            {newGallery.map((file, idx) => (
              <div key={idx} style={{ position: "relative", width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                <Image src={URL.createObjectURL(file)} alt="New" fill unoptimized style={{ objectFit: "cover" }} />
                {!disabled && (
                  <button type="button" onClick={() => handleRemoveNewGallery(idx)}
                    style={{ position: "absolute", top: "0.25rem", right: "0.25rem", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>close</span>
                  </button>
                )}
              </div>
            ))}
            {!disabled && (existingGallery.length + newGallery.length) < 10 && (
              <div style={{ width: "100px", height: "100px", borderRadius: "8px", border: "1px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
                <input type="file" id="gi" multiple accept="image/*" onChange={e => handleFileChange(e.target.files, 'gallery')} style={{ display: "none" }} />
                <label htmlFor="gi" style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", color: "#64748b" }}>
                  <span className="material-symbols-outlined">add</span><span style={{ fontSize: "0.7rem", fontWeight: 600 }}>Add More</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

const LocationSection = ({ 
  formData, handleChange, 
  handleSocialUrlChange, handleAddSocialUrl, handleRemoveSocialUrl,
  socialErrors, disabled 
}) => (
  <SectionWrapper title="Contact & Location">
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
      <div style={{ gridColumn: "span 2", display: "grid", gap: "0.5rem" }}>
        <label>Street Address</label>
        <input type="text" name="addressStreet" value={formData.addressStreet} onChange={handleChange} disabled={disabled} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
      </div>
      {['addressCity', 'addressState', 'addressZipCode', 'phoneNumber', 'businessEmail', 'websiteUrl', 'videoUrl'].map(f => (
        <div key={f} style={{ display: "grid", gap: "0.5rem" }}>
          <label>{f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
          <input type={f.includes('Email') ? 'email' : 'text'} name={f} value={formData[f]} onChange={handleChange} disabled={disabled} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
        </div>
      ))}
      <div style={{ gridColumn: "span 2", display: "grid", gap: "0.5rem" }}>
        <label>Social Media URLs</label>
        {formData.socialUrls.map((url, idx) => (
          <div key={idx} style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="url" value={url} onChange={e => handleSocialUrlChange(idx, e.target.value)} disabled={disabled} style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: `1px solid ${socialErrors[idx] ? '#e04c4c' : '#e2e8f0'}` }} />
              {!disabled && formData.socialUrls.length > 1 && (
                <button type="button" onClick={() => handleRemoveSocialUrl(idx)} style={{ color: '#e04c4c', cursor: 'pointer', border: 'none', background: 'none' }}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
            </div>
            {socialErrors[idx] && <span style={{ color: '#e04c4c', fontSize: '0.8rem' }}>{socialErrors[idx]}</span>}
          </div>
        ))}
        {!disabled && (
          <button type="button" onClick={handleAddSocialUrl} style={{ color: '#4a5568', cursor: 'pointer', border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span className="material-symbols-outlined">add_circle</span>Add Link
          </button>
        )}
      </div>
    </div>
  </SectionWrapper>
);

const HoursSection = ({ hoursParams, handleTimeChange, handleTimeBlur, disabled }) => (
  <SectionWrapper title="Business Hours">
    {daysList.map(day => (
      <div key={day} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <label style={{ fontWeight: "600" }}>{day}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', marginRight: '1rem' }}>
            <input type="checkbox" checked={hoursParams[day].closed} onChange={e => handleTimeChange(day, 'closed', e.target.checked)} disabled={disabled} /> Closed
          </label>
          {!hoursParams[day].closed && <>
            <input type="text" value={hoursParams[day].open} onChange={e => handleTimeChange(day, 'open', e.target.value)} onBlur={e => handleTimeBlur(day, 'open', e.target.value)} disabled={disabled} style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #e2e8f0", width: '80px', textAlign: 'center' }} />
            <select value={hoursParams[day].openAmPm} onChange={e => handleTimeChange(day, 'openAmPm', e.target.value)} disabled={disabled} style={{ padding: '0.5rem', borderRadius: "8px", border: "1px solid #e2e8f0" }}><option>AM</option><option>PM</option></select>
            <span>to</span>
            <input type="text" value={hoursParams[day].close} onChange={e => handleTimeChange(day, 'close', e.target.value)} onBlur={e => handleTimeBlur(day, 'close', e.target.value)} disabled={disabled} style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #e2e8f0", width: '80px', textAlign: 'center' }} />
            <select value={hoursParams[day].closeAmPm} onChange={e => handleTimeChange(day, 'closeAmPm', e.target.value)} disabled={disabled} style={{ padding: '0.5rem', borderRadius: "8px", border: "1px solid #e2e8f0" }}><option>AM</option><option>PM</option></select>
          </>}
        </div>
      </div>
    ))}
  </SectionWrapper>
);

const SuccessModal = ({ onConfirm }) => (
  <div className="dashboard-modal-overlay">
    <div className="dashboard-modal-dialog">
      <div className="material-symbols-outlined dashboard-modal-icon dashboard-modal-icon--success">check_circle</div>
      <h3 className="dashboard-modal-title">Success!</h3>
      <p className="dashboard-modal-text">Your listing has been updated successfully.</p>
      <div className="dashboard-modal-actions">
        <button className="dashboard-modal-btn dashboard-modal-btn--primary" onClick={onConfirm}>OK</button>
      </div>
    </div>
  </div>
);

// --- Main Component ---
export default function EditListingForm({ initialData }) {
  const hook = useEditListingForm(initialData);

  return (
    <div className="edit-listing-form-container">
      <ProgressOverlay step={hook.uploadStep} />
      <form onSubmit={hook.handleSubmit} style={{ display: "grid", gap: "2.5rem", maxWidth: "800px" }}>
        <BasicInfoSection 
          formData={hook.formData} 
          handleChange={hook.handleChange} 
          titleError={hook.titleError} 
          descriptionError={hook.descriptionError} 
          disabled={hook.isSubmitting} 
        />
        <MediaGallerySection 
          existingFeatured={hook.existingFeaturedImage} 
          newFeatured={hook.newFeaturedImage} 
          existingGallery={hook.existingGallery} 
          newGallery={hook.newGalleryImages} 
          handleFileChange={hook.handleFileChange}
          handleRemoveFeatured={hook.handleRemoveFeatured}
          handleRemoveExistingGallery={hook.handleRemoveExistingGallery}
          handleRemoveNewGallery={hook.handleRemoveNewGallery}
          disabled={hook.isSubmitting} 
        />
        <LocationSection 
          formData={hook.formData} 
          handleChange={hook.handleChange} 
          handleSocialUrlChange={hook.handleSocialUrlChange} 
          handleAddSocialUrl={hook.handleAddSocialUrl}
          handleRemoveSocialUrl={hook.handleRemoveSocialUrl}
          socialErrors={hook.socialErrors} 
          disabled={hook.isSubmitting} 
        />
        <HoursSection 
          hoursParams={hook.formData.hoursParams} 
          handleTimeChange={hook.handleTimeChange} 
          handleTimeBlur={hook.handleTimeBlur} 
          disabled={hook.isSubmitting} 
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: '2rem' }}>
          <button type="button" onClick={() => hook.router.back()} disabled={hook.isSubmitting} style={{ padding: "0.75rem 2rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "600" }}>Cancel</button>
          <button type="submit" disabled={hook.isSubmitting || hook.hasErrors} className="listing-primary-btn" style={{ padding: "0.75rem 2rem", border: "none", opacity: (hook.isSubmitting || hook.hasErrors) ? 0.6 : 1 }}>{hook.isSubmitting ? "Processing..." : "Save Changes"}</button>
        </div>
      </form>
      {hook.showSuccessModal && <SuccessModal onConfirm={() => { hook.setShowSuccessModal(false); hook.router.push("/dashboard/listings"); }} />}
    </div>
  );
}
