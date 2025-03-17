type HttpHeaders = Record<string, string>;
type RequestBody = Record<string, unknown> | string | any;
export type FormBody = Record<string, Blob | string | null | File[] | File | object | number>;
type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type HttpRequest = {
  url: string;
  method: Methods;
  headers: HttpHeaders;
  body?: RequestBody | FormData;
  formBody?: FormBody;
  responseType?: 'arraybuffer';
};
type NextFunction = (error?: Error) => void;
export type MiddlewareFunction = (req: HttpRequest, next: NextFunction) => void;

type HttpServiceConfig = {
  middleware?: MiddlewareFunction;
  baseURL: string;
  onUnAuthorized?: () => void;
};

type HttpFailedResponse = {
  status: false;
  message: string;
};

type HttpSuccessResponse<T> = {
  status: true;
  data: T;
  message?: string;
};

type HttpFinalReturnResponseType = 'json' | 'arrayBuffer';

export type HttpResponse<T> = HttpFailedResponse | HttpSuccessResponse<T>;

export class HttpService {
  private readonly defaultHeaders = { 'content-type': 'application/json' };
  private readonly middleware: MiddlewareFunction | null = null;
  private readonly baseURL: string;
  private onUnAuthorized: (() => void) | null = null;

  constructor(config: HttpServiceConfig) {
    this.baseURL = config.baseURL;

    if (config.middleware) {
      this.middleware = config.middleware;
    }

    if (config.onUnAuthorized) {
      this.onUnAuthorized = config.onUnAuthorized;
    }
  }

  get<T>(endpoint: string, headers: HttpHeaders = {}, returnResponseType: HttpFinalReturnResponseType = 'json') {
    return this.request<T>(endpoint, 'GET', headers, undefined, returnResponseType);
  }

  post<T>(endpoint: string, body: RequestBody = {}, headers: HttpHeaders = {}) {
    return this.request<T>(endpoint, 'POST', headers, body);
  }

  put<T>(endpoint: string, body: RequestBody = {}, headers: HttpHeaders = {}) {
    return this.request<T>(endpoint, 'PUT', headers, body);
  }

  patch<T>(endpoint: string, body: RequestBody = {}, headers: HttpHeaders = {}) {
    return this.request<T>(endpoint, 'PATCH', headers, body);
  }

  delete<T>(endpoint: string, body: RequestBody = {}, headers: HttpHeaders = {}) {
    return this.request<T>(endpoint, 'DELETE', headers, body);
  }

  async postForm<T>(endpoint: string, body: FormBody, headers: HttpHeaders = {}): Promise<HttpResponse<T>> {
    try {
      const form = new FormData();

      Object.entries(body).forEach(([key, value]) => {
        // check if value is object and not array and not File
        if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof File)) {
          form.append(key, JSON.stringify(value));
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((file) => form.append(key, file));
          return;
        }

        // Convert number to string before appending
        form.append(key, typeof value === 'number' ? value.toString() : value);
      });

      const request: HttpRequest = {
        url: `${this.baseURL}/${endpoint}`,
        method: 'POST',
        headers,
        body: form,
      };

      if (this.middleware !== null) {
        await new Promise<HttpRequest>((resolve, reject) => {
          this.middleware!(request, (err?: Error) => {
            if (err) {
              return reject(err);
            }
            resolve(request);
          });
        });
      }

      const res = await fetch(`${this.baseURL}/${endpoint}`, {
        method: 'POST',
        headers: { ...request.headers },
        body: form,
      });

      if (res.status === 401) {
        this.onUnAuthorized?.();
      }

      return await res.json();
    } catch (error) {
      if (error instanceof Error) {
        return {
          status: false,
          message: error.message,
        };
      }
      return {
        status: false,
        message: 'Failed To Fetch, Turn on Logging to see what went wrong',
      };
    }
  }

  private async request<T>(
    endpoint: string,
    method: Methods,
    headers: HttpHeaders = {},
    body?: RequestBody,
    responseType: HttpFinalReturnResponseType = 'json'
  ): Promise<HttpResponse<T>> {
    try {
      const request: HttpRequest = {
        url: `${this.baseURL}/${endpoint}`,
        method,
        headers: { ...this.defaultHeaders, ...headers, 'Access-Control-Allow-Origin': '*' },
        body,
      };

      if (this.middleware !== null) {
        await new Promise<HttpRequest>((resolve, reject) => {
          this.middleware!(request, (err?: Error) => {
            if (err) {
              return reject(err);
            }
            resolve(request);
          });
        });
      }

      const res = await HttpService.executeFetch(request);

      if (res.status === 401) {
        this.onUnAuthorized?.();
      }
      if (!res.ok) {
        throw new Error((await res.json()).message);
      }

      return responseType === 'json' ? await res.json() : { status: true, data: await res.blob() };
    } catch (error) {
      if (error instanceof Error) {
        return {
          status: false,
          message: error.message,
        };
      }
      return {
        status: false,
        message: 'Failed To Fetch, Check your internet connection',
      };
    }
  }

  private static executeFetch(request: HttpRequest) {
    const { url, body, method, headers } = request;

    return fetch(url, {
      method,
      headers,
      body: body && typeof body === 'string' ? body : body ? JSON.stringify(body) : undefined,
    });
  }
}
