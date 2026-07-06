import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const oauthClient = new OAuth2Client(CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_super_secret_jwt_key_12345';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'myemail@gmail.com';

export interface AdminPayload {
  email: string;
  name: string;
  picture?: string;
  role: 'admin';
}

export async function verifyGoogleToken(idToken: string): Promise<{ email: string; name: string; picture?: string }> {
  try {
    // If GOOGLE_CLIENT_ID is not set, we can call Google's tokeninfo endpoint as a fallback,
    // which is very helpful for local development or simple configurations.
    if (!CLIENT_ID) {
      const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      if (!res.ok) {
        throw new Error('Failed to verify token with Google tokeninfo API');
      }
      const data = await res.json();
      if (!data.email) {
        throw new Error('No email found in Google token info');
      }
      return {
        email: data.email,
        name: data.name || '',
        picture: data.picture || ''
      };
    }

    const ticket = await oauthClient.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google token payload');
    }
    return {
      email: payload.email,
      name: payload.name || '',
      picture: payload.picture || ''
    };
  } catch (error) {
    console.error('Google token verification failed:', error);
    throw error;
  }
}

export function generateToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyLocalToken(token: string): AdminPayload {
  return jwt.verify(token, JWT_SECRET) as AdminPayload;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }
  
  try {
    const decoded = verifyLocalToken(token);
    if (decoded.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Access Denied: Not an authorized admin' });
    }
    (req as any).admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication token' });
  }
}
