import Link from 'next/link';

export const metadata = {
  title: 'Check Your Inbox! | Cape Coral Directory',
  description: 'We\'ve sent a verification link to your email address.',
};

export default function CheckEmailPage() {
  return (
    <div className="check-email">
      <div className="check-email__container">
        <h1 className="check-email__title">Check Your Inbox!</h1>
        <p className="check-email__message">
          We've sent a verification link to your email address. Please click the link to activate your account and access your dashboard.
        </p>
        <div className="check-email__actions">
          <Link href="/login" className="check-email__button">
            Go to Login
          </Link>
          <Link href="/" className="check-email__link">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
