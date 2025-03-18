import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// @ts-ignore
import { setupAuth } from "./auth.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // Profile routes
  app.get("/api/profile", (req, res) => {
    // @ts-ignore
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // @ts-ignore
    const user = { ...req.user };
    delete user.password;
    
    res.json(user);
  });

  app.patch("/api/profile", async (req, res, next) => {
    try {
      // @ts-ignore
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // @ts-ignore
      const userId = req.user.id;
      const userData = req.body;
      
      const updatedUser = await storage.updateUser(userId, userData);
      
      // Remove password from response
      const userResponse = { ...updatedUser };
      delete userResponse.password;
      
      res.json(userResponse);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
