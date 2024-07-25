import { LucideIcon } from "lucide-react";

export type AccommodationType = "home" | "flat" | "pg" | "hostel";

export type MessageType = {
  role: string;
  content: string;
};

export type MessagesType = {
  [key in AccommodationType]: MessageType[];
};

export type AccommodationInfo = {
  type: AccommodationType;
  label: string;
  icon: LucideIcon;
};