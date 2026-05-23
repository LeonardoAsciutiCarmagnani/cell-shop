// Estrutura padrão de erro exigida pelo seu specs.md
export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiResponseError {
  error: ApiErrorPayload;
}

// Classe Utilitária para padronizar as respostas de Erro no Back-end
export class ApiResponse {
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
