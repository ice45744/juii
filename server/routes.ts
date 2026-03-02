import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Simple session-based auth mock for now since we are not using a full auth library in this simple demo
  // In a real app we'd use express-session with connect-pg-simple or passport
  const sessionUser = new Map<string, number>();

  // Use simple middleware to attach user to req
  app.use((req, res, next) => {
    // Check for a dummy auth token (just an id for our prototype)
    const token = req.headers['authorization'];
    if (token) {
      const userId = sessionUser.get(token);
      if (userId) {
        (req as any).userId = userId;
      }
    }
    next();
  });

  // Auth Routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByStudentId(input.studentId);
      if (existing) {
        return res.status(400).json({ message: "Student ID already registered" });
      }
      const user = await storage.createUser(input);
      // Log them in automatically
      const token = `token_${user.id}`;
      sessionUser.set(token, user.id);
      res.setHeader('Authorization', token);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByStudentId(input.studentId);
      
      if (!user || user.password !== input.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = `token_${user.id}`;
      sessionUser.set(token, user.id);
      res.setHeader('Authorization', token);
      res.status(200).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.auth.me.path, async (req, res) => {
    // For demo purposes, we will mock auth if the header isn't present
    const authHeader = req.headers['authorization'];
    let userId = (req as any).userId;
    
    // Auto-login logic for testing frontend without a proper login setup if needed
    if (!userId) {
      // Find a default user or return 401
      // In strict mode:
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.status(200).json(user);
  });

  app.post(api.auth.logout.path, (req, res) => {
    const token = req.headers['authorization'];
    if (token) {
      sessionUser.delete(token);
    }
    res.status(200).json({ message: "Logged out" });
  });

  // Activities Routes
  app.get(api.activities.list.path, async (req, res) => {
    const activities = await storage.getActivities();
    res.json(activities);
  });

  app.post(api.activities.create.path, async (req, res) => {
    try {
      const userId = (req as any).userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const input = api.activities.create.input.parse({ ...req.body, userId });
      const activity = await storage.createActivity(input);
      res.status(201).json(activity);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal error" });
    }
  });

  // Reports Routes
  app.get(api.reports.list.path, async (req, res) => {
    const reports = await storage.getReports();
    res.json(reports);
  });

  app.post(api.reports.create.path, async (req, res) => {
    try {
      const userId = (req as any).userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const input = api.reports.create.input.parse({ ...req.body, userId });
      const report = await storage.createReport(input);
      res.status(201).json(report);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal error" });
    }
  });

  // Announcements Routes
  app.get(api.announcements.list.path, async (req, res) => {
    const announcements = await storage.getAnnouncements();
    res.json(announcements);
  });

  // Seed DB with mock data if it's empty
  setTimeout(async () => {
    try {
      const user = await storage.getUserByStudentId("19823");
      if (!user) {
        await storage.createUser({
          studentId: "19823",
          password: "password",
          fullName: "Kittipot Ice",
          councilId: ""
        });
      }
      const existing = await storage.getAnnouncements();
      if (existing.length === 0) {
        await storage.createAnnouncement("กิจกรรมปลูกป่า", "ขอเชิญนักเรียนเข้าร่วมกิจกรรมปลูกป่าเพื่อสะสมแต้มความดี");
      }
    } catch (e) {
      console.error("Failed to seed db", e);
    }
  }, 2000);

  return httpServer;
}
