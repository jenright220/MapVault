import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// Session configuration
export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_security_purposes_in_production',
  cookieName: 'mapvault-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/mapvault', // Set cookie path to match basePath
  },
};

// Session interface
export interface SessionData {
  userId?: string;
  username?: string;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
}

// Get session
export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

// Verify admin credentials against database
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
        isAdmin: true,
        isActive: true,
      },
    });

    if (!user) {
      return false;
    }

    return bcrypt.compareSync(password, user.password);
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return false;
  }
}

// Check if user is authenticated as admin
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true && session.isAdmin === true;
}

// Login admin user
export async function loginAdmin(username: string) {
  const session = await getSession();
  session.userId = 'admin';
  session.username = username;
  session.isAdmin = true;
  session.isLoggedIn = true;
  await session.save();
}

// Logout user
export async function logout() {
  const session = await getSession();
  session.destroy();
}