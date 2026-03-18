// src/components/dashboard/ProfileForm.js
"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { updateUserProfile } from "@/lib/actions";
import "./ProfileForm.css";

export default function ProfileForm({ viewer }) {
  const [isEditing, setIsEditing] = useState(false);

  // Phone number masking: (XXX) XXX-XXXX
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replaceAll(/\D/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const [formData, setFormData] = useState({
    id: viewer?.id || "",
    firstName: viewer?.firstName || "",
    lastName: viewer?.lastName || "",
    phoneNumber: formatPhoneNumber(viewer?.userData?.phoneNumber || ""),
    websiteUrl: viewer?.userData?.websiteUrl || "",
    emailVisibility: viewer?.userData?.emailVisibility || "everyone",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "phoneNumber") {
      finalValue = formatPhoneNumber(value);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const result = await updateUserProfile(formData);

    if (result.success) {
      setFeedback({
        type: "success",
        message: "Profile Updated Successfully!",
      });
      setIsEditing(false);
    } else {
      setFeedback({
        type: "error",
        message: result.error || "Failed to update profile.",
      });
    }

    setIsSaving(false);
  };

  if (!isEditing) {
    return (
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #eaeaea' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>Personal Information</h3>
          <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>edit</span> Edit Profile
          </button>
        </div>
        
        {feedback && (
          <p
            className={`profile-form__feedback profile-form__feedback--${feedback.type}`}
          >
            {feedback.message}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div><p style={{ margin: '0 0 0.25rem', color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>First Name</p><p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500, color: '#333' }}>{viewer.firstName || 'Not set'}</p></div>
          <div><p style={{ margin: '0 0 0.25rem', color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Name</p><p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500, color: '#333' }}>{viewer.lastName || 'Not set'}</p></div>
          <div><p style={{ margin: '0 0 0.25rem', color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</p><p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500, color: '#333' }}>{viewer.userData?.phoneNumber || 'Not set'}</p></div>
          <div><p style={{ margin: '0 0 0.25rem', color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</p><p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500, color: '#333' }}>{viewer.email} <span style={{fontSize: '0.8rem', fontWeight: 'normal', color: '#888'}}>({viewer.userData?.emailVisibility || 'everyone'})</span></p></div>
          <div style={{ gridColumn: '1 / -1' }}><p style={{ margin: '0 0 0.25rem', color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Website URL</p><p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500, color: '#333' }}>{viewer.userData?.websiteUrl ? <a href={viewer.userData.websiteUrl} target="_blank" rel="noreferrer" style={{color: '#e04a3d'}}>{viewer.userData.websiteUrl}</a> : 'Not set'}</p></div>
        </div>
      </div>
    );
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-form__group">
        <label className="profile-form__label" htmlFor="firstName">
          First Name
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          className="profile-form__input"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="profile-form__group">
        <label className="profile-form__label" htmlFor="lastName">
          Last Name
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          className="profile-form__input"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="profile-form__group">
        <label className="profile-form__label" htmlFor="phoneNumber">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          className="profile-form__input"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="(XXX) XXX-XXXX"
        />
      </div>

      <div className="profile-form__group">
        <label className="profile-form__label" htmlFor="websiteUrl">
          Website URL
        </label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          className="profile-form__input"
          value={formData.websiteUrl}
          onChange={handleChange}
          placeholder="https://example.com"
        />
      </div>

      <div className="profile-form__group">
        <span className="profile-form__label">Email Visibility</span>
        <div className="profile-form__radio-group">
          <label className="profile-form__radio-label">
            <input
              type="radio"
              name="emailVisibility"
              value="everyone"
              checked={formData.emailVisibility === "everyone"}
              onChange={handleChange}
            />
            <span>Everyone</span>
          </label>
          <label className="profile-form__radio-label">
            <input
              type="radio"
              name="emailVisibility"
              value="logged_in"
              checked={formData.emailVisibility === "logged_in"}
              onChange={handleChange}
            />
            <span>Logged In Users</span>
          </label>
          <label className="profile-form__radio-label">
            <input
              type="radio"
              name="emailVisibility"
              value="hidden"
              checked={formData.emailVisibility === "hidden"}
              onChange={handleChange}
            />
            <span>Hidden</span>
          </label>
        </div>
      </div>

      {feedback && (
        <p
          className={`profile-form__feedback profile-form__feedback--${feedback.type}`}
        >
          {feedback.message}
        </p>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          type="submit"
          className="profile-form__submit"
          disabled={isSaving}
          style={{ flex: 1 }}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="profile-form__submit"
          style={{ flex: 1, backgroundColor: '#bdbdbd' }}
          disabled={isSaving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

ProfileForm.propTypes = {
  viewer: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    userData: PropTypes.shape({
      phoneNumber: PropTypes.string,
      websiteUrl: PropTypes.string,
      emailVisibility: PropTypes.string,
    }),
  }),
};
