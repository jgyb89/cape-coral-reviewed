import { Poppins, Open_Sans } from "next/font/google";
import PropTypes from "prop-types";
import "./globals.css";
import 'material-symbols/outlined.css';

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${openSans.variable}`}>
        {children}
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
