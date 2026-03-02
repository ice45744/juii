import { db } from "./db";
import { 
  users, activities, reports, announcements,
  type User, type InsertUser, type Activity, type InsertActivity, type Report, type InsertReport, type Announcement
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByStudentId(studentId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Activities
  getActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Reports
  getReports(): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;

  // Announcements
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(title: string, content: string): Promise<Announcement>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByStudentId(studentId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.studentId, studentId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(activities.createdAt);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    // If it's a goodness points activity, we should add points to the user
    if (activity.type === 'other_goodness' || activity.type === 'morning_checkin') {
      const points = activity.pointsAwarded || 1;
      await db.execute(`UPDATE users SET goodness_points = goodness_points + ${points} WHERE id = ${activity.userId}`);
    } else if (activity.type === 'garbage_bank') {
      const stamps = activity.pointsAwarded || 1;
      await db.execute(`UPDATE users SET garbage_stamps = garbage_stamps + ${stamps} WHERE id = ${activity.userId}`);
    }

    const [newActivity] = await db.insert(activities).values({
      ...activity,
      pointsAwarded: activity.pointsAwarded || 1
    }).returning();
    return newActivity;
  }

  // Reports
  async getReports(): Promise<Report[]> {
    return await db.select().from(reports).orderBy(reports.createdAt);
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).orderBy(announcements.createdAt);
  }

  async createAnnouncement(title: string, content: string): Promise<Announcement> {
    const [announcement] = await db.insert(announcements).values({ title, content }).returning();
    return announcement;
  }
}

export const storage = new DatabaseStorage();
