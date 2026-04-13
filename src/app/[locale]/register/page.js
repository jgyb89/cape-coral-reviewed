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
      backgroundColor: "#fdfdfd", 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "2rem" 
    }}>
      <div style={{ 
        background: "#fff", 
        maxWidth: "600px", 
        width: "100%", 
        padding: "3rem", 
        borderRadius: "12px", 
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)", 
        border: "1px solid #eaeaea" 
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
