const BASE = import.meta.env.VITE_API_URL ?? 'https://petstore.swagger.io/v2';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function request(path, { method = 'GET', body, params } = {}) {
  const query = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v))
    : '';

  let res;
  try {
    res = await fetch(BASE + path + query, {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Serverga ulanib bo'lmadi. Internetni tekshiring");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data?.message || 'Xatolik yuz berdi');
  return data;
}