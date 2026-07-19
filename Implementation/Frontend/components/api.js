const API_BASE_URL = "http://localhost:5041/api";

function getToken() {
  return localStorage.getItem("token");
}

async function parseResponseBody(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function getErrorMessage(payload, fallback) {
  return payload?.Message || payload?.message || payload?.ErrorMessage || payload?.error || fallback;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
      ...(options.headers || {})
    }
  });

  const payload = await parseResponseBody(response);

  if (response.status === 403) {
    window.location.href = "/pages/errors/error-403.html";
    throw new Error(getErrorMessage(payload, "دسترسی غیرمجاز"));
  }

  if (response.status === 400) {
    throw new Error(getErrorMessage(payload, "خطای اعتبارسنجی"));
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `خطای سرور (${response.status})`));
  }

  return payload;
}

window.apiRequest = apiRequest;
window.apiGet = (path) => apiRequest(path, { method: "GET" });
