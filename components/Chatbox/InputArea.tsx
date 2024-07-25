// Import UI components from local design system
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Import icon from Lucide icon library
import { Send } from "lucide-react";

// Import utility function to get assistant name based on accommodation type
import { getAssistantName } from "@/lib/assistantUtils";

// Import type definition for accommodation types
import { AccommodationType } from "@/types";

// Define props interface for InputArea component
interface InputAreaProps {
  input: string;
  setInput: (input: string) => void;
  handleSend: () => void;
  isLoading: boolean;
  accommodationType: AccommodationType;
}

// InputArea component definition
const InputArea: React.FC<InputAreaProps> = ({ input, setInput, handleSend, isLoading, accommodationType }) => (
    // Container for input area, fixed at bottom of screen
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-100 to-transparent pt-6 pb-4 px-4 input-area">
      <div className="max-w-4xl mx-auto flex items-center">
        {/* Text input field */}
        <Input
          type="text"
          placeholder={`Ask ${getAssistantName(accommodationType)} a question...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-grow mr-3 rounded-full py-3 px-6 bg-white border-2 border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 placeholder-gray-400"
          aria-label={`Ask ${getAssistantName(accommodationType)} a question`}
        />
        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={isLoading}
          className="rounded-full p-4 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 send-button" 
          aria-label="Send message"
        >
          {isLoading ? (
            // Loading spinner when message is being sent
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            // Send icon when not loading
            <Send size={20} className="text-white" />
          )}
        </Button>
      </div>
    </div>
  );
  
export default InputArea;