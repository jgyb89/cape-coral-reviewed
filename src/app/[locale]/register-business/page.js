import styles from "./page.module.css";
import RegisterBusinessForm from '@/components/RegisterBusinessForm';
export default async function RegisterBusinessPage({
  params
}) {
  const {
    locale
  } = await params;
  return <main className={styles["inline-style-1"]}>
      <h1 className={styles["inline-style-2"]}>
        Register Your Business
      </h1>
      <RegisterBusinessForm locale={locale} />
    </main>;
}