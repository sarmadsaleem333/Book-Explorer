const getOpenLibraryIsbn = (book) => {
  if (!Array.isArray(book?.isbn)) {
    return "";
  }

  const isbn13 = book.isbn.find(
    (isbn) => String(isbn).replace(/[^0-9Xx]/g, "").length === 13,
  );

  return String(isbn13 || book.isbn[0] || "")
    .replace(/[^0-9Xx]/g, "")
    .toUpperCase();
};

const getOpenLibraryCover = (book) => {
  if (!book?.cover_i) {
    return "";
  }

  return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
};

const getGoogleCover = (book) => {
  return (
    book?.volumeInfo?.imageLinks?.thumbnail ||
    book?.volumeInfo?.imageLinks?.smallThumbnail ||
    ""
  );
};

const getGoogleIsbn = (book) => {
  const identifiers = book?.volumeInfo?.industryIdentifiers || [];

  const isbn13 = identifiers.find((item) => item.type === "ISBN_13");

  const isbn10 = identifiers.find((item) => item.type === "ISBN_10");

  return isbn13?.identifier || isbn10?.identifier || "";
};

const getYear = (openBook, googleBook) => {
  if (openBook?.first_publish_year) {
    return openBook.first_publish_year;
  }

  const date = googleBook?.volumeInfo?.publishedDate;

  if (!date) {
    return null;
  }

  const year = parseInt(date.substring(0, 4), 10);

  return Number.isNaN(year) ? null : year;
};

export const normalizeBook = (openBook, googleBook) => {
  const googleInfo = googleBook?.volumeInfo || {};

  const isbn = getOpenLibraryIsbn(openBook) || getGoogleIsbn(googleBook);

  const authors = openBook?.author_name || googleInfo.authors || [];

  return {
    id: openBook?.key?.replace("/works/", "") || googleBook?.id,

    title: openBook?.title || googleInfo.title || "Unknown title",

    authors,

    description: googleInfo.description || "",

    coverUrl: getOpenLibraryCover(openBook) || getGoogleCover(googleBook),

    publishedYear: getYear(openBook, googleBook),

    isbn,

    rating: Number.isFinite(googleInfo.averageRating)
      ? googleInfo.averageRating
      : null,

    ratingsCount: Number.isFinite(googleInfo.ratingsCount)
      ? googleInfo.ratingsCount
      : 0,

    publisher: openBook?.publisher?.[0] || googleInfo.publisher || "",

    categories: googleInfo.categories || openBook?.subject?.slice(0, 5) || [],

    language: openBook?.language?.[0] || "",

    sources: {
      openLibrary: openBook?.key || null,

      googleBooks: googleBook?.id || null,
    },
  };
};
