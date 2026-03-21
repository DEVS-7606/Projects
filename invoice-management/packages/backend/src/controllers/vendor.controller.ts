import type { Request, Response, NextFunction } from "express";
import { VendorService } from "../services/vendor.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

const vendorService = new VendorService();

export class VendorController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const vendors = await vendorService.getVendors(authReq.userId);
      res.json({ data: vendors });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const vendor = await vendorService.getVendorById(
        req.params.id,
        authReq.userId,
      );
      res.json({ data: vendor });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const vendor = await vendorService.createVendor(authReq.userId, req.body);
      res.status(201).json({ data: vendor });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const vendor = await vendorService.updateVendor(
        req.params.id,
        authReq.userId,
        req.body,
      );
      res.json({ data: vendor });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      await vendorService.deleteVendor(req.params.id, authReq.userId);
      res.json({ data: { message: "Vendor deleted successfully" } });
    } catch (error) {
      next(error);
    }
  }
}
