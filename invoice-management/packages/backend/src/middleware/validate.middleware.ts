import type { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

type ValidateTarget = "body" | "query";

export function validate(schema: ZodSchema, target: ValidateTarget = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Validation failed",
        details: errors,
      });
      return;
    }

    // Replace with coerced/parsed values (e.g. string -> number for query params)
    if (target === "query") {
      Object.assign(req.query, result.data);
    } else {
      req[target] = result.data;
    }
    next();
  };
}
