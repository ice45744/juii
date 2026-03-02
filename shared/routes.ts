import { z } from 'zod';
import { insertUserSchema, insertActivitySchema, insertReportSchema, loginSchema, users, activities, reports, announcements } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// We redefine the schema types with z.custom to satisfy TypeScript for responses
const userSchema = z.custom<typeof users.$inferSelect>();
const activitySchema = z.custom<typeof activities.$inferSelect>();
const reportSchema = z.custom<typeof reports.$inferSelect>();
const announcementSchema = z.custom<typeof announcements.$inferSelect>();

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: insertUserSchema,
      responses: {
        201: userSchema,
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: loginSchema,
      responses: {
        200: userSchema,
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: userSchema,
        401: errorSchemas.unauthorized,
      },
    },
  },
  activities: {
    list: {
      method: 'GET' as const,
      path: '/api/activities' as const,
      responses: {
        200: z.array(activitySchema),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/activities' as const,
      input: insertActivitySchema,
      responses: {
        201: activitySchema,
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  reports: {
    list: {
      method: 'GET' as const,
      path: '/api/reports' as const,
      responses: {
        200: z.array(reportSchema),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/reports' as const,
      input: insertReportSchema,
      responses: {
        201: reportSchema,
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  announcements: {
    list: {
      method: 'GET' as const,
      path: '/api/announcements' as const,
      responses: {
        200: z.array(announcementSchema),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
