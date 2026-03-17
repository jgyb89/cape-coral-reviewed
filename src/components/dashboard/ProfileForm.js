// src/components/dashboard/ProfileForm.js
'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import { updateUserProfile } from '@/lib/actions';

export default function ProfileForm({ viewer }) {
  const [formData, setFormData] = useState({
    id: viewer?.id || '',
    firstName: viewer?.firstName || '',
    lastName: viewer?.lastName || '',
    phoneNumber: viewer?.phoneNumber || '',
    websiteUrl: viewer?.websiteUrl || '',
    emailVisibility: viewer?.emailVisibility || 'everyone',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const result = await updateUserProfile(formData);

    if (result.success) {
      setFeedback({ type: 'success', message: 'Profile Updated Successfully!' });
    } else {
      setFeedback({ type: 'error', message: result.error || 'Failed to update profile.' });
    }

    setIsSaving(false);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-form__row">
        <div className="profile-form__group">
          <label className="profile-form__label" htmlFor="firstName">First Name</label>
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
          <label className="profile-form__label" htmlFor="lastName">Last Name</label>
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
      </div>

      <div className="profile-form__group">
        <label className="profile-form__label" htmlFor="phoneNumber">Phone Number</label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          className="profile-form__input"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
      </div>

      <div className="profile-form__group">
        <label className="profile-form__label" htmlFor="websiteUrl">Website URL</label>
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
              checked={formData.emailVisibility === 'everyone'}
              onChange={handleChange}
            />
            <span>Everyone</span>
          </label>
          <label className="profile-form__radio-label">
            <input
              type="radio"
              name="emailVisibility"
              value="logged_in"
              checked={formData.emailVisibility === 'logged_in'}
              onChange={handleChange}
            />
            <span>Logged In Users</span>
          </label>
          <label className="profile-form__radio-label">
            <input
              type="radio"
              name="emailVisibility"
              value="hidden"
              checked={formData.emailVisibility === 'hidden'}
              onChange={handleChange}
            />
            <span>Hidden</span>
          </label>
        </div>
      </div>

      {feedback && (
        <p className={`profile-form__feedback profile-form__feedback--${feedback.type}`}>
          {feedback.message}
        </p>
      )}

      <button
        type="submit"
        className="profile-form__submit"
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

ProfileForm.propTypes = {
  viewer: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phoneNumber: PropTypes.string,
    websiteUrl: PropTypes.string,
    emailVisibility: PropTypes.string,
  }),
};
