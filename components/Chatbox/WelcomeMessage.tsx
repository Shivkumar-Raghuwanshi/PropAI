import { AccommodationType } from "@/types";
import { getAssistantName, getWelcomeMessage } from "@/lib/assistantUtils";

interface WelcomeMessageProps {
  type: AccommodationType;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ type }) => (
  <div className="text-center my-8 bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-lg shadow-md">
    <h3 className="text-2xl font-bold mb-3 text-indigo-800">Welcome to {getAssistantName(type)}!</h3>
    <p className="text-lg text-indigo-700 mb-4">{getWelcomeMessage(type)}</p>
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h4 className="font-semibold text-indigo-600 mb-2">How can I assist you today?</h4>
      <ul className="text-left text-sm text-gray-700 space-y-2 list-disc list-inside">
        <li>Ask about {type} prices in specific areas</li>
        <li>Inquire about amenities and facilities</li>
        <li>Get tips on choosing the right {type}</li>
        <li>Learn about the rental process</li>
      </ul>
    </div>
  </div>
);

export default WelcomeMessage;