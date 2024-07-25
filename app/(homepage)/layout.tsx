import { LandingNavbar } from "@/components/homepage/LandingNavbar";
import { ReactNode } from "react";

const LandingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="h-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 overflow-auto">
      <LandingNavbar/>
      <div className="mx-auto max-w-screen-xl h-full">{children}</div>
    </main>
  );
};

export default LandingLayout;