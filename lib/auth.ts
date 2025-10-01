// 137studios - Authentication System
// Secure JWT-based authentication replacing the insecure click pattern

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Secure admin credentials (move to environment variables)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD_HASH || '', // Must be bcrypt hash
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        oracleCode: { label: 'Oracle Code', type: 'text' }, // Mystical touch
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password || !credentials?.oracleCode) {
          return null;
        }

        // Verify oracle code (mystical element)
        if (credentials.oracleCode !== '137') {
          return null;
        }

        // Verify username
        if (credentials.username !== ADMIN_CREDENTIALS.username) {
          return null;
        }

        // Verify password (use bcrypt for production)
        if (ADMIN_CREDENTIALS.password) {
          const isValid = await bcrypt.compare(credentials.password, ADMIN_CREDENTIALS.password);
          if (!isValid) return null;
        } else {
          // Temporary fallback for development
          if (credentials.password !== process.env.ADMIN_TEMP_PASSWORD) {
            return null;
          }
        }

        return {
          id: '1',
          name: 'Mystic Admin',
          email: 'admin@137studios.com',
          role: 'admin',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutes
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 60, // 30 minutes
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.sub || '1';
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/error',
  },
};

// Middleware for API route protection
export const withAuth = (handler: any) => {
  return async (req: any, res: any) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
      req.user = decoded;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

// Rate limiting configuration
export const RATE_LIMITS = {
  admin: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each admin to 100 requests per windowMs
  },
  upload: {
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit uploads to 5 per minute
  },
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
  },
};

// Password hashing utility
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// Secure session validation
export const validateSession = async (sessionToken: string): Promise<boolean> => {
  try {
    const decoded = jwt.verify(sessionToken, process.env.NEXTAUTH_SECRET!);
    return !!decoded;
  } catch {
    return false;
  }
};

export default authOptions;