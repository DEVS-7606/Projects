import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, business_name, username } = req.body;
      const result = await authService.signup(
        email,
        password,
        business_name || "",
        username || email.split("@")[0],
      );
      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async getSession(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const result = await authService.getSession(authReq.accessToken);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      await authService.logout(authReq.accessToken);
      res.json({ data: { message: "Logged out successfully" } });
    } catch (error) {
      next(error);
    }
  }
}
