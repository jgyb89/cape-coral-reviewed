// src/components/auth/RegisterForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/actions";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

    const fieldValues = [
      { id: 15, value: formData.firstName },
      { id: 16, value: formData.lastName },
      { id: 3, value: formData.username },
      { id: 13, value: formData.phoneNumber },
      { id: 2, emailValues: { value: formData.email } },
      { id: 4, value: formData.password },
      { id: 17, value: "1" },
    ];

    const mutation = `
      mutation SubmitRegistrationForm($input: SubmitGfFormInput!) {
        submitGfForm(input: $input) {
          errors { 
            message 
          }
          confirmation {
            message
          }
        }
      }
    `;

    try {
      const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: mutation,
          variables: {
            input: {
              id: "1",
              fieldValues,
            }
          },
        }),
      });

      const json = await res.json();
      const gfResponse = json.data?.submitGfForm;

      if (gfResponse?.errors && gfResponse.errors.length > 0) {
        setError(gfResponse.errors[0].message || 'Registration failed. Please check your inputs.');
        setIsLoading(false);
        return;
      }

      // If no errors, the submission was successful. Proceed to login handoff.
      const loginResult = await handleLogin(
        formData.username,
        formData.password,
      );

      if (loginResult.success) {
        router.push("/dashboard");
      } else {
        setError(
          "Registration successful, but login failed. Please try logging in manually.",
        );
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="register-form__group">
        <label className="register-form__label" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className="register-form__input"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="register-form__group">
        <label className="register-form__label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="register-form__input"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="register-form__group">
        <label className="register-form__label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="register-form__input"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="register-form__row">
        <div className="register-form__group">
          <label className="register-form__label" htmlFor="firstName">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className="register-form__input"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="register-form__group">
          <label className="register-form__label" htmlFor="lastName">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className="register-form__input"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="register-form__group">
        <label className="register-form__label" htmlFor="phoneNumber">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          className="register-form__input"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
      </div>

      {error && <p className="register-form__error">{error}</p>}

      <button
        type="submit"
        className="register-form__submit"
        disabled={isLoading}
      >
        {isLoading ? "Registering..." : "Create Account"}
      </button>
    </form>
  );
}
