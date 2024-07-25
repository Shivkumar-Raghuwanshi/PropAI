import Chatbox from "@/components/Chatbox/ChatboxClient";
import ChatInterface from "@/components/Chatbox/ChatInterface";
import React from "react";

const Home = () => {
  return (
    <div className="w-full flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <ChatInterface />
    </div>
  );
};

export default Home;
