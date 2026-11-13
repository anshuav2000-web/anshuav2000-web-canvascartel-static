import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PopupOffer } from "@/components/PopupOffer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main key={location.pathname} className="flex-1 page-fade-in">
        {children}
      </main>
      <Footer />
      <PopupOffer />
    </div>
  );
};
