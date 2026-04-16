import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import multer from "multer";
import { WebhookController } from "../controllers/webhook.controller.js";

const router = Router();
const webhookController = new WebhookController();

/**
 * Multer config for handling SendGrid's multipart/form-data payload.
 * SendGrid sends attachments as file fields (attachment1, attachment2, etc.)
 * We store them in memory since we immediately upload to Supabase Storage.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max per file
    files: 5, // max 5 attachments
  },
});

/**
 * POST /api/webhook/email
 *
 * No auth middleware — this is called by SendGrid directly.
 * SendGrid sends multipart/form-data with email fields + attachments.
 */
router.post(
  "/email",
  upload.any(),
  (req: Request, res: Response, next: NextFunction) =>
    webhookController.handleInboundEmail(req, res, next),
);

export default router;
