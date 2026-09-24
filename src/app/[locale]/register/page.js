import styles from "./page.module.css";
// src/app/register/page.js
import RegisterForm from '@/components/auth/RegisterForm';
import { getDictionary } from '@/lib/dictionaries';
export const metadata = {
  title: 'Register | Cape Coral Directory',
  description: 'Create a new account on Cape Coral Directory.'
};
export default async function RegisterPage({
  params
}) {
  const {
    locale
  } = await params;
  const dict = await getDictionary(locale);
  const t = dict?.register || {};
  return <main className={styles["inline-style-1"]}>
      <div className={styles["inline-style-2"]}>
        <h1 className={styles["inline-style-3"]}>
          {t.title || "Create an Account"}
        </h1>
        <p className={styles["inline-style-4"]}>
          {t.subtitle || "Join our community to list your business, leave reviews, and save your favorites."}
        </p>
        <RegisterForm dict={dict} locale={locale} />
      </div>
    </main>;
}