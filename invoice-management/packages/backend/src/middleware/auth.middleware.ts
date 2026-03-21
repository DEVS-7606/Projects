import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';

export interface AuthenticatedRequest extends Request {
  userId: string;
  accessToken: string;
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid token' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
      return;
    }

    (req as AuthenticatedRequest).userId = data.user.id;
    (req as AuthenticatedRequest).accessToken = token;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized', message: 'Token verification failed' });
  }
}
