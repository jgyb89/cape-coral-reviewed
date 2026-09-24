import styles from "./page.module.css";
import AboutHero from "@/components/about/AboutHero";
import AboutMission from "@/components/about/AboutMission";
import AboutCategories from "@/components/about/AboutCategories";
import AboutAudiences from "@/components/about/AboutAudiences";
import AboutCTA from "@/components/about/AboutCTA";
export const metadata = {
  title: "About Cape Coral Reviewed | Local Business Directory",
  description: "Cape Coral Reviewed is a local review, business directory, and community platform helping residents and visitors discover Cape Coral businesses, restaurants, services, events, and local recommendations."
};
export default function AboutPage() {
  return <main className={styles["inline-style-1"]}>
      <AboutHero />
      <AboutMission />
      <AboutCategories />
      <AboutAudiences />
      <AboutCTA />
    </main>;
}