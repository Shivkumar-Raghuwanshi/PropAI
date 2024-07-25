import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id, userId },
      include: { messages: true }
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}


export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const { userId } = auth();
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const { accommodationType } = await request.json();
  
      const updatedConversation = await prisma.conversation.update({
        where: { id: params.id, userId },
        data: { accommodationType }
      });
  
      return NextResponse.json(updatedConversation);
    } catch (error) {
      console.error('Error updating conversation:', error);
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
  }
  
  export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const { userId } = auth();
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      await prisma.conversation.delete({
        where: { id: params.id, userId }
      });
  
      return NextResponse.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
  }

