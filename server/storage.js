import { MongoClient, ObjectId } from 'mongodb';
import createMemoryStore from "memorystore";
import session from "express-session";
import { 
  User, 
  Education, 
  WorkExperience, 
  Language, 
  Topic, 
  SocialMedia 
} from "../shared/schema.js";

const MemoryStore = createMemoryStore(session);

export class MemStorage {
  constructor() {
    // In-memory storage for development
    this.users = new Map();
    this.educations = new Map();
    this.workExperiences = new Map();
    this.languages = new Map();
    this.topics = new Map();
    this.socialMedias = new Map();
    this.currentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User operations
  async getUser(id) {
    return this.users.get(id);
  }

  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser) {
    const id = this.currentId.toString();
    this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id, userData) {
    const user = this.users.get(id);
    if (!user) return null;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Education operations
  async getEducations(userId) {
    return Array.from(this.educations.values()).filter(
      (edu) => edu.userId === userId
    );
  }

  async getEducation(id) {
    return this.educations.get(id);
  }

  async createEducation(userId, educationData) {
    const id = `edu_${this.currentId++}`;
    const education = { ...educationData, id, userId };
    this.educations.set(id, education);
    return education;
  }

  async updateEducation(id, educationData) {
    const education = this.educations.get(id);
    if (!education) return null;
    
    const updatedEducation = { ...education, ...educationData };
    this.educations.set(id, updatedEducation);
    return updatedEducation;
  }

  async deleteEducation(id) {
    const education = this.educations.get(id);
    if (!education) return false;
    
    this.educations.delete(id);
    return true;
  }

  // Work Experience operations
  async getWorkExperiences(userId) {
    return Array.from(this.workExperiences.values()).filter(
      (exp) => exp.userId === userId
    );
  }

  async getWorkExperience(id) {
    return this.workExperiences.get(id);
  }

  async createWorkExperience(userId, workData) {
    const id = `work_${this.currentId++}`;
    const workExperience = { ...workData, id, userId };
    this.workExperiences.set(id, workExperience);
    return workExperience;
  }

  async updateWorkExperience(id, workData) {
    const workExperience = this.workExperiences.get(id);
    if (!workExperience) return null;
    
    const updatedWorkExperience = { ...workExperience, ...workData };
    this.workExperiences.set(id, updatedWorkExperience);
    return updatedWorkExperience;
  }

  async deleteWorkExperience(id) {
    const workExperience = this.workExperiences.get(id);
    if (!workExperience) return false;
    
    this.workExperiences.delete(id);
    return true;
  }

  // Language operations
  async getLanguages(userId) {
    return Array.from(this.languages.values()).filter(
      (lang) => lang.userId === userId
    );
  }

  async createLanguage(userId, languageData) {
    const id = `lang_${this.currentId++}`;
    const language = { ...languageData, id, userId };
    this.languages.set(id, language);
    return language;
  }

  async deleteLanguage(id) {
    const language = this.languages.get(id);
    if (!language) return false;
    
    this.languages.delete(id);
    return true;
  }

  // Topic operations
  async getTopics(userId) {
    return Array.from(this.topics.values()).filter(
      (topic) => topic.userId === userId
    );
  }

  async createTopic(userId, topicData) {
    const id = `topic_${this.currentId++}`;
    const topic = { ...topicData, id, userId };
    this.topics.set(id, topic);
    return topic;
  }

  async deleteTopic(id) {
    const topic = this.topics.get(id);
    if (!topic) return false;
    
    this.topics.delete(id);
    return true;
  }

  // Social Media operations
  async getSocialMedias(userId) {
    return Array.from(this.socialMedias.values()).filter(
      (social) => social.userId === userId
    );
  }

  async createSocialMedia(userId, socialData) {
    const id = `social_${this.currentId++}`;
    const socialMedia = { ...socialData, id, userId };
    this.socialMedias.set(id, socialMedia);
    return socialMedia;
  }

  async updateSocialMedia(id, socialData) {
    const socialMedia = this.socialMedias.get(id);
    if (!socialMedia) return null;
    
    const updatedSocialMedia = { ...socialMedia, ...socialData };
    this.socialMedias.set(id, updatedSocialMedia);
    return updatedSocialMedia;
  }

  async deleteSocialMedia(id) {
    const socialMedia = this.socialMedias.get(id);
    if (!socialMedia) return false;
    
    this.socialMedias.delete(id);
    return true;
  }
}

// MongoDB implementation
export class MongoDBStorage {
  constructor() {
    this.client = null;
    this.db = null;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    this.init();
  }

  async init() {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/simpliTrain';
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }

  // User operations
  async getUser(id) {
    if (!this.db) await this.init();
    return this.db.collection('users').findOne({ _id: id });
  }

  async getUserByUsername(username) {
    if (!this.db) await this.init();
    return this.db.collection('users').findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });
  }

  async getUserByEmail(email) {
    if (!this.db) await this.init();
    return this.db.collection('users').findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
  }

  async createUser(insertUser) {
    if (!this.db) await this.init();
    const user = {
      ...insertUser,
      _id: new ObjectId().toString()
    };
    await this.db.collection('users').insertOne(user);
    // Map MongoDB _id to id for consistent interface
    user.id = user._id;
    return user;
  }

  async updateUser(id, userData) {
    if (!this.db) await this.init();
    const result = await this.db.collection('users').findOneAndUpdate(
      { _id: id },
      { $set: userData },
      { returnDocument: 'after' }
    );
    
    if (result) {
      result.id = result._id;
      return result;
    }
    return null;
  }

  // Education operations
  async getEducations(userId) {
    if (!this.db) await this.init();
    const educations = await this.db.collection('educations')
      .find({ userId })
      .sort({ endDate: -1 })
      .toArray();
    
    return educations.map(edu => {
      edu.id = edu._id;
      return edu;
    });
  }

  async getEducation(id) {
    if (!this.db) await this.init();
    const education = await this.db.collection('educations').findOne({ _id: id });
    if (education) {
      education.id = education._id;
    }
    return education;
  }

  async createEducation(userId, educationData) {
    if (!this.db) await this.init();
    const education = {
      ...educationData,
      userId,
      _id: new ObjectId().toString()
    };
    await this.db.collection('educations').insertOne(education);
    education.id = education._id;
    return education;
  }

  async updateEducation(id, educationData) {
    if (!this.db) await this.init();
    const result = await this.db.collection('educations').findOneAndUpdate(
      { _id: id },
      { $set: educationData },
      { returnDocument: 'after' }
    );
    
    if (result) {
      result.id = result._id;
      return result;
    }
    return null;
  }

  async deleteEducation(id) {
    if (!this.db) await this.init();
    const result = await this.db.collection('educations').deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // Work Experience operations
  async getWorkExperiences(userId) {
    if (!this.db) await this.init();
    const experiences = await this.db.collection('workExperiences')
      .find({ userId })
      .sort({ endDate: -1, currentlyWorking: -1 })
      .toArray();
    
    return experiences.map(exp => {
      exp.id = exp._id;
      return exp;
    });
  }

  async getWorkExperience(id) {
    if (!this.db) await this.init();
    const experience = await this.db.collection('workExperiences').findOne({ _id: id });
    if (experience) {
      experience.id = experience._id;
    }
    return experience;
  }

  async createWorkExperience(userId, workData) {
    if (!this.db) await this.init();
    const workExperience = {
      ...workData,
      userId,
      _id: new ObjectId().toString()
    };
    await this.db.collection('workExperiences').insertOne(workExperience);
    workExperience.id = workExperience._id;
    return workExperience;
  }

  async updateWorkExperience(id, workData) {
    if (!this.db) await this.init();
    const result = await this.db.collection('workExperiences').findOneAndUpdate(
      { _id: id },
      { $set: workData },
      { returnDocument: 'after' }
    );
    
    if (result) {
      result.id = result._id;
      return result;
    }
    return null;
  }

  async deleteWorkExperience(id) {
    if (!this.db) await this.init();
    const result = await this.db.collection('workExperiences').deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // Language operations
  async getLanguages(userId) {
    if (!this.db) await this.init();
    const languages = await this.db.collection('languages')
      .find({ userId })
      .toArray();
    
    return languages.map(lang => {
      lang.id = lang._id;
      return lang;
    });
  }

  async createLanguage(userId, languageData) {
    if (!this.db) await this.init();
    const language = {
      ...languageData,
      userId,
      _id: new ObjectId().toString()
    };
    await this.db.collection('languages').insertOne(language);
    language.id = language._id;
    return language;
  }

  async deleteLanguage(id) {
    if (!this.db) await this.init();
    const result = await this.db.collection('languages').deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // Topic operations
  async getTopics(userId) {
    if (!this.db) await this.init();
    const topics = await this.db.collection('topics')
      .find({ userId })
      .toArray();
    
    return topics.map(topic => {
      topic.id = topic._id;
      return topic;
    });
  }

  async createTopic(userId, topicData) {
    if (!this.db) await this.init();
    const topic = {
      ...topicData,
      userId,
      _id: new ObjectId().toString()
    };
    await this.db.collection('topics').insertOne(topic);
    topic.id = topic._id;
    return topic;
  }

  async deleteTopic(id) {
    if (!this.db) await this.init();
    const result = await this.db.collection('topics').deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // Social Media operations
  async getSocialMedias(userId) {
    if (!this.db) await this.init();
    const socialMedias = await this.db.collection('socialMedias')
      .find({ userId })
      .toArray();
    
    return socialMedias.map(social => {
      social.id = social._id;
      return social;
    });
  }

  async createSocialMedia(userId, socialData) {
    if (!this.db) await this.init();
    const socialMedia = {
      ...socialData,
      userId,
      _id: new ObjectId().toString()
    };
    await this.db.collection('socialMedias').insertOne(socialMedia);
    socialMedia.id = socialMedia._id;
    return socialMedia;
  }

  async updateSocialMedia(id, socialData) {
    if (!this.db) await this.init();
    const result = await this.db.collection('socialMedias').findOneAndUpdate(
      { _id: id },
      { $set: socialData },
      { returnDocument: 'after' }
    );
    
    if (result) {
      result.id = result._id;
      return result;
    }
    return null;
  }

  async deleteSocialMedia(id) {
    if (!this.db) await this.init();
    const result = await this.db.collection('socialMedias').deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

// Use MongoDB if URI is provided, otherwise use in-memory storage
export const storage = process.env.MONGODB_URI 
  ? new MongoDBStorage() 
  : new MemStorage();
