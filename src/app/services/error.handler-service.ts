import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private errorTranslations: { [key: string]: string } = {
    // Auth errors
    'Invalid Credentials': 'Credenciais inválidas. Verifique seu e-mail e senha.',
    'Invalid credentials': 'Credenciais inválidas. Verifique seu e-mail e senha.',
    INVALID_CREDENTIALS: 'Credenciais inválidas. Verifique seu e-mail e senha.',
    'User already exists': 'Este e-mail já está cadastrado.',
    'Email already in use': 'Este e-mail já está em uso.',
    'User not found': 'Usuário não encontrado.',
    Unauthorized: 'Acesso não autorizado. Faça login novamente.',
    'Token expired': 'Sua sessão expirou. Faça login novamente.',
    'Invalid token': 'Token inválido. Faça login novamente.',

    // Validation errors
    'Validation failed': 'Erro de validação. Verifique os campos preenchidos.',
    'Invalid email format': 'Formato de e-mail inválido.',
    'Password too weak': 'Senha muito fraca. Use uma senha mais segura.',
    'Required field': 'Este campo é obrigatório.',

    // Server errors
    'Internal server error': 'Erro interno do servidor. Tente novamente mais tarde.',
    'Service unavailable': 'Serviço temporariamente indisponível. Tente novamente.',
    'Bad gateway': 'Erro de comunicação com o servidor.',
    'Gateway timeout': 'Tempo limite de conexão excedido.',

    // Network errors
    'Network error': 'Erro de conexão. Verifique sua internet.',
    'Connection refused': 'Não foi possível conectar ao servidor.',
    Timeout: 'A requisição demorou muito. Tente novamente.',

    // Resource errors
    'Not found': 'Recurso não encontrado.',
    Forbidden: 'Você não tem permissão para acessar este recurso.',
    Conflict: 'Conflito ao processar a requisição.',

    // Generic
    'Unknown error': 'Erro desconhecido. Tente novamente.',
  };

  translateError(message: string): string {
    if (!message) {
      return 'Erro desconhecido. Tente novamente.';
    }

    const exactMatch = this.errorTranslations[message];
    if (exactMatch) {
      return exactMatch;
    }

    const lowerMessage = message.toLowerCase();
    for (const [key, value] of Object.entries(this.errorTranslations)) {
      if (lowerMessage.includes(key.toLowerCase())) {
        return value;
      }
    }

    return message;
  }

  extractErrorMessage(error: any): string {
    if (error.error?.data?.message) {
      return this.translateError(error.error.data.message);
    }

    if (error.error?.message) {
      return this.translateError(error.error.message);
    }

    if (error.message) {
      return this.translateError(error.message);
    }

    if (error.status) {
      return this.getErrorByStatus(error.status);
    }

    return 'Erro ao processar requisição. Tente novamente.';
  }

  private getErrorByStatus(status: number): string {
    const statusMessages: { [key: number]: string } = {
      400: 'Requisição inválida. Verifique os dados enviados.',
      401: 'Acesso não autorizado. Faça login novamente.',
      403: 'Você não tem permissão para acessar este recurso.',
      404: 'Recurso não encontrado.',
      409: 'Conflito ao processar a requisição.',
      422: 'Dados inválidos. Verifique as informações fornecidas.',
      429: 'Muitas tentativas. Aguarde alguns instantes.',
      500: 'Erro interno do servidor. Tente novamente mais tarde.',
      502: 'Erro de comunicação com o servidor.',
      503: 'Serviço temporariamente indisponível.',
      504: 'Tempo limite de conexão excedido.',
    };

    return statusMessages[status] || `Erro HTTP ${status}. Tente novamente.`;
  }

  addTranslation(key: string, translation: string): void {
    this.errorTranslations[key] = translation;
  }

  addTranslations(translations: { [key: string]: string }): void {
    this.errorTranslations = { ...this.errorTranslations, ...translations };
  }
}
