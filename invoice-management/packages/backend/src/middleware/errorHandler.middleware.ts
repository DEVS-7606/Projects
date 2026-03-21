import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
    });
    return;
  }

  // Unexpected errors — don't leak internals
  console.error("[Unhandled Error]", err);
  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
  });
}
