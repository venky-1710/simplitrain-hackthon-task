import { pgTable, text, serial, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  age: integer("age"),
  gender: text("gender"),
  address: text("address"),
  phoneNumber: text("phoneNumber"),
  bio: text("bio"),
  profilePicture: text("profilePicture"),
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  institutionName: text("institutionName").notNull(),
  degree: text("degree").notNull(),
  fieldOfStudy: text("fieldOfStudy"),
  startDate: text("startDate").notNull(),
  endDate: text("endDate"),
  graduationYear: integer("graduationYear"),
  institutionLogo: text("institutionLogo"),
  description: text("description"),
});

export const workExperience = pgTable("work_experience", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  jobTitle: text("jobTitle").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  startDate: text("startDate").notNull(),
  endDate: text("endDate"),
  currentlyWorking: boolean("currentlyWorking").default(false),
  description: text("description"),
  companyLogo: text("companyLogo"),
});

export const language = pgTable("language", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: text("name").notNull(),
  isPrimary: boolean("isPrimary").default(false),
});

export const topic = pgTable("topic", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: text("name").notNull(),
});

export const socialMedia = pgTable("social_media", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  age: true,
  gender: true,
  address: true,
  phoneNumber: true,
  bio: true,
  profilePicture: true,
}).extend({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
});

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertEducationSchema = createInsertSchema(education).omit({
  id: true,
}).extend({
  fieldOfStudy: z.string().optional(),
  endDate: z.string().optional(),
  graduationYear: z.number().optional(),
  institutionLogo: z.string().optional(),
  description: z.string().optional(),
});

export const insertWorkExperienceSchema = createInsertSchema(workExperience).omit({
  id: true,
}).extend({
  location: z.string().optional(),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
  description: z.string().optional(),
  companyLogo: z.string().optional(),
});

export const insertLanguageSchema = createInsertSchema(language).omit({
  id: true,
}).extend({
  isPrimary: z.boolean().optional(),
});

export const insertTopicSchema = createInsertSchema(topic).omit({
  id: true,
});

export const insertSocialMediaSchema = createInsertSchema(socialMedia).omit({
  id: true,
});

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof education.$inferSelect;
export type InsertWorkExperience = z.infer<typeof insertWorkExperienceSchema>;
export type WorkExperience = typeof workExperience.$inferSelect;
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type Language = typeof language.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type Topic = typeof topic.$inferSelect;
export type InsertSocialMedia = z.infer<typeof insertSocialMediaSchema>;
export type SocialMedia = typeof socialMedia.$inferSelect;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
