import axios from "axios";

const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1";

const googleBooksClient = axios.create({
  baseURL: GOOGLE_BOOKS_URL,
  timeout: 10000,
});

const getApiParams = () => {
  const params = {};

  if (process.env.GOOGLE_BOOKS_API_KEY) {
    params.key = process.env.GOOGLE_BOOKS_API_KEY;
  }

  return params;
};

export const cleanIsbn = (isbn) => {
  if (!isbn) {
    return "";
  }

  return String(isbn)
    .replace(/[^0-9Xx]/g, "")
    .toUpperCase();
};

const hasRating = (book) => {
  const info = book?.volumeInfo || {};
  return Number.isFinite(info.averageRating) && Number(info.ratingsCount) > 0;
};

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const scoreCandidate = (book, { title, author, isbn }) => {
  const info = book?.volumeInfo || {};
  const candidateTitle = normalizeText(info.title);
  const expectedTitle = normalizeText(title);
  const candidateAuthors = (info.authors || []).map(normalizeText).join(" ");
  const expectedAuthor = normalizeText(author);
  let score = 0;

  if (candidateTitle === expectedTitle) {
    score += 70;
  } else if (
    candidateTitle.includes(expectedTitle) ||
    expectedTitle.includes(candidateTitle)
  ) {
    score += 35;
  }

  if (expectedAuthor && candidateAuthors.includes(expectedAuthor)) {
    score += 45;
  }

  const identifiers = (info.industryIdentifiers || []).map((item) =>
    cleanIsbn(item.identifier),
  );

  if (isbn && identifiers.includes(isbn)) {
    score += 80;
  }

  if (hasRating(book)) {
    score += 100 + Math.min(Number(info.ratingsCount), 10000) / 10000;
  }

  return score;
};

const selectCandidate = (items, details) => {
  const candidates = Array.isArray(items) ? items : [];

  candidates.forEach((book) => {
    const info = book.volumeInfo || {};
    console.log({
      candidateTitle: info.title || "",
      candidateAuthors: info.authors || [],
      averageRating: info.averageRating ?? null,
      ratingsCount: info.ratingsCount ?? 0,
      score: scoreCandidate(book, details),
    });
  });

  const rated = candidates.filter(hasRating);
  const pool = rated.length ? rated : candidates;
  const selected = pool
    .map((book) => ({ book, score: scoreCandidate(book, details) }))
    .sort((a, b) => b.score - a.score)[0]?.book;

  if (selected) {
    console.log({
      selectedGoogleBook: selected.id,
      selectedTitle: selected.volumeInfo?.title || "",
      finalRating: selected.volumeInfo?.averageRating ?? null,
      finalRatingsCount: selected.volumeInfo?.ratingsCount ?? 0,
    });
  }

  return selected || null;
};

const requestVolumes = async (params) => {
  const response = await googleBooksClient.get("/volumes", {
    params: {
      ...params,
      maxResults: 40,
      ...getApiParams(),
    },
  });

  console.log({
    googleQuery: params.q,
    googleResults: response.data.items?.length || 0,
  });
  return response.data.items || [];
};

export const findByIsbn = async (isbn, details) => {
  const normalizedIsbn = cleanIsbn(isbn);

  if (!normalizedIsbn) {
    return null;
  }

  try {
    console.log({
      openLibraryIsbn: normalizedIsbn,
      googleIsbnQuery: normalizedIsbn,
    });
    const items = await requestVolumes({ q: `isbn:${normalizedIsbn}` });
    return selectCandidate(items, { ...details, isbn: normalizedIsbn });
  } catch (error) {
    console.error(`Google Books ISBN search failed:`, error.message);

    return null;
  }
};

export const findByTitleAndAuthor = async ({ title, author }) => {
  if (!title) {
    return null;
  }

  try {
    const query = author
      ? `intitle:${title} inauthor:${author}`
      : `intitle:${title}`;

    const items = await requestVolumes({ q: query });
    return selectCandidate(items, { title, author, isbn: "" });
  } catch (error) {
    console.error(`Google Books title search failed:`, error.message);

    return null;
  }
};

export const findGoogleBook = async ({ isbn, title, author }) => {
  const details = { title, author, isbn: cleanIsbn(isbn) };

  if (isbn) {
    const book = await findByIsbn(isbn, details);

    if (book && hasRating(book)) {
      return book;
    }
  }

  return findByTitleAndAuthor({ title, author });
};
