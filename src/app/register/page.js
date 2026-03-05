// src/app/register/page.js
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Register | Cape Coral Directory',
  description: 'Create a new account on Cape Coral Directory.',
};

export default function RegisterPage() {
  return (
    <div className="register-page">
      <div className="register-page__container">
        <h1 className="register-page__title">Create an Account</h1>
        <p className="register-page__subtitle">
          Join our community to list your business, leave reviews, and save your favorites.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}
