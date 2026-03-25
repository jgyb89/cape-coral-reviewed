'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerBusiness } from '@/lib/actions';
import './RegisterBusinessForm.css';

export default function RegisterBusinessForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    password: '',
    phone: '',
    website: '',
    consent: false,
    top3Spots: false,
    generateLeads: false,
    facelift: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

<<<<<<< Updated upstream
=======
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

  // Password strength logic
  const checkPasswordStrength = (password) => {
    if (!password) return "";
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) strength++;

    if (strength === 1) return "weak";
    if (strength === 2) return "medium";
    if (strength === 3) return "strong";
    return "weak";
  };

  const validateField = (name, value) => {
    const validations = {
      firstName: (v) => (!v ? "First name is required" : ""),
      lastName: (v) => (!v ? "Last name is required" : ""),
      businessName: (v) => (!v ? "Business name is required" : ""),
      email: (v) => {
        if (!v) return "Email is required";
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return !emailRegex.test(v) ? "Please enter a valid email address" : "";
      },
      password: (v) => {
        if (!v) return "Password is required";
        return checkPasswordStrength(v) === "weak" ? "Password is too weak" : "";
      },
      phone: (v) => {
        if (!v) return "Phone number is required";
        return v.length < 14 ? "Please enter a valid phone number" : "";
      },
      consent: (v) => (!v ? "You must consent to being contacted" : ""),
    };

    return validations[name] ? validations[name](value) : "";
  };

>>>>>>> Stashed changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Map basic fields and ensure IDs are strict integers
    const fieldValues = [
      { id: 15, value: formData.firstName },
      { id: 16, value: formData.lastName },
      { id: 3, value: formData.businessName },
      { id: 13, value: formData.phone },
      { id: 20, value: formData.website },
    ].map(field => ({
      id: parseInt(field.id, 10),
      value: field.value
    }));

    // Fix Email Field (ID 2) to use emailValues as required by GraphQL schema
    fieldValues.push({ 
      id: 2, 
      emailValues: { value: formData.email } 
    });

    // Field 4 is the Password field.
    fieldValues.push({ 
      id: 4, 
      value: formData.password 
    });

    // Field 17 is the Consent checkbox. WPGraphQL expects a single 'value' string.
    // Gravity Forms uses "1" to mark a consent field as checked.
    if (formData.consent) {
      fieldValues.push({ id: 17, value: "1" });
    }

    // Field 19 contains the Marketing interest checkboxes.
    // WPGraphQL expects an array of objects under the 'checkboxValues' key.
    const marketingValues = [];

    if (formData.top3Spots) {
      marketingValues.push({ inputId: 19.1, value: "Do you want to be in the top 3 spots on Google Maps?" });
    }
    if (formData.generateLeads) {
      marketingValues.push({ inputId: 19.2, value: "Does your website generate leads for you?" });
    }
    if (formData.facelift) {
      marketingValues.push({ inputId: 19.3, value: "Could your website use a facelift?" });
    }

    // Only push the field if at least one checkbox was selected
    if (marketingValues.length > 0) {
      fieldValues.push({ id: 19, checkboxValues: marketingValues });
    }

    try {
      const result = await registerBusiness(fieldValues);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Submission Error:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="register-success">
        <h2 className="register-success__title">Success!</h2>
        <p className="register-success__message">Please check your email to activate your account.</p>
      </div>
    );
  }

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="register-form__row">
        <div className="register-form__group">
          <label htmlFor="firstName" className="register-form__label">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className="register-form__input"
            required
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="register-form__group">
          <label htmlFor="lastName" className="register-form__label">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className="register-form__input"
            required
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="register-form__group">
        <label htmlFor="businessName" className="register-form__label">Business Name</label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          className="register-form__input"
          required
          value={formData.businessName}
          onChange={handleChange}
        />
      </div>

      <div className="register-form__group">
        <label htmlFor="email" className="register-form__label">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="register-form__input"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="register-form__group">
        <label htmlFor="password" className="register-form__label">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="register-form__input"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div className="register-form__group">
        <label htmlFor="phone" className="register-form__label">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="register-form__input"
          required
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="register-form__group">
        <label htmlFor="website" className="register-form__label">Website URL</label>
        <input
          id="website"
          name="website"
          type="url"
          className="register-form__input"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      <div className="register-form__checkbox-section">
        <div className="register-form__checkbox-group">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            className="register-form__checkbox"
            required
            checked={formData.consent}
            onChange={handleChange}
          />
          <label htmlFor="consent" className="register-form__checkbox-label">
            I consent to being contacted by Cape Coral Reviewed. (Required)
          </label>
        </div>

        <p className="register-form__marketing-hint">Are you interested in any of these services?</p>
        
        <div className="register-form__checkbox-group">
          <input
            id="top3Spots"
            name="top3Spots"
            type="checkbox"
            className="register-form__checkbox"
            checked={formData.top3Spots}
            onChange={handleChange}
          />
          <label htmlFor="top3Spots" className="register-form__checkbox-label">
            Claim one of the Top 3 Spots in your category
          </label>
        </div>

        <div className="register-form__checkbox-group">
          <input
            id="generateLeads"
            name="generateLeads"
            type="checkbox"
            className="register-form__checkbox"
            checked={formData.generateLeads}
            onChange={handleChange}
          />
          <label htmlFor="generateLeads" className="register-form__checkbox-label">
            Generate more leads
          </label>
        </div>

        <div className="register-form__checkbox-group">
          <input
            id="facelift"
            name="facelift"
            type="checkbox"
            className="register-form__checkbox"
            checked={formData.facelift}
            onChange={handleChange}
          />
          <label htmlFor="facelift" className="register-form__checkbox-label">
            Website or Brand Facelift
          </label>
        </div>
      </div>

      {error && <p className="register-form__error">{error}</p>}

      <button
        type="submit"
        className="register-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Register Business'}
      </button>
    </form>
  );
}
