'use client';

import { useState } from 'react';
import { requestPasswordReset } from '@/lib/actions';
import styles from './Auth.module.css';

export default function RecoverPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const result = await requestPasswordReset(email);

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Failed to send recovery email. Please check the address and try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles['auth-form']} style={{ textAlign: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#10b981', marginBottom: '1rem' }}>mark_email_read</span>
        <h2 className={styles['auth-form__label']} style={{ fontSize: '1.5rem' }}>Check Your Email</h2>
        <p style={{ color: '#64748b', lineHeight: '1.5' }}>
          If an account exists for <strong>{email}</strong>, we have sent a password reset link. Please check your inbox and spam folder.
        </p>
      </div>
    );
  }

  return (
    <form className={styles['auth-form']} onSubmit={handleSubmit}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#64748b' }}>lock_reset</span>
        <h2 className={styles['auth-form__label']} style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>Recover Password</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Enter your email address to receive a reset link.</p>
      </div>

      <div className={styles['auth-form__group']}>
        <label className={styles['auth-form__label']} htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          className={styles['auth-form__input']}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
      </div>

      {status === 'error' && (
        <div className={styles['auth-form__error']}>{errorMessage}</div>
      )}

      <button
        type="submit"
        className={styles['auth-form__submit']}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
}
