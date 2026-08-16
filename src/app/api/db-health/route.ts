import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({
      status: 'connected',
      message: 'Successfully connected to MongoDB at mongodb://localhost:27017',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to MongoDB',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
