export interface ApiErrorResponse {
  statusCode?: number;
  message?: string;
  detailed?: string | null;
  errors?: Record<string, string[]>;
}

export interface NormalizedError {
  status: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
}
