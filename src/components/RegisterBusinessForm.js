'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerBusiness } from '@/lib/actions';
import './RegisterBusinessForm.css';

export default function RegisterBusinessForm() {
  const router = useRouter();
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

  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(""); // "", "weak", "medium", "strong"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    let error = "";
    if (name === "firstName") {
      if (!value) error = "First name is required";
    } else if (name === "lastName") {
      if (!value) error = "Last name is required";
    } else if (name === "businessName") {
      if (!value) error = "Business name is required";
    } else if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!value) error = "Email is required";
      else if (!emailRegex.test(value)) error = "Please enter a valid email address";
    } else if (name === "password") {
      if (!value) error = "Password is required";
      else if (checkPasswordStrength(value) === "weak") error = "Password is too weak";
    } else if (name === "phone") {
      if (!value) error = "Phone number is required";
      else if (value.length < 14) error = "Please enter a valid phone number";
    } else if (name === "consent") {
      if (!value) error = "You must consent to being contacted";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;

    if (name === "phone") {
      finalValue = formatPhoneNumber(finalValue);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    // Real-time validation
    const error = validateField(name, finalValue);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(finalValue));
    }
  };

  const isFormValid = () => {
    const requiredFields = ["firstName", "lastName", "businessName", "email", "password", "phone", "consent"];
    const hasRequired = requiredFields.every((field) => formData[field]);
    const hasNoErrors = Object.values(fieldErrors).every((err) => !err);
    const isMediumStrength = passwordStrength === "medium" || passwordStrength === "strong";
    
    return hasRequired && hasNoErrors && isMediumStrength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

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
            className={`register-form__input ${fieldErrors.firstName ? "register-form__input--invalid" : ""}`}
            required
            value={formData.firstName}
            onChange={handleChange}
          />
          {fieldErrors.firstName && <span className="register-form__error-text">{fieldErrors.firstName}</span>}
        </div>
        <div className="register-form__group">
          <label htmlFor="lastName" className="register-form__label">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className={`register-form__input ${fieldErrors.lastName ? "register-form__input--invalid" : ""}`}
            required
            value={formData.lastName}
            onChange={handleChange}
          />
          {fieldErrors.lastName && <span className="register-form__error-text">{fieldErrors.lastName}</span>}
        </div>
      </div>

      <div className="register-form__group">
        <label htmlFor="businessName" className="register-form__label">Business Name</label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          className={`register-form__input ${fieldErrors.businessName ? "register-form__input--invalid" : ""}`}
          required
          value={formData.businessName}
          onChange={handleChange}
        />
        {fieldErrors.businessName && <span className="register-form__error-text">{fieldErrors.businessName}</span>}
      </div>

      <div className="register-form__group">
        <label htmlFor="email" className="register-form__label">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className={`register-form__input ${fieldErrors.email ? "register-form__input--invalid" : ""}`}
          required
          value={formData.email}
          onChange={handleChange}
        />
        {fieldErrors.email && <span className="register-form__error-text">{fieldErrors.email}</span>}
      </div>

      <div className="register-form__group">
        <label htmlFor="password" className="register-form__label">Password</label>
        <div className="register-form__password-wrapper">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            className={`register-form__input ${fieldErrors.password ? "register-form__input--invalid" : ""}`}
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button 
            type="button" 
            className="register-form__toggle-icon" 
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <span className="material-symbols-outlined">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
        {passwordStrength && (
          <>
            <div className="register-form__strength-meter" data-strength={passwordStrength}>
              <div className="register-form__strength-bar"></div>
              <div className="register-form__strength-bar"></div>
              <div className="register-form__strength-bar"></div>
            </div>
            <span className="register-form__strength-text">
              Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
            </span>
          </>
        )}
        {fieldErrors.password && <span className="register-form__error-text">{fieldErrors.password}</span>}
      </div>

      <div className="register-form__group">
        <label htmlFor="phone" className="register-form__label">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className={`register-form__input ${fieldErrors.phone ? "register-form__input--invalid" : ""}`}
          required
          value={formData.phone}
          onChange={handleChange}
          placeholder="(XXX) XXX-XXXX"
        />
        {fieldErrors.phone && <span className="register-form__error-text">{fieldErrors.phone}</span>}
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
        {fieldErrors.consent && <span className="register-form__error-text" style={{ marginBottom: '1.5rem', display: 'block' }}>{fieldErrors.consent}</span>}

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
        disabled={isSubmitting || !isFormValid()}
      >
        {isSubmitting ? 'Submitting...' : 'Register Business'}
      </button>
    </form>
  );
}
