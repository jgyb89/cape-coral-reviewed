// src/app/register/page.js
import RegisterForm from '@/components/auth/RegisterForm';
import { getDictionary } from '@/lib/dictionaries';

export const metadata = {
  title: 'Register | Cape Coral Directory',
  description: 'Create a new account on Cape Coral Directory.',
};

export default async function RegisterPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const t = dict?.register || {};

  return (
    <main style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center", 
      padding: "2rem 1rem" 
    }}>
      <div style={{ 
        maxWidth: "600px", 
        width: "100%" 
      }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1rem", textAlign: "center" }}>
          {t.title || "Create an Account"}
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2.5rem", textAlign: "center" }}>
          {t.subtitle || "Join our community to list your business, leave reviews, and save your favorites."}
        </p>
        <RegisterForm dict={dict} locale={locale} />
      </div>
    </main>
  );
}
