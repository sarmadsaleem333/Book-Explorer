import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { getBooks } from "./api/books.js";
import Header from "./components/Header.jsx";
import BooksPage from "./pages/BooksPage.jsx";
import DetailsPage from "./pages/DetailsPage.jsx";
import "./styles.css";

const PAGE_SIZE = 12;

function readBookFromSession(id) {
  if (!id) return null;
  const savedBook = sessionStorage.getItem(`book:${id}`);
  return savedBook ? JSON.parse(savedBook) : null;
}

function App() {
  const initialParams = new URLSearchParams(window.location.search);
  const initialQuery = initialParams.get("q") || "the hobbit";
  const initialPage = Number(initialParams.get("page")) || 1;
  const initialBookId =
    window.location.pathname.match(/^\/books\/([^/]+)/)?.[1];
  const [search, setSearch] = useState(initialQuery);
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(() =>
    readBookFromSession(initialBookId),
  );

  async function loadBooks(query, requestedPage) {
    setStatus("loading");
    setError("");

    try {
      const data = await getBooks({
        query,
        page: requestedPage,
        limit: PAGE_SIZE,
      });
      setBooks(data.books || []);
      setTotal(data.total || 0);
      setPage(requestedPage);
      setStatus("ready");
      window.history.pushState(
        {},
        "",
        `/books?q=${encodeURIComponent(query)}&page=${requestedPage}`,
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
      setError("Unable to load books right now. Please try again.");
    }
  }

  useEffect(() => {
    if (window.location.pathname.startsWith("/books") && !initialBookId) {
      loadBooks(initialQuery, initialPage);
    }

    function handleHistoryChange() {
      const bookId = window.location.pathname.match(/^\/books\/([^/]+)/)?.[1];
      setSelectedBook(readBookFromSession(bookId));
    }

    window.addEventListener("popstate", handleHistoryChange);
    return () => window.removeEventListener("popstate", handleHistoryChange);
  }, []);

  function goBrowse() {
    setSelectedBook(null);
    window.history.pushState({}, "", "/books");
  }

  function openBook(book) {
    sessionStorage.setItem(`book:${book.id}`, JSON.stringify(book));
    setSelectedBook(book);
    window.history.pushState({}, "", `/books/${book.id}`);
    window.scrollTo({ top: 0 });
  }

  function submitSearch(event) {
    event.preventDefault();
    const query = search.trim();
    if (query) loadBooks(query, 1);
  }

  return (
    <div className="page-shell min-h-screen bg-paper px-4 sm:px-6 lg:px-8">
      <Header onBrowse={goBrowse} />
      {selectedBook ? (
        <DetailsPage book={selectedBook} onBack={goBrowse} />
      ) : (
        <BooksPage
          search={search}
          setSearch={setSearch}
          books={books}
          total={total}
          page={page}
          status={status}
          error={error}
          onSearch={submitSearch}
          onPage={(nextPage) => loadBooks(search.trim(), nextPage)}
          onOpen={openBook}
          onRetry={() => loadBooks(search.trim(), page)}
        />
      )}
      <footer id="about">
        <span>Book Explorer</span>
        <span>Live data from Open Library and Google Books</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
