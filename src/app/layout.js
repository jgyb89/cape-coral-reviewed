import { Poppins, Open_Sans } from "next/font/google";
import PropTypes from "prop-types";
import "./globals.css";
import 'material-symbols/outlined.css';
import Navbar from '@/components/layout/Navbar';
import BugReporter from '@/components/BugReporter';
import { getViewer } from '@/lib/auth';

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
  title: "Cape Coral Reviewed",
  description: "The premier local directory for Cape Coral, Florida.",
};

export default async function RootLayout({ children }) {
  const viewer = await getViewer();

  return (
    <html lang="en">
      <body className={`${poppins.variable} ${openSans.variable}`}>
        <Navbar currentUser={viewer} />
        {children}
        <BugReporter />
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
