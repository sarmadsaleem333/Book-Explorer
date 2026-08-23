import axios from "axios";

const OPEN_LIBRARY_URL = "https://openlibrary.org/search.json";

const openLibraryClient = axios.create({
  baseURL: OPEN_LIBRARY_URL,
  timeout: 10000,
  headers: {
    "User-Agent": process.env.OPEN_LIBRARY_USER_AGENT || "BookExplorer/1.0",
  },
});

export const searchOpenLibrary = async ({ query, page = 1, limit = 12 }) => {
  if (!query?.trim()) {
    throw new Error("Open Library search query cannot be empty.");
  }

  const fields = [
    "key",
    "title",
    "author_name",
    "first_publish_year",
    "isbn",
    "cover_i",
    "publisher",
    "subject",
    "language",
  ].join(",");

  const response = await openLibraryClient.get("", {
    params: {
      q: query,
      page,
      limit: Math.min(limit, 40),
      fields,
    },
  });

  return response.data;
};
