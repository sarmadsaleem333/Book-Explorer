const API_URL = "http://localhost:5000/api/books";

export async function getBooks({ query, page = 1, limit = 12 }) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: String(limit),
  });
  const response = await fetch(`${API_URL}?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load books.");
  }

  return data;
}
