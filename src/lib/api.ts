/**
 * AllDayCafe SaaS API Client Layer
 * 
 * Features:
 * - Automatically configured with credentials: 'include' for secure httpOnly JWT cookies.
 * - Auto-injects UUID v4 'Idempotency-Key' on write operations (POST, PUT, PATCH, DELETE).
 * - Catches HTTP 429 Too Many Requests, parses 'Retry-After' header and notifies UI listeners.
 */

export interface RequestOptions extends RequestInit {
  idempotencyKey?: string;
  skipIdempotency?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface RateLimitEvent {
  retryAfterSeconds: number;
  endpoint: string;
  timestamp: number;
}

export type RateLimitListener = (event: RateLimitEvent) => void;

export class ApiError extends Error {
  public status: number;
  public data: unknown;
  public retryAfterSeconds?: number;

  constructor(message: string, status: number, data?: unknown, retryAfterSeconds?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

class ApiClient {
  private baseUrl: string;
  private rateLimitListeners: Set<RateLimitListener> = new Set();

  constructor(baseUrl = '') {
    // Falls back to VITE_API_BASE_URL or relative ''
    this.baseUrl = baseUrl || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '';
  }

  /**
   * Subscribe to HTTP 429 Rate Limit notifications for UI toasts/banners
   */
  public onRateLimit(listener: RateLimitListener): () => void {
    this.rateLimitListeners.add(listener);
    return () => {
      this.rateLimitListeners.delete(listener);
    };
  }

  private notifyRateLimit(retryAfterSeconds: number, endpoint: string): void {
    const event: RateLimitEvent = {
      retryAfterSeconds,
      endpoint,
      timestamp: Date.now(),
    };
    this.rateLimitListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in rate limit listener:', err);
      }
    });
  }

  /**
   * Core request dispatcher with interceptors
   */
  public async request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`, window.location.origin);

    // Attach search parameters if specified
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const method = (options.method || 'GET').toUpperCase();
    const headers = new Headers(options.headers || {});

    // Ensure JSON content-type if body is an object and not already specified
    if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
      headers.set('Content-Type', 'application/json');
    }

    // Attach current user session headers for authentication/RBAC
    if (typeof window !== 'undefined') {
      try {
        const sessionStr = localStorage.getItem('alldaycafe_user_session');
        const role = localStorage.getItem('cafe_user_role');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (session?.role && !headers.has('x-user-role')) headers.set('x-user-role', session.role);
          if (session?.id && !headers.has('x-user-id')) headers.set('x-user-id', session.id);
          if (session?.email && !headers.has('x-user-email')) headers.set('x-user-email', session.email);
          if (session?.name && !headers.has('x-user-name')) headers.set('x-user-name', session.name);
          if (!headers.has('x-tenant-id')) headers.set('x-tenant-id', session.tenantId || 'tenant_default');
        } else if (role && !headers.has('x-user-role')) {
          headers.set('x-user-role', role);
          headers.set('x-tenant-id', 'tenant_default');
        }
      } catch {
        // Fallback silently if storage read fails
      }
    }

    // Interceptor: Auto-inject Idempotency-Key for write operations
    const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    if (isWriteOperation && !options.skipIdempotency && !headers.has('Idempotency-Key')) {
      const idempotencyKey = options.idempotencyKey || (typeof crypto !== 'undefined' ? crypto.randomUUID() : `idemp-${Date.now()}`);
      headers.set('Idempotency-Key', idempotencyKey);
    }

    // Set standard SaaS request options (credentials: include for httpOnly cookies)
    const requestConfig: RequestInit = {
      ...options,
      method,
      headers,
      credentials: 'include', // Automatically passes & stores JWT httpOnly cookies
    };

    let response: Response;
    try {
      response = await fetch(url.toString(), requestConfig);
    } catch (err: unknown) {
      throw new ApiError(
        err instanceof Error ? err.message : 'Error de conexión de red',
        0,
        null
      );
    }

    // Interceptor: HTTP 429 Too Many Requests with Retry-After header
    if (response.status === 429) {
      const retryAfterHeader = response.headers.get('Retry-After');
      let retryAfterSeconds = 60; // Default 60s fallback

      if (retryAfterHeader) {
        const parsed = parseInt(retryAfterHeader, 10);
        if (!isNaN(parsed)) {
          retryAfterSeconds = parsed;
        } else {
          // If given as an HTTP date
          const dateDiff = Math.max(1, Math.round((new Date(retryAfterHeader).getTime() - Date.now()) / 1000));
          if (!isNaN(dateDiff)) retryAfterSeconds = dateDiff;
        }
      }

      this.notifyRateLimit(retryAfterSeconds, endpoint);

      let errorData: unknown = null;
      try {
        errorData = await response.json();
      } catch {
        // ignore JSON parse error on 429
      }

      throw new ApiError(
        `Límite de solicitudes excedido. Intenta nuevamente en ${retryAfterSeconds} segundos.`,
        429,
        errorData,
        retryAfterSeconds
      );
    }

    // Handle generic non-2xx HTTP errors
    if (!response.ok) {
      let errorData: unknown = null;
      try {
        errorData = await response.json();
      } catch {
        // ignore parse error
      }
      throw new ApiError(
        response.statusText || `Error HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    return (await response.json()) as T;
  }

  // Convenience Methods
  public get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const api = new ApiClient();
