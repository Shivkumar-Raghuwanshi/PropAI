// Import necessary React hooks and UI components
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import custom types and utility functions
import { AccommodationType, MessageType, MessagesType, AccommodationInfo } from "@/types";
import { accommodationTypes, getAssistantName } from "@/lib/assistantUtils";

// Define interface for Conversation object
interface Conversation {
  id: string;
  accommodationType: AccommodationType;
  updatedAt: string;
  messages: MessageType[];
}

// Define props interface for Sidebar component
interface SidebarProps {
  setAccommodationType: (type: AccommodationType) => void;
  setMessages: React.Dispatch<React.SetStateAction<MessagesType>>;
}

// Sidebar component definition
const Sidebar: React.FC<SidebarProps> = ({ setAccommodationType, setMessages }) => {
  // State for storing conversations and new accommodation type
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newAccommodationType, setNewAccommodationType] = useState<AccommodationType>("home");

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Function to fetch recent conversations from the API
  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations/recent');
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Function to handle creating a new conversation
  const handleNewConversation = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ content: 'Hello', role: 'user' }],
          accommodationType: newAccommodationType,
        }),
      });
      if (!response.ok) throw new Error('Failed to create new conversation');
      const data = await response.json();
      // Add new conversation to the list and update state
      setConversations([data, ...conversations]);
      setAccommodationType(newAccommodationType);
      setMessages(prevMessages => ({
        ...prevMessages,
        [newAccommodationType]: data.messages
      }));
    } catch (error) {
      console.error('Error creating new conversation:', error);
    }
  };

  // Function to handle deleting a conversation
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete conversation');
      // Remove deleted conversation from the list
      setConversations(conversations.filter(conv => conv.id !== id));
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  // Function to handle selecting and loading a conversation
  const handleSelectConversation = async (conversation: Conversation) => {
    try {
      // Fetch the full conversation from the server
      const response = await fetch(`/api/conversations/${conversation.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      const fullConversation = await response.json();
  
      // Update the accommodation type and messages in the parent component
      setAccommodationType(fullConversation.accommodationType);
      setMessages(prevMessages => ({
        ...prevMessages,
        [fullConversation.accommodationType]: fullConversation.messages
      }));
    } catch (error) {
      console.error('Error fetching full conversation:', error);
    }
  };

  return (
    <div className="w-80 h-screen bg-gray-900 text-white p-4 flex flex-col">
      {/* Accommodation type selector */}
      <div className="mb-4">
        <Select onValueChange={(value: AccommodationType) => setNewAccommodationType(value)} defaultValue={newAccommodationType}>
          <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Select accommodation type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            {accommodationTypes.map((type: AccommodationInfo) => (
              <SelectItem key={type.type} value={type.type} className="hover:bg-gray-700">
                <div className="flex items-center">
                  <type.icon size={16} className="mr-2" />
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* New conversation button */}
      <Button 
        onClick={handleNewConversation}
        className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> New Conversation
      </Button>
      
      {/* Scrollable area for conversation list */}
      <ScrollArea className="flex-grow">
        {conversations.map(conversation => {
          // Find the accommodation type icon
          const accommodationType = accommodationTypes.find(type => type.type === conversation.accommodationType);
          const IconComponent = accommodationType?.icon;
          return (
            <div key={conversation.id} className="mb-2 flex items-center">
              {/* Conversation button */}
              <Button
                variant="ghost"
                className="flex-grow justify-start text-white hover:bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 mr-2"
                onClick={() => handleSelectConversation(conversation)}
              >
                {IconComponent && <IconComponent className="mr-2 h-4 w-4 flex-shrink-0" />}
                <span className="text-left truncate">
                  {getAssistantName(conversation.accommodationType)}
                  <br />
                  <small className="text-gray-400">
                    {/* Display truncated last message */}
                    {conversation.messages[conversation.messages.length - 1]?.content.substring(0, 30)}...
                  </small>
                </span>
              </Button>
              {/* Delete conversation button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(conversation.id)}
                className="flex-shrink-0 text-gray-400 hover:text-white hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default Sidebar;