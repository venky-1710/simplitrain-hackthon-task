import express from 'express';
import { createServer } from "http";
import { setupAuth } from './auth.js';
import { storage } from "./storage.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};

export function registerRoutes(app) {
  // Sets up auth routes
  setupAuth(app);
  
  // Serve uploads directory
  app.use('/uploads', express.static(uploadDir));
  
  // Profile routes
  app.get('/api/profile', isAuthenticated, async (req, res, next) => {
    try {
      const user = { ...req.user };
      delete user.password;
      
      res.json(user);
    } catch (error) {
      next(error);
    }
  });
  
  app.patch('/api/profile', isAuthenticated, async (req, res, next) => {
    try {
      const updatedUser = await storage.updateUser(req.user.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const responseUser = { ...updatedUser };
      delete responseUser.password;
      
      res.json(responseUser);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/profile/upload', isAuthenticated, upload.single('profilePicture'), async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const profilePicture = `/uploads/${req.file.filename}`;
      
      const updatedUser = await storage.updateUser(req.user.id, { profilePicture });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ profilePicture });
    } catch (error) {
      next(error);
    }
  });
  
  // Education routes
  app.get('/api/educations', isAuthenticated, async (req, res, next) => {
    try {
      const educations = await storage.getEducations(req.user.id);
      res.json(educations);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/educations', isAuthenticated, async (req, res, next) => {
    try {
      const education = await storage.createEducation(req.user.id, req.body);
      res.status(201).json(education);
    } catch (error) {
      next(error);
    }
  });
  
  app.patch('/api/educations/:id', isAuthenticated, async (req, res, next) => {
    try {
      const education = await storage.getEducation(req.params.id);
      
      if (!education) {
        return res.status(404).json({ message: 'Education not found' });
      }
      
      if (education.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const updatedEducation = await storage.updateEducation(req.params.id, req.body);
      res.json(updatedEducation);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete('/api/educations/:id', isAuthenticated, async (req, res, next) => {
    try {
      const education = await storage.getEducation(req.params.id);
      
      if (!education) {
        return res.status(404).json({ message: 'Education not found' });
      }
      
      if (education.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      await storage.deleteEducation(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
  
  // Work Experience routes
  app.get('/api/work-experiences', isAuthenticated, async (req, res, next) => {
    try {
      const workExperiences = await storage.getWorkExperiences(req.user.id);
      res.json(workExperiences);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/work-experiences', isAuthenticated, async (req, res, next) => {
    try {
      const workExperience = await storage.createWorkExperience(req.user.id, req.body);
      res.status(201).json(workExperience);
    } catch (error) {
      next(error);
    }
  });
  
  app.patch('/api/work-experiences/:id', isAuthenticated, async (req, res, next) => {
    try {
      const workExperience = await storage.getWorkExperience(req.params.id);
      
      if (!workExperience) {
        return res.status(404).json({ message: 'Work experience not found' });
      }
      
      if (workExperience.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const updatedWorkExperience = await storage.updateWorkExperience(req.params.id, req.body);
      res.json(updatedWorkExperience);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete('/api/work-experiences/:id', isAuthenticated, async (req, res, next) => {
    try {
      const workExperience = await storage.getWorkExperience(req.params.id);
      
      if (!workExperience) {
        return res.status(404).json({ message: 'Work experience not found' });
      }
      
      if (workExperience.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      await storage.deleteWorkExperience(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
  
  // Language routes
  app.get('/api/languages', isAuthenticated, async (req, res, next) => {
    try {
      const languages = await storage.getLanguages(req.user.id);
      res.json(languages);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/languages', isAuthenticated, async (req, res, next) => {
    try {
      const language = await storage.createLanguage(req.user.id, req.body);
      res.status(201).json(language);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete('/api/languages/:id', isAuthenticated, async (req, res, next) => {
    try {
      const language = await storage.getLanguage(req.params.id);
      
      if (!language) {
        return res.status(404).json({ message: 'Language not found' });
      }
      
      if (language.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      await storage.deleteLanguage(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
  
  // Topics routes
  app.get('/api/topics', isAuthenticated, async (req, res, next) => {
    try {
      const topics = await storage.getTopics(req.user.id);
      res.json(topics);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/topics', isAuthenticated, async (req, res, next) => {
    try {
      const topic = await storage.createTopic(req.user.id, req.body);
      res.status(201).json(topic);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete('/api/topics/:id', isAuthenticated, async (req, res, next) => {
    try {
      const topic = await storage.getTopic(req.params.id);
      
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' });
      }
      
      if (topic.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      await storage.deleteTopic(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
  
  // Social Media routes
  app.get('/api/social-medias', isAuthenticated, async (req, res, next) => {
    try {
      const socialMedias = await storage.getSocialMedias(req.user.id);
      res.json(socialMedias);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/social-medias', isAuthenticated, async (req, res, next) => {
    try {
      const socialMedia = await storage.createSocialMedia(req.user.id, req.body);
      res.status(201).json(socialMedia);
    } catch (error) {
      next(error);
    }
  });
  
  app.patch('/api/social-medias/:id', isAuthenticated, async (req, res, next) => {
    try {
      const socialMedia = await storage.getSocialMedia(req.params.id);
      
      if (!socialMedia) {
        return res.status(404).json({ message: 'Social media not found' });
      }
      
      if (socialMedia.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const updatedSocialMedia = await storage.updateSocialMedia(req.params.id, req.body);
      res.json(updatedSocialMedia);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete('/api/social-medias/:id', isAuthenticated, async (req, res, next) => {
    try {
      const socialMedia = await storage.getSocialMedia(req.params.id);
      
      if (!socialMedia) {
        return res.status(404).json({ message: 'Social media not found' });
      }
      
      if (socialMedia.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      await storage.deleteSocialMedia(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
