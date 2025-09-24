import { HttpInterceptorFn } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

interface CurrentUser {
  token?: string;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const raw = localStorage.getItem('currentUser');
  let token: string | undefined;

  if (raw) {
    try {
      const currentUser: CurrentUser = JSON.parse(raw);

      if (currentUser?.token) {
        const payload: any = jwtDecode(currentUser.token);
        const now = Math.floor(Date.now() / 1000);

        if (!payload.exp || payload.exp > now) {
          token = currentUser.token;
        } else {
          console.warn('Token expirado, limpando storage');
          localStorage.removeItem('currentUser');
        }
      }
    } catch (err) {
      console.error('Erro ao parsear currentUser do localStorage', err);
      localStorage.removeItem('currentUser');
    }
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
