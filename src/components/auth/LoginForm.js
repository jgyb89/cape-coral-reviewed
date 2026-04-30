// src/components/auth/LoginForm.js
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { handleLogin } from '@/lib/actions';
import styles from './Auth.module.css';

export default function LoginForm() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'en';
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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

    const result = await handleLogin(formData.username, formData.password);

    if (result.success) {
      window.location.href = `/${locale}/dashboard`;
    } else {
      setError(result.error || 'Invalid username or password.');
      setIsLoading(false);
    }
  };

  return (
    <form className={styles['auth-form']} onSubmit={handleSubmit}>
      <div className={styles['auth-form__group']}>
        <label className={styles['auth-form__label']} htmlFor="username">Username or Email</label>
        <input
          id="username"
          name="username"
          type="text"
          className={styles['auth-form__input']}
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username"
        />
      </div>

      <div className={styles['auth-form__group']}>
        <label className={styles['auth-form__label']} htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className={styles['auth-form__input']}
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
      </div>

      {error && <div className={styles['auth-form__error']} dangerouslySetInnerHTML={{ __html: error }} />}

      <button
        type="submit"
        className={styles['auth-form__submit']}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
