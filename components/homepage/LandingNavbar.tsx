"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const font = Montserrat({
  weight: "600",
  subsets: ["latin"],
});
export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4  flex items-center justify-between bg-blue-600">
      <Link href="/" className="flex items-center">
        <h1 className={cn("text-2xl font-bold text-white", font.className)}>PropAI</h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link href={isSignedIn?"/chatbot":"/sign-up"}>
            <Button variant="outline" className="rounded-full">Get Started</Button>
        </Link>

      </div>
    </nav>
  );
};