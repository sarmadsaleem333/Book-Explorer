import { searchBooks } from "../services/book.service.js";

const parsePositiveInteger = (value, fallback, maximum) => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, maximum);
};

export const getBooks = async (req, res, next) => {
  try {
    const query = String(req.query.q || req.query.query || "").trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "A search query is required. Use the q parameter.",
      });
    }

    const page = parsePositiveInteger(req.query.page, 1, 1000);
    const limit = parsePositiveInteger(req.query.limit, 12, 40);
    const result = await searchBooks({ query, page, limit });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return next(error);
  }
};
