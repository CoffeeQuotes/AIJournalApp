const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface FetchDataOptions extends RequestInit {
  headers?: HeadersInit;
}

export async function fetchData<T = any>(
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string,
  options: FetchDataOptions = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}