import { Router } from "express";
import authRoutes from "./auth.routes.js";
import invoiceRoutes from "./invoice.routes.js";
import vendorRoutes from "./vendor.routes.js";
import webhookRoutes from "./webhook.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/vendors", vendorRoutes);
router.use("/webhook", webhookRoutes);

export default router;
