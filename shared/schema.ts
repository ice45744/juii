import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  councilId: text("council_id"),
  goodnessPoints: integer("goodness_points").notNull().default(0),
  garbageStamps: integer("garbage_stamps").notNull().default(0),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'morning_checkin', 'other_goodness', 'garbage_bank'
  description: text("description"),
  imageUrl: text("image_url"),
  pointsAwarded: integer("points_awarded").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  status: text("status").notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  goodnessPoints: true, 
  garbageStamps: true 
});

export const insertActivitySchema = createInsertSchema(activities).omit({ 
  id: true, 
  userId: true,
  createdAt: true 
});

export const insertReportSchema = createInsertSchema(reports).omit({ 
  id: true, 
  userId: true,
  status: true,
  createdAt: true 
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Announcement = typeof announcements.$inferSelect;

export const loginSchema = z.object({
  studentId: z.string(),
  password: z.string()
});
