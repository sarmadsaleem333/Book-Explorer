import { cleanIsbn, findGoogleBook } from "./googleBooks.service.js";
import { searchOpenLibrary } from "./openLibrary.service.js";
import { normalizeBook } from "../utils/normalizeBook.js";

export const searchBooks = async ({ query, page = 1, limit = 12 }) => {
  const openLibraryResult = await searchOpenLibrary({ query, page, limit });
  const docs = Array.isArray(openLibraryResult.docs)
    ? openLibraryResult.docs
    : [];
  const googleBookCache = new Map();

  const books = await Promise.all(
    docs.map(async (openBook) => {
      const isbn =
        (openBook.isbn || [])
          .map(cleanIsbn)
          .find((value) => value.length === 13) || "";
      const title = openBook.title || "";
      const author = openBook.author_name?.[0] || "";
      const cacheKey = `${isbn}|${title}|${author}`;
      let googleBookPromise = googleBookCache.get(cacheKey);

      if (!googleBookPromise) {
        googleBookPromise = findGoogleBook({ isbn, title, author });
        googleBookCache.set(cacheKey, googleBookPromise);
      }

      const googleBook = await googleBookPromise;

      return normalizeBook(openBook, googleBook);
    }),
  );

  return {
    query,
    page,
    limit,
    total: Number(openLibraryResult.numFound) || 0,
    books,
  };
};
