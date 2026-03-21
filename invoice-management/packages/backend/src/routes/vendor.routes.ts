import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { VendorController } from "../controllers/vendor.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createVendorSchema,
  updateVendorSchema,
} from "../validation/vendor.schema.js";

const router = Router();
const vendorController = new VendorController();

router.use(authMiddleware);

router.get("/", (req: Request, res: Response, next: NextFunction) =>
  vendorController.getAll(req, res, next),
);
router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  vendorController.getById(req, res, next),
);
router.post(
  "/",
  validate(createVendorSchema),
  (req: Request, res: Response, next: NextFunction) =>
    vendorController.create(req, res, next),
);
router.patch(
  "/:id",
  validate(updateVendorSchema),
  (req: Request, res: Response, next: NextFunction) =>
    vendorController.update(req, res, next),
);
router.delete("/:id", (req: Request, res: Response, next: NextFunction) =>
  vendorController.remove(req, res, next),
);

export default router;
