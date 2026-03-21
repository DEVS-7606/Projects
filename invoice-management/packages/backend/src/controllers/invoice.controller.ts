import type { Request, Response, NextFunction } from "express";
import { InvoiceService } from "../services/invoice.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import type { InvoiceFilters } from "@invoice-management/shared";

const invoiceService = new InvoiceService();

export class InvoiceController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      // query already validated + coerced by validate middleware
      const result = await invoiceService.getInvoices(
        authReq.userId,
        req.query as unknown as InvoiceFilters,
      );
      res.json({ data: result });
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
      const invoice = await invoiceService.getInvoiceById(
        req.params.id,
        authReq.userId,
      );
      res.json({ data: invoice });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const invoice = await invoiceService.createInvoice(
        authReq.userId,
        req.body,
      );
      res.status(201).json({ data: invoice });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const invoice = await invoiceService.updateInvoice(
        req.params.id,
        authReq.userId,
        req.body,
      );
      res.json({ data: invoice });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      await invoiceService.deleteInvoice(req.params.id, authReq.userId);
      res.json({ data: { message: "Invoice deleted successfully" } });
    } catch (error) {
      next(error);
    }
  }

  async getStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const stats = await invoiceService.getDashboardStats(authReq.userId);
      res.json({ data: stats });
    } catch (error) {
      next(error);
    }
  }
}
