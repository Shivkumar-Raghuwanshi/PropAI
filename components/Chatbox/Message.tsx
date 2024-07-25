// Import icons from Lucide icon library
import { User, Home, Building, Bed, Users, Bot } from "lucide-react";

// Import custom types
import { MessageType, AccommodationType } from "@/types";

// Import utility function for formatting AI responses
import formatAIResponse from "@/lib/utils";

// Define props interface for Message component
interface MessageProps {
  message: MessageType;
  accommodationType: AccommodationType;
}

// Message component definition
const Message: React.FC<MessageProps> = ({ message, accommodationType }) => {
  // Function to determine the appropriate icon based on accommodation type
  const getAssistantIcon = () => {
    switch (accommodationType) {
      case "home": return <Home size={16} className="text-indigo-600" />;
      case "flat": return <Building size={16} className="text-indigo-600" />;
      case "pg": return <Bed size={16} className="text-indigo-600" />;
      case "hostel": return <Users size={16} className="text-indigo-600" />;
      default: return <Bot size={16} className="text-indigo-600" />;
    }
  };

  return (
    // Container for the message, aligned based on the message role
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
        {/* Avatar container */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          message.role === "user" ? "bg-indigo-600 ml-3" : "bg-indigo-100 mr-3"
        }`}>
          {message.role === "user" ? <User size={20} className="text-white" /> : getAssistantIcon()}
        </div>
        {/* Message bubble */}
        <div className={`p-4 rounded-2xl shadow-md ${
          message.role === "user" ? "bg-indigo-600 text-white" : "bg-white text-gray-800 border border-indigo-200"
        }`}>
          {message.role === "user" ? (
            // User message content
            <p className="text-sm font-medium">{message.content}</p>
          ) : (
            // AI assistant message content, formatted with HTML
            <div
              className="text-sm prose prose-indigo max-w-none"
              dangerouslySetInnerHTML={{ __html: formatAIResponse(message.content) }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;