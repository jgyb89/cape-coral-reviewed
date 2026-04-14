"use client";

import { useState } from "react";
import { updateUserListing } from "@/lib/actions";
import { useRouter } from "next/navigation";

const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const formatContentForTextarea = (html) => {
  if (!html) return '';
  // Use a more restricted approach or length limit to prevent ReDoS
  return html
    .replaceAll(/<\/?p>/gi, '\n\n')
    .replaceAll(/<br\s*\/?>/gi, '\n')
    .replaceAll(/<[^>]{1,512}>/g, '') // Added length limit to prevent catastrophic backtracking
    .trim();
};

const validateUrl = (value) => {
  if (!value.trim()) return '';
  try {
    const urlString = value.match(/^https?:\/\//i) ? value : `https://${value}`;
    const url = new URL(urlString);
    // Basic check that it has a TLD-like structure (contains at least one dot in hostname)
    if (!url.hostname.includes('.')) return 'Please enter a valid URL.';
    return '';
  } catch {
    // URL parsing fails if the input is not a valid URL. This is an expected validation result.
    return 'Please enter a valid URL.';
  }
};

const parseExistingHours = (hoursStr) => {
  if (!hoursStr || hoursStr.toLowerCase() === 'closed') return { open: '', openAmPm: 'AM', close: '', closeAmPm: 'PM', closed: true };
  // Using a more rigid, non-overlapping pattern for time to avoid backtracking
  const match = hoursStr.trim().match(/^(\d{1,2}(?::\d{2})?)(?:\s*(AM|PM))?\s*-\s*(\d{1,2}(?::\d{2})?)(?:\s*(AM|PM))?$/i);
  if (match) return { open: match[1], openAmPm: (match[2]||'AM').toUpperCase(), close: match[3], closeAmPm: (match[4]||'PM').toUpperCase(), closed: false };
  return { open: '', openAmPm: 'AM', close: '', closeAmPm: 'PM', closed: false }; // Fallback for invalid text
};

const smartFormatTime = (value, currentAmPm) => {
  let digits = value.replaceAll(/\D/g, '');
  if (!digits) return { time: '', amPm: currentAmPm };

  let hours = 0;
  let minutes = 0;
  let newAmPm = currentAmPm;

  // Parse digit groupings
  if (digits.length <= 2) {
    hours = Number.parseInt(digits);
  } else if (digits.length === 3) {
    hours = Number.parseInt(digits.slice(0, 1));
    minutes = Number.parseInt(digits.slice(1, 3));
  } else {
    hours = Number.parseInt(digits.slice(0, 2));
    minutes = Number.parseInt(digits.slice(2, 4));
  }

  // Cap maximums to prevent impossible times like 44:99
  hours = Math.min(hours, 23);
  minutes = Math.min(minutes, 59);

  // Handle Military Time & AM/PM forcing
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

export default function EditListingForm({ initialData }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
    // Allow typing numbers and colons freely
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formattedHours = daysList.reduce((acc, day) => {
      const params = formData.hoursParams[day];
      acc[`hours${day}`] = params.closed ? 'Closed' : `${params.open} ${params.openAmPm} - ${params.close} ${params.closeAmPm}`;
      return acc;
    }, {});

    const payload = {
      title: formData.title,
      content: formData.content,
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

    try {
      const result = await updateUserListing(initialData.databaseId, payload);
      if (result.success) {
        setShowSuccessModal(true);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-listing-form-container">
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

        {/* Section 2: Contact */}
        <section style={{ display: "grid", gap: "1.5rem", background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Contact & Location</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ display: "grid", gap: "0.5rem", gridColumn: "span 2" }}>
              <label htmlFor="addressStreet" style={{ fontWeight: "600" }}>Street Address</label>
              <input type="text" id="addressStreet" name="addressStreet" value={formData.addressStreet} onChange={handleChange} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="addressCity" style={{ fontWeight: "600" }}>City</label>
              <input type="text" id="addressCity" name="addressCity" value={formData.addressCity} onChange={handleChange} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="addressState" style={{ fontWeight: "600" }}>State</label>
              <input type="text" id="addressState" name="addressState" value={formData.addressState} onChange={handleChange} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="addressZipCode" style={{ fontWeight: "600" }}>Zip Code</label>
              <input type="text" id="addressZipCode" name="addressZipCode" value={formData.addressZipCode} onChange={handleChange} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="phoneNumber" style={{ fontWeight: "600" }}>Phone Number</label>
              <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="businessEmail" style={{ fontWeight: "600" }}>Business Email</label>
              <input type="email" id="businessEmail" name="businessEmail" value={formData.businessEmail} onChange={handleChange} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="websiteUrl" style={{ fontWeight: "600" }}>Website URL</label>
              <input type="url" id="websiteUrl" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label htmlFor="videoUrl" style={{ fontWeight: "600" }}>Video URL (YouTube/Vimeo)</label>
              <input type="url" id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleChange} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
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
                      style={{ 
                        flex: 1, 
                        padding: "0.75rem", 
                        borderRadius: "8px", 
                        border: "1px solid",
                        borderColor: socialErrors[index] ? '#e04c4c' : '#e2e8f0'
                      }}
                    />
                    {formData.socialUrls.length > 1 && (
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
              <button type="button" onClick={addSocialUrl} style={{ background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem', padding: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>add_circle</span>
                Add another link
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Hours */}
        <section style={{ display: "grid", gap: "1.5rem", background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Business Hours</h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            {daysList.map((day) => (
              <div key={day} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <label htmlFor={`hours-${day}-open`} style={{ fontWeight: "600", marginBottom: 0 }}>{day}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <label htmlFor={`hours-${day}-closed`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', marginRight: '1rem' }}>
                    <input type="checkbox" id={`hours-${day}-closed`} checked={formData.hoursParams[day].closed} onChange={(e) => handleTimeChange(day, 'closed', e.target.checked)} />
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
                        style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #e2e8f0", width: '80px', textAlign: 'center' }} 
                      />
                      <select value={formData.hoursParams[day].openAmPm} onChange={(e) => handleTimeChange(day, 'openAmPm', e.target.value)} style={{ width: 'auto', padding: '0.5rem', borderRadius: "8px", border: "1px solid #e2e8f0" }} aria-label={`${day} opening AM/PM`}>
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
                        style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #e2e8f0", width: '80px', textAlign: 'center' }} 
                      />
                      <select value={formData.hoursParams[day].closeAmPm} onChange={(e) => handleTimeChange(day, 'closeAmPm', e.target.value)} style={{ width: 'auto', padding: '0.5rem', borderRadius: "8px", border: "1px solid #e2e8f0" }} aria-label={`${day} closing AM/PM`}>
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
            style={{ padding: "0.75rem 2rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "600", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || hasErrors}
            className="listing-primary-btn"
            style={{ padding: "0.75rem 2rem", border: "none", opacity: (isSubmitting || hasErrors) ? 0.6 : 1, cursor: (isSubmitting || hasErrors) ? 'not-allowed' : 'pointer' }}
          >
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
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
