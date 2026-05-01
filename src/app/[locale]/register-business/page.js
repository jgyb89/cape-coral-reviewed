import RegisterBusinessForm from '@/components/RegisterBusinessForm';

export default async function RegisterBusinessPage({ params }) {
  const { locale } = await params;
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: '700' }}>
        Register Your Business
      </h1>
      <RegisterBusinessForm locale={locale} />
    </main>
  );
}
