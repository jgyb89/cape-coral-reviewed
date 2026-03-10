// src/app/login/page.js
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Sign In | Cape Coral Directory',
  description: 'Sign in to your Cape Coral Directory account to manage your profile, favorites, and reviews.',
};

export default function LoginPage({ searchParams }) {
  const isVerified = searchParams?.verified === 'true';

  return (
    <div className="login-page">
      <div className="login-page__container">
        {isVerified && (
          <div className="login-page__banner login-page__banner--success">
            Your email has been verified! You may now sign in.
          </div>
        )}
        <h1 className="login-page__title">Sign In</h1>
        <p className="login-page__subtitle">
          Welcome back! Please enter your credentials to access your dashboard.
        </p>
        
        <LoginForm />
        
        <div className="login-page__footer">
          <p className="login-page__text">
            Don't have an account?{' '}
            <Link href="/register" className="login-page__link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
