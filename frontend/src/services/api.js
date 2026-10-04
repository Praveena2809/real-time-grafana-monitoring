// GrafanaShop API Client
// Connects to the monitored FastAPI backend

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchProducts() {
  const url = `${API_BASE}/products`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: Received HTTP ${response.status} from backend`);
    }

    const data = await response.json();
    return {
      success: true,
      products: data.products || [],
      count: data.count || 0,
    };
  } catch (error) {
    console.error('[GrafanaShop API] Failed to fetch products:', error);
    return {
      success: false,
      error: error.message || 'Unable to connect to FastAPI backend',
      products: [],
      count: 0,
    };
  }
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      return { online: true, status: data.status };
    }
    return { online: false, status: 'error' };
  } catch (err) {
    return { online: false, status: 'offline' };
  }
}

export { API_BASE };
