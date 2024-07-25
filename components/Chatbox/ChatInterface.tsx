"use client"; // Indicates that this is a Client Component in Next.js

import { useState } from "react";
import { AccommodationType, MessagesType } from "@/types";
import Sidebar from "./Sidebar";
import ChatboxClient from "./ChatboxClient";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ChatInterface() {
  // State to manage messages for different accommodation types
  const [messages, setMessages] = useState<MessagesType>({
    home: [],
    flat: [],
    pg: [],
    hostel: [],
  });

  // State to manage the currently selected accommodation type
  const [accommodationType, setAccommodationType] = useState<AccommodationType>("home");

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar - hidden on mobile, visible on medium screens and up */}
      <div className="hidden md:block">
        <Sidebar 
          setAccommodationType={setAccommodationType} 
          setMessages={setMessages} 
        />
      </div>
      
      {/* Mobile Sidebar using Sheet component - for responsive design */}
      <Sheet>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
          {/* Sidebar component within the Sheet for mobile view */}
          <Sidebar 
            setAccommodationType={setAccommodationType} 
            setMessages={setMessages} 
          />
        </SheetContent>
        
        {/* Main content area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* ChatboxClient component - main chat interface */}
          <ChatboxClient 
            messages={messages[accommodationType]}
            setMessages={(newMessages) => setMessages(prev => ({...prev, [accommodationType]: newMessages}))}
            accommodationType={accommodationType}
            setAccommodationType={setAccommodationType}
          />
        </div>
      </Sheet>
    </div>
  );
}