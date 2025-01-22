const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchData(endpoint:string, options = {}) {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, options);

    if(!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
}