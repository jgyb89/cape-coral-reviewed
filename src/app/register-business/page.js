import RegisterBusinessForm from '@/components/RegisterBusinessForm';

export default function RegisterBusinessPage() {
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: '700' }}>
        Register Your Business
      </h1>
      <RegisterBusinessForm />
    </main>
  );
}
