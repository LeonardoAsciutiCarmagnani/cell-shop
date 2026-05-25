// Estrutura padrão de erro exigida pelo seu specs.md
export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiResponseError {
  error: ApiErrorPayload;
}

export class ApiResponse {
  static ok<T>(payload: T): T {
    return payload;
  }

  static created<T>(payload: T): T {
    return payload;
  }

  static badRequest(message: string, details?: Record<string, string[]>): ApiResponseError {
    return this.error('VALIDATION_ERROR', message, details);
  }

  static unprocessable(code: string, message: string): ApiResponseError {
    return this.error(code, message);
  }

  static serviceUnavailable(code: string, message: string): ApiResponseError {
    return this.error(code, message);
  }

  static error(
    code: string,
    message: string,
    details?: Record<string, string[]>,
  ): ApiResponseError {
    return {
      error: {
        code,
        message,
        ...(details && { details }),
      },
    };
  }
}
