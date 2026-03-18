// src/components/auth/LoginModal.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { handleLogin } from "@/lib/actions";
import Link from "next/link";
import "./LoginModal.css";

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    const result = await handleLogin(username, password);

    if (result.success) {
      router.refresh(); // Refresh to update server-side auth state
      onClose();
    } else {
      setError(result.error || "Invalid username or password.");
    }

    setIsUpdating(false);
  };

  return (
    <div className="login-modal-overlay">
      <button
        className="login-modal-overlay__btn"
        onClick={onClose}
        aria-label="Close modal"
        type="button"
      />
      <dialog
        className="login-modal"
        open
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <button
          className="login-modal__close"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 id="login-modal-title" className="login-modal__title">
          Make a free account!
        </h2>
        <p className="login-modal__subtitle">
          Sign up for free in order to share, favorite, or leave reviews! This
          ensures we keep the site spam-free and a better experience for
          everyone!
        </p>

        {error && <div className="login-modal__error">{error}</div>}

        <form className="login-modal__form" onSubmit={handleSubmit}>
          <div className="login-modal__form-group">
            <label className="login-modal__label" htmlFor="modal-username">
              Username or Email
            </label>
            <input
              id="modal-username"
              type="text"
              className="login-modal__input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="login-modal__form-group">
            <label className="login-modal__label" htmlFor="modal-password">
              Password
            </label>
            <input
              id="modal-password"
              type="password"
              className="login-modal__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="login-modal__options">
            <label className="login-modal__remember">
              <input type="checkbox" /> Remember Me
            </label>
            <Link href="/login?recover=true" className="login-modal__forgot">
              Recover Password
            </Link>
          </div>

          <button
            type="submit"
            className="login-modal__submit"
            disabled={isUpdating}
          >
            {isUpdating ? "Logging In..." : "Log In"}
          </button>
        </form>

        <div className="login-modal__footer">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="login-modal__signup-link"
            onClick={onClose}
          >
            Sign Up
          </Link>
        </div>
      </dialog>
    </div>
  );
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
