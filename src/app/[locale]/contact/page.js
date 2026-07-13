import ContactLandingClient from './ContactLandingClient';

export const metadata = {
  title: 'Contact Us | Rockford Reviewed',
  description: 'Get in touch with the Rockford Reviewed team. We would love to hear from you regarding partnerships, questions, or general inquiries.',
  keywords: 'contact Rockford Reviewed, reach out, partnerships, local directory support',
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function ContactPage() {

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <ContactLandingClient />
    </main>
  );
}
