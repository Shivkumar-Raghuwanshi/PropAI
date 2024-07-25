import { NextResponse, NextRequest } from 'next/server'
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs';


// Function to generate an answer using the Anthropic API

const generateAnswer = async (question: string, accommodationType: string): Promise<string | null> => {

  try {
    // Get the Anthropic API key from environment variables
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";
    if (!anthropicApiKey) {
      throw new Error("Anthropic API key is not provided.");
    }

        // Initialize the ChatAnthropic client
    const chat = new ChatAnthropic({
      apiKey: anthropicApiKey,
      model: "claude-3-sonnet-20240229",
    });

    // Define system messages for different accommodation types

    const systemMessages = {
      home: `You are HomeAdvisor, an AI assistant developed by Shivkumar Raghuwanshi specializing in helping people find and purchase homes. Your expertise includes:
      1. Types of homes: Single-family, multi-family, townhouses, condos, etc.
      2. Home buying process: Mortgages, down payments, closing costs, inspections
      3. Property evaluation: Location factors, school districts, property taxes
      4. Home features: Square footage, bedrooms, bathrooms, lot size, age of home
      5. Market trends: Property values, appreciation rates, neighborhood development
      6. Legal aspects: Property titles, deed types, homeowners' associations
      7. Home maintenance: Major systems (HVAC, plumbing, electrical), renovations
      8. Financial considerations: Property taxes, insurance, utilities, maintenance costs
      9. First-time homebuyer programs and resources
      10. Long-term investment potential of different properties and areas
    
      Engage in a question-answering dialogue with the user. Keep your responses concise and to the point. Structure your answers using clear lists, bullet points, or headings for easy readability. Ask for clarification if needed, and provide helpful responses based on your expertise. If the user's question is unclear, ask a brief follow-up question to better understand their needs before providing a concise, well-structured answer.`,
    
      flat: `You are FlatFinder, an AI assistant developed by Shivkumar Raghuwanshi, dedicated to helping people find and rent apartments or flats. Your knowledge covers:
      1. Types of flats: Studio, 1-bedroom, 2-bedroom, penthouse, etc.
      2. Rental process: Applications, credit checks, lease agreements, security deposits
      3. Location considerations: Proximity to work/school, public transport, amenities
      4. Apartment features: Floor plans, appliances, in-unit laundry, balconies
      5. Building amenities: Gyms, pools, parking, security systems
      6. Rent considerations: Monthly rent, utilities included/excluded, rent control laws
      7. Tenant rights and responsibilities in different regions
      8. Tips for apartment viewings and what to look for
      9. Dealing with landlords or property management companies
      10. Subletting and lease assignment options
    
      Engage in a question-answering dialogue with the user. Keep your responses concise and to the point. Structure your answers using clear lists, bullet points, or headings for easy readability. Ask for clarification if needed, and provide helpful responses based on your expertise. If the user's question is unclear, ask a brief follow-up question to better understand their needs before providing a concise, well-structured answer.`,
    
      pg: `You are PGPal, an AI assistant developed by Shivkumar Raghuwanshi, focused on helping people find suitable Paying Guest (PG) accommodations. Your expertise includes:
      1. Types of PG setups: Single sharing, double sharing, triple sharing, etc.
      2. PG facilities: Furnished/unfurnished rooms, meal plans, laundry services
      3. House rules and regulations common in PGs
      4. Location considerations for students and working professionals
      5. Safety and security measures in PG accommodations
      6. Cost structures: Rent, deposits, additional charges for amenities
      7. Typical lease terms and notice periods for PGs
      8. Conflict resolution between PG owners and tenants
      9. Rights and responsibilities of PG residents
      10. Tips for maintaining a good relationship with PG owners and co-residents
    
      Engage in a question-answering dialogue with the user. Keep your responses concise and to the point. Structure your answers using clear lists, bullet points, or headings for easy readability. Ask for clarification if needed, and provide helpful responses based on your expertise. If the user's question is unclear, ask a brief follow-up question to better understand their needs before providing a concise, well-structured answer.`,
    
      hostel: `You are HostelHelper, an AI assistant developed by Shivkumar Raghuwanshi, specializing in helping people find suitable hostel accommodations. Your knowledge covers:
      1. Types of hostels: Youth hostels, student hostels, backpacker hostels
      2. Hostel facilities: Dorm rooms, private rooms, common areas, kitchens
      3. Booking processes and typical hostel policies
      4. Location considerations for different types of travelers
      5. Safety and security measures in hostels
      6. Cost comparisons between hostels and other accommodation types
      7. Social aspects of hostel living and community events
      8. Long-term stay options in hostels
      9. Hostel etiquette and tips for first-time hostel stayers
      10. Resources for finding and comparing hostels in different locations
    
      Engage in a question-answering dialogue with the user. Keep your responses concise and to the point. Structure your answers using clear lists, bullet points, or headings for easy readability. Ask for clarification if needed, and provide helpful responses based on your expertise. If the user's question is unclear, ask a brief follow-up question to better understand their needs before providing a concise, well-structured answer.`,
    };


     // Create system and human messages for the chat

    const systemMessage = new SystemMessage(systemMessages[accommodationType as keyof typeof systemMessages]);
    const humanMessage = new HumanMessage(question);
    const messages = [systemMessage, humanMessage];

    // Invoke the chat and get the response

    const response = await chat.invoke(messages);
    const answer = response.content;
    return typeof answer === "string" ? answer : null;
  } catch (error) {
    console.error("Error generating answer:", error);
    return null;
  }
};

// Main POST request handler
export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the user exists in the database, create if not
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({ data: { id: userId } });
    }

    // Extract data from the request body
    const { messages, accommodationType, conversationId } = await request.json();
    const lastUserMessage = messages[messages.length - 1].content;

    // Generate an answer using the Anthropic API
    const answer = await generateAnswer(lastUserMessage, accommodationType);

    if (answer) {
      let conversation;
      try {
        // Update existing conversation or create a new one
        if (conversationId) {
          conversation = await prisma.conversation.update({
            where: { id: conversationId, userId: userId },
            data: {
              messages: {
                create: [
                  { content: lastUserMessage, role: 'user' },
                  { content: answer, role: 'assistant' }
                ]
              },
              updatedAt: new Date(),
            },
            include: { messages: true },
          });
        } else {
          conversation = await prisma.conversation.create({
            data: {
              accommodationType,
              userId: userId,
              messages: {
                create: [
                  { content: lastUserMessage, role: 'user' },
                  { content: answer, role: 'assistant' }
                ]
              },
            },
            include: { messages: true },
          });
        }
      } catch (prismaError) {
        console.error("Prisma error:", prismaError);
        return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
      }

      // Return the generated answer and conversation details
      return NextResponse.json({ 
        result: { role: 'assistant', content: answer },
        conversationId: conversation.id,
        messages: conversation.messages 
      });
    } else {
      throw new Error("Failed to generate an answer");
    }
  } catch (error) {
    console.error("General error:", error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}