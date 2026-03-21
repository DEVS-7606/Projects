export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
