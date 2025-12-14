import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ResponsiveNav from "@/components/Helper/Navbar/ResponsiveNav";
import Footer from "@/components/Helper/Footer/Footer";
import { RoomProvider } from "@/app/context/RoomContext";


const font = Poppins({
  weight: ['100','200','300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Scenic Cottage",
  description: "Your Travel Destination"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      
        className={`${font.className} antialiased`}
      >
        <RoomProvider>
        <ResponsiveNav />
        {children}
        <Footer />
        </RoomProvider>
        
      </body>
    </html>
  );
}
