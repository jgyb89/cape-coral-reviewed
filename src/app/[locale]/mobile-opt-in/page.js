import styles from "./page.module.css";
import MobileOptInForm from "@/components/MobileOptInForm";
export const metadata = {
  title: "Mobile Opt-In | Cape Coral Reviewed",
  description: "Sign up for SMS/MMS marketing and account alerts from Cape Coral Reviewed."
};
export default function MobileOptInPage() {
  return <div className={styles["mobile-optin__main"]}>
      <h1 className={styles["mobile-optin__title"]}>Sign Up for Cape Coral Reviewed Text Alerts</h1>
      <p className={styles["mobile-optin__description"]}>
        Stay up-to-date with the latest local news, deals, and exclusive account alerts by opting into our mobile program. Please provide your information below to subscribe.
      </p>
      
      <div className={styles["mobile-optin__form-wrapper"]}>
        <MobileOptInForm />
      </div>
    </div>;
}