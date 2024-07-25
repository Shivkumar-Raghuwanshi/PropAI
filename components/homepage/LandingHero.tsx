"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import Typewriter from "typewriter-effect";
import { Button } from "@/components/ui/button";
export const LandingHero = () => {
  const { isSignedIn } = useAuth();
  return (
    <div className="text-[#192339] font-bold py-36 text-center space-x-5">
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl space-y-5 font-extrabold">
        <h1>PropAI For Perfect Accommodation </h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-blue-500">
          <Typewriter
            options={{
              strings: [
                "Chatbot",
                "Find your Home",
                "Find your Flats",
                "Find your PG's",
                "Find your Hostel",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="text-lg md:text-xl font-light text-zinc-600">
        Wherever you want. Whenever you need.
      </div>
      <div className="m-4">
        <Link href={isSignedIn ? "/chatbot" : "/sign-up"}>
          <Button
            variant="premium"
            className="md:text-lg p-4 md:p-6 rounded-full"
          >
            Start Exploring
          </Button>
        </Link>
      </div>

    </div>
  );
};
