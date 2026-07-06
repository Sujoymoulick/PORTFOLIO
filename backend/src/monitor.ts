import { Request, Response, NextFunction } from 'express';
import { getDb } from './db';

export interface ApiCallLog {
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  responseTimeMs: number;
}

export const apiCallLogs: ApiCallLog[] = [];

export function monitorMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip static assets, health checks, and self-monitoring calls
  if (
    req.url.includes('/api/connectivity') || 
    req.url.startsWith('/assets') || 
    req.url.endsWith('.js') || 
    req.url.endsWith('.css') || 
    req.url.endsWith('.png')
  ) {
    return next();
  }

  const start = Date.now();
  res.on('finish', () => {
    const logEntry: ApiCallLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      responseTimeMs: Date.now() - start,
    };
    apiCallLogs.unshift(logEntry);
    if (apiCallLogs.length > 50) {
      apiCallLogs.pop();
    }
  });
  next();
}

export async function getConnectivityStats() {
  let dbStatus = 'disconnected';
  let dbLatencyMs = -1;

  try {
    const db = getDb();
    if (db) {
      const dbStart = Date.now();
      await db.command({ ping: 1 });
      dbLatencyMs = Date.now() - dbStart;
      dbStatus = 'connected';
    }
  } catch (error) {
    console.error('Database monitor ping failed:', error);
  }

  return {
    mongodb: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    uptime: process.uptime(),
    recentCalls: apiCallLogs,
  };
}
