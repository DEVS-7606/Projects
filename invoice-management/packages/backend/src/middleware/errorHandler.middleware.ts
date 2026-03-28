import type { NextFunction, Request, Response } from "express";
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

  // Unexpected errors — don't leak internals in production
  console.error("[Unhandled Error]", err);
  const isDev = process.env.NODE_ENV !== "production";
  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message:
      isDev && err instanceof Error
        ? err.message
        : "An unexpected error occurred",
  });
}
