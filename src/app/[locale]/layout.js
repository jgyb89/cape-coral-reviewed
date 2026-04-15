import { Poppins, Open_Sans } from "next/font/google";
import PropTypes from "prop-types";
import "../globals.css";
import "material-symbols/outlined.css";
import Navbar from "@/components/layout/Navbar";
import BugReporter from "@/components/BugReporter";
import { getViewer } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-poppins",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-open-sans",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://capecoralreviewed.com'),
  title: "Cape Coral Reviewed",
  description: "The premier local directory for Cape Coral, Florida.",
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const viewer = await getViewer();

  return (
    <html lang={locale}>
      <body className={`${poppins.variable} ${openSans.variable}`}>
        <Navbar currentUser={viewer} dict={dict} locale={locale} />
        {children}
        <BugReporter />
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
