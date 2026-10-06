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
  return <main className={styles["auth-login__main"]}>
      {isRecover ? <>
          <RecoverPasswordForm />
          <div className={styles["auth-login__recover-back"]}>
            <Link href={`/login`} className={styles["auth-login__recover-link"]}>
              &larr; Back to Sign In
            </Link>
          </div>
        </> : <>
          <div className={styles["auth-login__header"]}>
            <h1 className={styles["auth-login__title"]}>
              Welcome Back
            </h1>
            <p className={styles["auth-login__subtitle"]}>Sign in to manage your directory listings and reviews.</p>
          </div>

          <LoginForm />

          <div className={styles["auth-login__footer"]}>
            <Link href={`/login?recover=true`} className={styles["auth-login__forgot-link"]}>
              Forgot your password?
            </Link>
            <p className={styles["auth-login__signup-text"]}>
              Don&apos;t have an account?{' '}
              <Link href={`/register`} className={styles["auth-login__signup-link"]}>
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