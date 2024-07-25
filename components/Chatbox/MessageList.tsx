// Import UI components and types
import { ScrollArea } from "@/components/ui/scroll-area";
import { AccommodationType, MessageType } from "@/types";
import Message from "@/components/Chatbox/Message";
import WelcomeMessage from "@/components/Chatbox/WelcomeMessage";

// Define props interface for MessageList component
interface MessageListProps {
  messages: MessageType[];
  type: AccommodationType;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

// MessageList component definition
const MessageList: React.FC<MessageListProps> = ({ messages, type, isLoading, messagesEndRef }) => (
  // ScrollArea component for scrollable message list
  <ScrollArea className="h-full pr-4">
    <div className="space-y-6">
      {/* Display welcome message if there are no messages */}
      {messages.length === 0 && <WelcomeMessage type={type} />}

      {/* Map through and render each message */}
      {messages.map((message, index) => (
        <Message key={index} message={message} accommodationType={type} />
      ))}

      {/* Display loading indicator when messages are being fetched */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white p-4 rounded-2xl shadow-md border border-indigo-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      )}

      {/* Display prompt for more questions when there are messages and not loading */}
      {messages.length > 0 && !isLoading && (
        <div className="text-center text-sm text-indigo-600 bg-indigo-50 p-3 rounded-lg">
          <p>Need more information? Feel free to ask another question!</p>
        </div>
      )}

      {/* Ref for scrolling to the bottom of the message list */}
      <div ref={messagesEndRef} />
    </div>
  </ScrollArea>
);

export default MessageList;