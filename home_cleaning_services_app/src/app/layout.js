import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Footer from "@/components/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CleanHive",
  description: "Smart Home Cleaning app",
  icons: {
    icon: "/favicon.png", // path to favicon
  },
};

//main application layout with footer
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
