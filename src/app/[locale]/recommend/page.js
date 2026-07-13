import RecommendLandingClient from './RecommendLandingClient';

export const metadata = {
  title: 'Recommend a Business | Rockford Reviewed',
  description: 'Know a great local business in Rockford? Recommend them to be added to our premier local directory. Help us spotlight the best businesses with a YouTube feature, newsletter shoutout, and social media promotion.',
  keywords: 'Rockford businesses, recommend a business, Rockford directory, local spotlight, best of Rockford',
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function RecommendPage() {

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <RecommendLandingClient />
    </main>
  );
}
