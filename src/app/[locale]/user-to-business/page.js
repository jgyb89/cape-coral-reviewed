import { getDictionary } from '@/lib/dictionaries';
import categoriesData from '@/lib/categories-data.json';
import UserToBusinessClient from './UserToBusinessClient';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: `${dict?.userToBusiness?.title || 'Upgrade to Business'} - Rockford Directory`,
    description: dict?.userToBusiness?.subtitle || 'Get more out of Rockford Directory by upgrading your account.'
  };
}

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function UserToBusinessPage({ params }) {
  const { locale } = await params;

  const dict = await getDictionary(locale);

  return (
    <main>
      <UserToBusinessClient dict={dict} categoriesData={categoriesData} />
    </main>
  );
}
