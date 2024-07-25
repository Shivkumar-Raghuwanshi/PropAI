"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AccommodationType, MessagesType } from "@/types";
import { accommodationTypes } from "@/lib/assistantUtils";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import { TutorialGuide } from "./TutorialGuide";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

// Define the props interface for the ChatboxClient component
interface ChatboxClientProps {
  messages: MessagesType[AccommodationType];
  setMessages: (messages: MessagesType[AccommodationType]) => void;
  accommodationType: AccommodationType;
  setAccommodationType: (type: AccommodationType) => void;
}

export default function ChatboxClient({
  messages,
  setMessages,
  accommodationType,
  setAccommodationType,
}: ChatboxClientProps) {
  // State for managing user input and loading status
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref for scrolling to the bottom of the message list
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to handle sending a message
  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;
    
    // Create a new message object
    const newMessage = { role: "user", content: input };
    
    // Update the messages state
    setMessages([...messages, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send the message to the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          accommodationType,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch");
      
      const data = await response.json();
      
      // Update messages with the API response
      if (data.result) {
        setMessages([...messages, newMessage, data.result]);
      } else {
        console.error("No result in response:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto relative min-h-screen flex flex-col">
      {/* Mobile menu trigger */}
      <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-10">
        <Button variant="outline" size="icon" aria-label="Open sidebar">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      
      {/* Tutorial guide component */}
      <TutorialGuide 
        accommodationType={accommodationType} 
        setAccommodationType={setAccommodationType}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 flex-grow flex flex-col">
        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-center text-indigo-800 tracking-tight">
          Find Your Perfect Accommodation
        </h1>

        {/* Tabs for different accommodation types */}
        <Tabs
          value={accommodationType}
          onValueChange={(value: string) => setAccommodationType(value as AccommodationType)}
          className="flex-grow flex flex-col tabs-area"
        >
          <TabsList className="grid w-full grid-cols-4 rounded-full mb-6 h-12">
            {accommodationTypes.map((type) => (
              <TabsTrigger
                key={type.type}
                value={type.type}
                className="flex items-center space-x-2 px-4 py-2 rounded-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                data-type={type.type}
              >
                <type.icon size={16} />
                <span>{type.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Chat area */}
          <div className="flex-grow bg-white rounded-lg shadow-xl overflow-hidden chat-area">
            <TabsContent
              value={accommodationType}
              className="h-[calc(100vh-300px)] md:h-[600px] p-4 overflow-y-auto"
            >
              {/* Message list component */}
              <MessageList
                messages={messages}
                type={accommodationType}
                isLoading={isLoading}
                messagesEndRef={messagesEndRef}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Input area component */}
      <InputArea
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isLoading={isLoading}
        accommodationType={accommodationType}
      />
    </div>
  );
}