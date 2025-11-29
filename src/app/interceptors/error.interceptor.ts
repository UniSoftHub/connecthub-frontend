import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToastContainer } from '../components/features/toast/toast';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.error('Erro na requisição:', error);

      let errorMessage = 'Ocorreu um erro na requisição';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Não foi possível conectar ao servidor';
      } else if (error.status === 404) {
        errorMessage = 'Recurso não encontrado';
      } else if (error.status === 500) {
        errorMessage = 'Erro interno do servidor';
      }

      // TODO: Mostrar toast com errorMessage
      return throwError(() => error);
    }),
  );
};
