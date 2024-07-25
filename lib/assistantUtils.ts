import { Home, Building, Bed, Users } from "lucide-react";
import { AccommodationType, AccommodationInfo } from "@/types";

export const getAssistantName = (type: AccommodationType): string => {
  switch (type) {
    case "home": return "HomeAdvisor";
    case "flat": return "FlatFinder";
    case "pg": return "PGPal";
    case "hostel": return "HostelHelper";
    default: return "AI Assistant";
  }
};

export const getWelcomeMessage = (type: AccommodationType): string => {
  switch (type) {
    case "home": return "Discover your dream home with personalized recommendations!";
    case "flat": return "Find the perfect flat that suits your lifestyle and budget!";
    case "pg": return "Explore comfortable PG options tailored to your needs!";
    case "hostel": return "Uncover the best hostel experiences for your stay!";
    default: return "Let's find your ideal accommodation together!";
  }
};

export const accommodationTypes: AccommodationInfo[] = [
  { type: "home", label: "Home", icon: Home },
  { type: "flat", label: "Flat", icon: Building },
  { type: "pg", label: "PG", icon: Bed },
  { type: "hostel", label: "Hostel", icon: Users },
];