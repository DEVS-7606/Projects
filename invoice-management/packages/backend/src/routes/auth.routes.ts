import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, signupSchema } from "../validation/auth.schema.js";

const router = Router();
const authController = new AuthController();

router.post(
  "/login",
  validate(loginSchema),
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next),
);
router.post(
  "/signup",
  validate(signupSchema),
  (req: Request, res: Response, next: NextFunction) =>
    authController.signup(req, res, next),
);
router.get(
  "/session",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authController.getSession(req, res, next),
);
router.post(
  "/logout",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authController.logout(req, res, next),
);

export default router;
