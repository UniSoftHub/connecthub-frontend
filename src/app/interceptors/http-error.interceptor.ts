import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorHandlerService } from '../services/error.handler-service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', {
        status: error.status,
        message: error.message,
        error: error.error,
      });

      const translatedMessage = errorHandler.extractErrorMessage(error);

      const processedError = {
        ...error,
        error: {
          ...error.error,
          translatedMessage,
          originalMessage: error.error?.data?.message || error.error?.message || error.message,
        },
      };

      if (error.status === 0) {
        processedError.error.translatedMessage = 'Erro de conexão. Verifique sua internet.';
      }

      return throwError(() => processedError);
    }),
  );
};
