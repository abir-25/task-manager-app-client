import { getJWTToken } from '@/lib/utils';
import { HttpService, MiddlewareFunction } from './httpModule';

const jwtTokenMiddleware: MiddlewareFunction = async (req, next) => {
  try {
    const token = await getJWTToken();
    if (!token) return next();
    req.headers['Authorization'] = `Bearer ${token}`;
    return next();
  } catch (error) {
    return next(error as Error);
  }
};

export const apiPublicClient = new HttpService({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

export const apiPrivateClient = new HttpService({
  middleware: jwtTokenMiddleware,
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});
