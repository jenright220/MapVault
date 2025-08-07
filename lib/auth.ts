import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// Session configuration
export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_security_purposes_in_production',
  cookieName: 'mapvault-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
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

// Admin credentials (in production, this should be in environment variables or database)
const ADMIN_USERNAME = 'jenright20';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('korver123!', 10);

// Verify admin credentials
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) {
    return false;
  }
  
  return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
}

// Check if user is authenticated as admin
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true && session.isAdmin === true;
}

// Login admin user
export async function loginAdmin() {
  const session = await getSession();
  session.userId = 'admin';
  session.username = ADMIN_USERNAME;
  session.isAdmin = true;
  session.isLoggedIn = true;
  await session.save();
}

// Logout user
export async function logout() {
  const session = await getSession();
  session.destroy();
}