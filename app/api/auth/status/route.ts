import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    return NextResponse.json({ 
      isAuthenticated: session.isLoggedIn === true && session.isAdmin === true,
      username: session.username || null
    });

  } catch (error) {
    console.error('Auth status error:', error);
    return NextResponse.json({ 
      isAuthenticated: false,
      username: null
    });
  }
}