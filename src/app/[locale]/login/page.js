import styles from "./page.module.css";
import PropTypes from 'prop-types';
import LoginForm from '@/components/auth/LoginForm';
import RecoverPasswordForm from '@/components/auth/RecoverPasswordForm';
import Link from 'next/link';
export const metadata = {
  title: 'Sign In | Cape Coral Reviewed'
};
export default async function LoginPage({
  searchParams
}) {
  // Safely await searchParams in Next.js 15+
  const resolvedSearchParams = await searchParams;
  const isRecover = resolvedSearchParams?.recover === 'true';
  return <main className={styles["inline-style-1"]}>
      {isRecover ? <>
          <RecoverPasswordForm />
          <div className={styles["inline-style-2"]}>
            <Link href={`/login`} className={styles["inline-style-3"]}>
              &larr; Back to Sign In
            </Link>
          </div>
        </> : <>
          <div className={styles["inline-style-4"]}>
            <h1 className={styles["inline-style-5"]}>
              Welcome Back
            </h1>
            <p className={styles["inline-style-6"]}>Sign in to manage your directory listings and reviews.</p>
          </div>

          <LoginForm />

          <div className={styles["inline-style-7"]}>
            <Link href={`/login?recover=true`} className={styles["inline-style-8"]}>
              Forgot your password?
            </Link>
            <p className={styles["inline-style-9"]}>
              Don&apos;t have an account?{' '}
              <Link href={`/register`} className={styles["inline-style-10"]}>
                Sign Up
              </Link>
            </p>
          </div>
        </>}
    </main>;
}
LoginPage.propTypes = {
  searchParams: PropTypes.object.isRequired
};