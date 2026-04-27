"use client";

import { useState } from "react";
import Image from "next/image";
import { updateUserListing, uploadWPImage, deleteWPMedia } from "@/lib/actions";
import { useRouter } from "next/navigation";
import imageCompression from 'browser-image-compression';

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
    if (!url.hostname.includes('.')) return 'Please enter a valid URL.';
    return '';
  } catch {
    return 'Please enter a valid URL.';
  }
};

const parseExistingHours = (hoursStr) => {
  if (!hoursStr || hoursStr.toLowerCase() === 'closed') return { open: '', openAmPm: 'AM', close: '', closeAmPm: 'PM', closed: true };
  const match = hoursStr.trim().match(/^(\d{1,2}(?::\d{2})?)(?:\s*(AM|PM))?\s*-\s*(\d{1,2}(?::\d{2})?)(?:\s*(AM|PM))?$/i);
  if (match) return { open: match[1], openAmPm: (match[2]||'AM').toUpperCase(), close: match[3], closeAmPm: (match[4]||'PM').toUpperCase(), closed: false };
  return { open: '', openAmPm: 'AM', close: '', closeAmPm: 'PM', closed: false };
};

const smartFormatTime = (value, currentAmPm) => {
  let digits = value.replaceAll(/\D/g, '');
  if (!digits) return { time: '', amPm: currentAmPm };

  let hours = 0;
  let minutes = 0;
  let newAmPm = currentAmPm;

  if (digits.length <= 2) {
    hours = Number.parseInt(digits);
  } else if (digits.length === 3) {
    hours = Number.parseInt(digits.slice(0, 1));
    minutes = Number.parseInt(digits.slice(1, 3));
  } else {
    hours = Number.parseInt(digits.slice(0, 2));
    minutes = Number.parseInt(digits.slice(2, 4));
  }

  hours = Math.min(hours, 23);
  minutes = Math.min(minutes, 59);

  if (hours === 0) {
    hours = 12;
    newAmPm = 'AM';
  } else if (hours === 12) {
    newAmPm = 'PM';
  } else if (hours > 12) {
    hours -= 12;
    newAmPm = 'PM';
  }

  return { time: `${hours}:${minutes.toString().padStart(2, '0')}`, amPm: newAmPm };
};

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: file.type // Force the library to maintain the original MIME type
  };
  
  try {
    const compressedBlob = await imageCompression(file, options);
    
    // CRITICAL FIX: The compression library can return a Blob that loses filename metadata 
    // when passed through a Next.js Server Action. WordPress rejects files without extensions.
    // We must re-wrap the output in a strict File object using the original file's name and type.
    return new File([compressedBlob], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });
    
  } catch (error) {
    console.error("Compression error:", error);
    return file; // Fallback to original file if compression fails
  }
};

export default function EditListingForm({ initialData }) {
  const router = useRouter();
  const [uploadStep, setUploadStep] = useState('idle'); // idle, compressing, uploading_featured, uploading_gallery, saving_data, complete
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Media State
  const [existingFeaturedImage, setExistingFeaturedImage] = useState(initialData.featuredImage?.node || null);
  const [existingGallery, setExistingGallery] = useState(initialData.attachedMedia?.nodes || []);
  const [newFeaturedImage, setNewFeaturedImage] = useState(null);
  const [newGalleryImages, setNewGalleryImages] = useState([]);
  const [mediaToDelete, setMediaToDelete] = useState([]);
  const [fileErrors, setFileErrors] = useState({ featured: "", gallery: "" });
  const [dragState, setDragState] = useState({ featured: false, gallery: false });

  const [socialErrors, setSocialErrors] = useState(
    initialData.listingdata?.socialUrl 
      ? initialData.listingdata.socialUrl.split(',').map(() => '') 
      : ['']
  );

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
    socialUrls: initialData.listingdata?.socialUrl 
      ? initialData.listingdata.socialUrl.split(',').map(s => s.trim()) 
      : [''],
    hoursParams: daysList.reduce((acc, day) => {
      acc[day] = parseExistingHours(initialData.listingdata?.[`hours${day}`]);
      return acc;
    }, {})
  });

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
    setFormData({ ...formData, socialUrls: newUrls });

    const newErrors = [...socialErrors];
    newErrors[index] = validateUrl(value);
    setSocialErrors(newErrors);
  };

  const addSocialUrl = () => {
    setFormData({ ...formData, socialUrls: [...formData.socialUrls, ''] });
    setSocialErrors([...socialErrors, '']);
  };

  const removeSocialUrl = (index) => {
    const newUrls = formData.socialUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, socialUrls: newUrls });

    const newErrors = socialErrors.filter((_, i) => i !== index);
    setSocialErrors(newErrors);
  };

  const handleTimeChange = (day, field, value) => {
    const rawValue = field === 'closed' ? value : (field.includes('AmPm') ? value : value.replaceAll(/[^\d:]/g, '').slice(0, 5));
    const updatedDay = { ...formData.hoursParams[day], [field]: rawValue };
    setFormData({ ...formData, hoursParams: { ...formData.hoursParams, [day]: updatedDay } });
  };

  const handleTimeBlur = (day, field, value) => {
    if (!value) return;
    const isOpen = field === 'open';
    const amPmField = isOpen ? 'openAmPm' : 'closeAmPm';
    const currentAmPm = formData.hoursParams[day][amPmField];

    const { time, amPm } = smartFormatTime(value, currentAmPm);

    const updatedDay = { 
      ...formData.hoursParams[day], 
      [field]: time,
      [amPmField]: amPm 
    };

    setFormData({ ...formData, hoursParams: { ...formData.hoursParams, [day]: updatedDay } });
  };

  // Media Handlers
  const validateFiles = (files) => {
    const errors = [];
    const valid = files.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`"${file.name}" is not a valid format.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`"${file.name}" exceeds 5MB limit.`);
        return false;
      }
      return true;
    });
    return { valid, errors };
  };

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files.length > 0) {
      const { valid, errors } = validateFiles(Array.from(e.target.files));
      if (field === "featured") {
        if (errors.length > 0) setFileErrors(p => ({ ...p, featured: errors[0] }));
        else {
          setFileErrors(p => ({ ...p, featured: "" }));
          setNewFeaturedImage(valid[0]);
          setExistingFeaturedImage(null);
        }
      } else {
        if (errors.length > 0) setFileErrors(p => ({ ...p, gallery: errors.join(" ") }));
        else {
          setFileErrors(p => ({ ...p, gallery: "" }));
          setNewGalleryImages(prev => [...prev, ...valid].slice(0, 10 - existingGallery.length));
        }
      }
    }
    e.target.value = null;
  };

  const handleRemoveExistingFeatured = () => {
    setMediaToDelete(prev => [...prev, existingFeaturedImage.databaseId]);
    setExistingFeaturedImage(null);
  };

  const handleRemoveNewFeatured = () => {
    setNewFeaturedImage(null);
  };

  const handleRemoveExistingGallery = (id) => {
    setMediaToDelete(prev => [...prev, id]);
    setExistingGallery(prev => prev.filter(img => img.databaseId !== id));
  };

  const handleRemoveNewGallery = (index) => {
    setNewGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e, field) => {
    e.preventDefault();
    setDragState(p => ({ ...p, [field]: true }));
  };

  const handleDragLeave = (e, field) => {
    e.preventDefault();
    setDragState(p => ({ ...p, [field]: false }));
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    setDragState(p => ({ ...p, [field]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const { valid, errors } = validateFiles(Array.from(e.dataTransfer.files));
      if (field === "featured") {
        if (errors.length > 0) setFileErrors(p => ({ ...p, featured: errors[0] }));
        else {
          setFileErrors(p => ({ ...p, featured: "" }));
          setNewFeaturedImage(valid[0]);
          setExistingFeaturedImage(null);
        }
      } else {
        if (errors.length > 0) setFileErrors(p => ({ ...p, gallery: errors.join(" ") }));
        else {
          setFileErrors(p => ({ ...p, gallery: "" }));
          setNewGalleryImages(prev => [...prev, ...valid].slice(0, 10 - existingGallery.length));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStep('compressing');

    try {
      // 1. Compression
      let compressedFeatured = null;
      if (newFeaturedImage) {
        compressedFeatured = await compressImage(newFeaturedImage);
      }
      
      const compressedGallery = await Promise.all(
        newGalleryImages.map(file => compressImage(file))
      );

      // 2. Delete Media
      for (const id of mediaToDelete) {
        await deleteWPMedia(id);
      }

      // 3. Upload New Featured Image
      setUploadStep('uploading_featured');
      let featuredImageId = existingFeaturedImage?.databaseId || null;
      if (compressedFeatured) {
        const formData = new FormData();
        formData.append("file", compressedFeatured);
        featuredImageId = await uploadWPImage(formData);
      }

      // 4. Parallel Upload New Gallery Images
      setUploadStep('uploading_gallery');
      if (compressedGallery.length > 0) {
        await Promise.all(compressedGallery.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          return uploadWPImage(formData, initialData.databaseId);
        }));
      }
      
      setUploadStep('saving_data');
      const formattedHours = daysList.reduce((acc, day) => {
        const params = formData.hoursParams[day];
        acc[`hours${day}`] = params.closed ? 'Closed' : `${params.open} ${params.openAmPm} - ${params.close} ${params.closeAmPm}`;
        return acc;
      }, {});

      const payload = {
        title: formData.title,
        content: formData.content,
        featuredImageId: featuredImageId,
        listingdata: {
          addressStreet: formData.addressStreet,
          addressCity: formData.addressCity,
          addressState: formData.addressState,
          addressZipCode: formData.addressZipCode,
          phoneNumber: formData.phoneNumber,
          businessEmail: formData.businessEmail,
          websiteUrl: formData.websiteUrl,
          videoUrl: formData.videoUrl,
          socialUrl: formData.socialUrls.filter(url => url.trim() !== '').join(','),
          ...formattedHours
        }
      };

      const result = await updateUserListing(initialData.databaseId, payload);
      if (result.success) {
        setUploadStep('complete');
        setShowSuccessModal(true);
      } else {
        alert(`Error: ${result.error}`);
        setUploadStep('idle');
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert(`An error occurred: ${error.message}`);
      setUploadStep('idle');
    }
  };

  const stepsInfo = {
    idle: { label: '', icon: '' },
    compressing: { label: '1. Compressing Images...', icon: 'compress' },
    uploading_featured: { label: '2. Uploading Featured Image...', icon: 'upload' },
    uploading_gallery: { label: '3. Uploading Gallery Images...', icon: 'cloud_upload' },
    saving_data: { label: '4. Finalizing Listing Details...', icon: 'save' },
    complete: { label: '5. Complete!', icon: 'check_circle' }
  };

  return (
    <div className="edit-listing-form-container">
      {/* Progress Overlay Modal */}
      {uploadStep !== 'idle' && uploadStep !== 'complete' && (
        <div className="dashboard-modal-overlay" style={{ zIndex: 1000 }}>
          <div className="dashboard-modal-dialog" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#e04c4c', marginBottom: '1.5rem', animation: 'pulse 2s infinite' }}>
              {stepsInfo[uploadStep].icon}
            </div>
            <h3 className="dashboard-modal-title">{stepsInfo[uploadStep].label}</h3>
            <p className="dashboard-modal-text">Please wait while we process your request.</p>
            <div style={{ width: '100%', background: '#f1f5f9', height: '8px', borderRadius: '4px', marginTop: '2rem', overflow: 'hidden' }}>
              <div style={{ 
                width: uploadStep === 'compressing' ? '25%' : uploadStep === 'uploading_featured' ? '50%' : uploadStep === 'uploading_gallery' ? '75%' : '90%',
                background: '#e04c4c',
                height: '100%',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "2.5rem", maxWidth: "800px" }}>
        {/* Section 1: General */}
        <section style={{ display: "grid", gap: "1.5rem", background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "1.5rem", margin: 0 }}>General Information</h2>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <label htmlFor="title" style={{ fontWeight: "600" }}>Business Name</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              style={{ 
                padding: "0.75rem", 
                borderRadius: "8px", 
                border: "1px solid",
                borderColor: titleError ? '#e04c4c' : '#e2e8f0'
              }}
            />
            {titleError && (
              <span style={{ color: '#e04c4c', fontSize: '0.8rem' }}>{titleError}</span>
            )}
          </div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <label htmlFor="content" style={{ fontWeight: "600" }}>Description</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              disabled={isSubmitting}
              style={{ 
                padding: "0.75rem", 
                borderRadius: "8px", 
                border: "1px solid",
                borderColor: descriptionError ? '#e04c4c' : '#e2e8f0',
                fontFamily: "inherit" 
              }}
            />
            {descriptionError && (
              <span style={{ color: '#e04c4c', fontSize: '0.8rem' }}>{descriptionError}</span>
            )}
          </div>
        </section>

        {/* Section 2: Media Management */}
        <section style={{ display: "grid", gap: "1.5rem", background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Media & Gallery</h2>
          
          {/* Featured Image */}
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <label style={{ fontWeight: "600" }}>Featured Image</label>
            <div
              onDragOver={isSubmitting ? undefined : (e) => handleDragOver(e, "featured")}
              onDragLeave={isSubmitting ? undefined : (e) => handleDragLeave(e, "featured")}
              onDrop={isSubmitting ? undefined : (e) => handleDrop(e, "featured")}
              style={{
                border: `2px dashed ${fileErrors.featured ? "#ef4444" : dragState.featured ? "#e04c4c" : "#cbd5e1"}`,
                backgroundColor: dragState.featured ? "#fef2f2" : "#f8fafc",
                padding: "2rem",
                borderRadius: "12px",
                textAlign: "center",
                transition: "all 0.2s ease",
              }}
            >
              {(existingFeaturedImage || newFeaturedImage) ? (
                <div style={{ position: "relative", width: "200px", height: "140px", margin: "0 auto", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                  <Image
                    src={newFeaturedImage ? URL.createObjectURL(newFeaturedImage) : existingFeaturedImage.sourceUrl}
                    alt="Featured Preview"
                    fill
                    unoptimized={!!newFeaturedImage}
                    style={{ objectFit: "cover" }}
                  />
                  {!isSubmitting && (
                    <button
                      type="button"
                      onClick={newFeaturedImage ? handleRemoveNewFeatured : handleRemoveExistingFeatured}
                      style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>close</span>
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", color: "#94a3b8", marginBottom: "0.5rem" }}>add_photo_alternate</span>
                  <p style={{ margin: "0 0 1rem 0", color: "#475569" }}>Drag & drop featured image, or</p>
                  <input type="file" id="featuredImageInput" accept="image/*" onChange={(e) => handleFileChange(e, "featured")} style={{ display: "none" }} disabled={isSubmitting} />
                  <label htmlFor="featuredImageInput" style={{ cursor: isSubmitting ? "not-allowed" : "pointer", backgroundColor: "#fff", border: "1px solid #cbd5e1", padding: "0.5rem 1rem", borderRadius: "6px", color: "#1e293b", fontWeight: 600 }}>Browse Files</label>
                </>
              )}
            </div>
            {fileErrors.featured && <span style={{ color: "#ef4444", fontSize: "0.8rem" }}>{fileErrors.featured}</span>}
          </div>

          {/* Gallery */}
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <label style={{ fontWeight: "600" }}>Gallery Images (Max 10)</label>
            <div
              onDragOver={isSubmitting ? undefined : (e) => handleDragOver(e, "gallery")}
              onDragLeave={isSubmitting ? undefined : (e) => handleDragLeave(e, "gallery")}
              onDrop={isSubmitting ? undefined : (e) => handleDrop(e, "gallery")}
              style={{
                border: `2px dashed ${fileErrors.gallery ? "#ef4444" : dragState.gallery ? "#e04c4c" : "#cbd5e1"}`,
                backgroundColor: dragState.gallery ? "#fef2f2" : "#f8fafc",
                padding: "2rem",
                borderRadius: "12px",
                transition: "all 0.2s ease",
                minHeight: "150px",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {existingGallery.map((img) => (
                  <div key={img.databaseId} style={{ position: "relative", width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                    <Image src={img.sourceUrl} alt="Gallery" fill style={{ objectFit: "cover" }} />
                    {!isSubmitting && (
                      <button type="button" onClick={() => handleRemoveExistingGallery(img.databaseId)} style={{ position: "absolute", top: "0.25rem", right: "0.25rem", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>close</span>
                      </button>
                    )}
                  </div>
                ))}
                {newGalleryImages.map((file, index) => (
                  <div key={index} style={{ position: "relative", width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                    <Image src={URL.createObjectURL(file)} alt="New Gallery" fill unoptimized style={{ objectFit: "cover" }} />
                    {!isSubmitting && (
                      <button type="button" onClick={() => handleRemoveNewGallery(index)} style={{ position: "absolute", top: "0.25rem", right: "0.25rem", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>close</span>
                      </button>
                    )}
                  </div>
                ))}
                {!isSubmitting && (existingGallery.length + newGalleryImages.length) < 10 && (
                  <div style={{ width: "100px", height: "100px", borderRadius: "8px", border: "1px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
                    <input type="file" id="galleryInput" multiple accept="image/*" onChange={(e) => handleFileChange(e, "gallery")} style={{ display: "none" }} />
                    <label htmlFor="galleryInput" style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", color: "#64748b" }}>
                      <span className="material-symbols-outlined">add</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>Add More</span>
                    </label>
                  </div>
                )}
              </div>
              {!(existingGallery.length || newGalleryImages.length) && (
                <div style={{ textAlign: "center", color: "#64748b" }}>
                  <p>Drag & drop gallery images here</p>
                </div>
              )}
            </div>
            {fileErrors.gallery && <span style={{ color: "#ef4444", fontSize: "0.8rem" }}>{fileErrors.gallery}</span>}
          </div>
        </section>

        {/* Section 3: Contact */}
        <section style={{ display: "grid", gap: "1.5rem", background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Contact & Location</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ display: "grid", gap: "0.5rem", gridColumn: "span 2" }}>
              <label htmlFor="addressStreet" style={{ fontWeight: "600" }}>Street Address</label>
              <input type="text" id="addressStreet" name="addressStreet" value={formData.addressStreet} onChange={handleChange} disabled={isSubmitting} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="addressCity" style={{ fontWeight: "600" }}>City</label>
              <input type="text" id="addressCity" name="addressCity" value={formData.addressCity} onChange={handleChange} disabled={isSubmitting} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="addressState" style={{ fontWeight: "600" }}>State</label>
              <input type="text" id="addressState" name="addressState" value={formData.addressState} onChange={handleChange} disabled={isSubmitting} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="addressZipCode" style={{ fontWeight: "600" }}>Zip Code</label>
              <input type="text" id="addressZipCode" name="addressZipCode" value={formData.addressZipCode} onChange={handleChange} disabled={isSubmitting} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="phoneNumber" style={{ fontWeight: "600" }}>Phone Number</label>
              <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={isSubmitting} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="businessEmail" style={{ fontWeight: "600" }}>Business Email</label>
              <input type="email" id="businessEmail" name="businessEmail" value={formData.businessEmail} onChange={handleChange} disabled={isSubmitting} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="websiteUrl" style={{ fontWeight: "600" }}>Website URL</label>
              <input type="url" id="websiteUrl" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} disabled={isSubmitting} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="videoUrl" style={{ fontWeight: "600" }}>Video URL (YouTube/Vimeo)</label>
              <input type="url" id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleChange} disabled={isSubmitting} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            
            <div style={{ display: "grid", gap: "0.5rem", gridColumn: "span 2" }}>
              <label htmlFor="socialUrl-0" style={{ fontWeight: "600" }}>Social Media URLs</label>
              {formData.socialUrls.map((url, index) => (
                <div key={index} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <input
                      type="url"
                      id={`socialUrl-${index}`}
                      value={url}
                      onChange={(e) => handleSocialUrlChange(index, e.target.value)}
                      placeholder="https://..."
                      disabled={isSubmitting}
                      style={{ 
                        flex: 1, 
                        padding: "0.75rem", 
                        borderRadius: "8px", 
                        border: "1px solid",
                        borderColor: socialErrors[index] ? '#e04c4c' : '#e2e8f0'
                      }}
                    />
                    {!isSubmitting && formData.socialUrls.length > 1 && (
                      <button type="button" onClick={() => removeSocialUrl(index)} style={{ background: 'none', border: 'none', color: '#e04c4c', cursor: 'pointer', padding: '0 0.5rem' }} title="Remove link">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    )}
                  </div>
                  {socialErrors[index] && (
                    <span style={{ color: '#e04c4c', fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>
                      {socialErrors[index]}
                    </span>
                  )}
                </div>
              ))}
              {!isSubmitting && (
                <button type="button" onClick={addSocialUrl} style={{ background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem', padding: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>add_circle</span>
                  Add another link
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Section 4: Hours */}
        <section style={{ display: "grid", gap: "1.5rem", background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Business Hours</h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            {daysList.map((day) => (
              <div key={day} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <label htmlFor={`hours-${day}-open`} style={{ fontWeight: "600", marginBottom: 0 }}>{day}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <label htmlFor={`hours-${day}-closed`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', marginRight: '1rem' }}>
                    <input type="checkbox" id={`hours-${day}-closed`} checked={formData.hoursParams[day].closed} onChange={(e) => handleTimeChange(day, 'closed', e.target.checked)} disabled={isSubmitting} />
                    Closed
                  </label>

                  {!formData.hoursParams[day].closed && (
                    <>
                      <input 
                        type="text" 
                        id={`hours-${day}-open`}
                        placeholder="09:00" 
                        value={formData.hoursParams[day].open} 
                        onChange={(e) => handleTimeChange(day, 'open', e.target.value)} 
                        onBlur={(e) => handleTimeBlur(day, 'open', e.target.value)}
                        disabled={isSubmitting}
                        style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #e2e8f0", width: '80px', textAlign: 'center' }} 
                      />
                      <select value={formData.hoursParams[day].openAmPm} onChange={(e) => handleTimeChange(day, 'openAmPm', e.target.value)} disabled={isSubmitting} style={{ width: 'auto', padding: '0.5rem', borderRadius: "8px", border: "1px solid #e2e8f0" }} aria-label={`${day} opening AM/PM`}>
                        <option>AM</option><option>PM</option>
                      </select>
                      <span style={{ color: '#718096', fontSize: '0.9rem' }}>to</span>
                      <input 
                        type="text" 
                        id={`hours-${day}-close`}
                        placeholder="05:00" 
                        value={formData.hoursParams[day].close} 
                        onChange={(e) => handleTimeChange(day, 'close', e.target.value)} 
                        onBlur={(e) => handleTimeBlur(day, 'close', e.target.value)}
                        disabled={isSubmitting}
                        style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #e2e8f0", width: '80px', textAlign: 'center' }} 
                      />
                      <select value={formData.hoursParams[day].closeAmPm} onChange={(e) => handleTimeChange(day, 'closeAmPm', e.target.value)} disabled={isSubmitting} style={{ width: 'auto', padding: '0.5rem', borderRadius: "8px", border: "1px solid #e2e8f0" }} aria-label={`${day} closing AM/PM`}>
                        <option>AM</option><option>PM</option>
                      </select>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: '2rem' }}>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            style={{ padding: "0.75rem 2rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "600", cursor: isSubmitting ? "not-allowed" : "pointer" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || hasErrors}
            className="listing-primary-btn"
            style={{ padding: "0.75rem 2rem", border: "none", opacity: (isSubmitting || hasErrors) ? 0.6 : 1, cursor: (isSubmitting || hasErrors) ? 'not-allowed' : 'pointer' }}
          >
            {isSubmitting ? "Processing..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="dashboard-modal-overlay">
          <div className="dashboard-modal-dialog">
            <div className="material-symbols-outlined dashboard-modal-icon dashboard-modal-icon--success">
              check_circle
            </div>
            <h3 className="dashboard-modal-title">Success!</h3>
            <p className="dashboard-modal-text">
              Your listing has been updated successfully.
            </p>
            <div className="dashboard-modal-actions">
              <button 
                className="dashboard-modal-btn dashboard-modal-btn--primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/dashboard/listings");
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
