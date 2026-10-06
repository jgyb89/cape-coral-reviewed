import styles from "./page.module.css";
import RegisterBusinessForm from '@/components/RegisterBusinessForm';
export default async function RegisterBusinessPage({
  params
}) {
  const {
    locale
  } = await params;
  return <main className={styles["register-business__main"]}>
      <h1 className={styles["register-business__title"]}>
        Register Your Business
      </h1>
      <RegisterBusinessForm locale={locale} />
    </main>;
}