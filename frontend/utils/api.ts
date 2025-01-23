import { getCookie, setCookie } from "cookies-next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface FetchDataOptions extends RequestInit {
  headers?: HeadersInit;
}

async function refreshToken(): Promise<string | null> {
  const token = getCookie("authToken");
  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/authentication/index.php?action=refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    if (data.status === 200) {
      setCookie("authToken", data.data.token, { maxAge: 3600 }); // 1 hr
      return data.data.token;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

export async function fetchData<T = any>(
  endpoint: string,
  method: string = "GET",
  body?: any,
  options: FetchDataOptions = {}
): Promise<T> {
  let token = getCookie("authToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  if (response.status === 401) {
    // Token may have expired; try refreshing
    token = await refreshToken();
    if (token) {
      // Retry original request with refreshed token
      const retryHeaders: HeadersInit = {
        ...headers,
        Authorization: `Bearer ${token}`,
      };

      const retryResponse = await fetch(`${apiBaseUrl}${endpoint}`, {
        method,
        headers: retryHeaders,
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });

      if (retryResponse.ok) {
        return retryResponse.json();
      } else {
        throw new Error(`API error: ${retryResponse.status} - ${await retryResponse.text()}`);
      }
    } else {
      throw new Error("Unauthorized: Token refresh failed");
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}