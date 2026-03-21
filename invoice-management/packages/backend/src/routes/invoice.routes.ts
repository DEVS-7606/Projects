import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { InvoiceController } from "../controllers/invoice.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  invoiceFiltersSchema,
} from "../validation/invoice.schema.js";

const router = Router();
const invoiceController = new InvoiceController();

router.use(authMiddleware);

router.get(
  "/",
  validate(invoiceFiltersSchema, "query"),
  (req: Request, res: Response, next: NextFunction) =>
    invoiceController.getAll(req, res, next),
);
router.get("/stats", (req: Request, res: Response, next: NextFunction) =>
  invoiceController.getStats(req, res, next),
);
router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  invoiceController.getById(req, res, next),
);
router.post(
  "/",
  validate(createInvoiceSchema),
  (req: Request, res: Response, next: NextFunction) =>
    invoiceController.create(req, res, next),
);
router.patch(
  "/:id",
  validate(updateInvoiceSchema),
  (req: Request, res: Response, next: NextFunction) =>
    invoiceController.update(req, res, next),
);
router.delete("/:id", (req: Request, res: Response, next: NextFunction) =>
  invoiceController.remove(req, res, next),
);

export default router;
