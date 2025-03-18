import { z } from "zod";

// User Schema
export const userSchema = {
  id: String,
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  age: Number,
  gender: String,
  address: String,
  phoneNumber: String,
  bio: String,
  profilePicture: String,
};

// Education Schema
export const educationSchema = {
  id: String,
  userId: String,
  institutionName: String,
  degree: String,
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  graduationYear: Number,
  institutionLogo: String,
  description: String,
};

// Work Experience Schema
export const workExperienceSchema = {
  id: String,
  userId: String,
  jobTitle: String,
  company: String,
  location: String,
  startDate: Date,
  endDate: Date,
  currentlyWorking: Boolean,
  description: String,
  companyLogo: String,
};

// Language Preference Schema
export const languageSchema = {
  id: String,
  userId: String,
  name: String,
  isPrimary: Boolean,
};

// Interested Topics Schema
export const topicSchema = {
  id: String,
  userId: String,
  name: String,
};

// Social Media Schema
export const socialMediaSchema = {
  id: String,
  userId: String,
  platform: String, // linkedin, twitter, facebook, instagram
  url: String,
};

// Validation Schemas
export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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

export const educationInsertSchema = z.object({
  institutionName: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  graduationYear: z.number().optional(),
  institutionLogo: z.string().optional(),
  description: z.string().optional(),
});

export const workExperienceInsertSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
  description: z.string().optional(),
  companyLogo: z.string().optional(),
});

export const languageInsertSchema = z.object({
  name: z.string().min(1, "Language name is required"),
  isPrimary: z.boolean().optional(),
});

export const topicInsertSchema = z.object({
  name: z.string().min(1, "Topic name is required"),
});

export const socialMediaInsertSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Please enter a valid URL"),
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

// For TypeScript compatibility in a JavaScript project
export const InsertUser = insertUserSchema;
export const LoginUser = loginSchema;
export const InsertEducation = educationInsertSchema;
export const InsertWorkExperience = workExperienceInsertSchema;
export const InsertLanguage = languageInsertSchema;
export const InsertTopic = topicInsertSchema;
export const InsertSocialMedia = socialMediaInsertSchema;
export const UpdateProfile = updateProfileSchema;

// Models for the MongoDB collections
export const User = userSchema;
export const Education = educationSchema;
export const WorkExperience = workExperienceSchema;
export const Language = languageSchema;
export const Topic = topicSchema;
export const SocialMedia = socialMediaSchema;
