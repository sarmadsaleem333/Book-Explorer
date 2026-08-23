import BookCard from "../components/BookCard.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import Pagination from "../components/Pagination.jsx";
import SearchBar from "../components/SearchBar.jsx";

const PAGE_SIZE = 12;

export default function BooksPage({
  search,
  setSearch,
  books,
  total,
  page,
  status,
  error,
  onSearch,
  onPage,
  onOpen,
  onRetry,
}) {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Open a new chapter</p>
          <h1>
            Find your next <i>book.</i>
          </h1>
          <p>Explore books from Open Library with ratings from Google Books.</p>
        </div>
        <span className="hero-index">01 / 04</span>
      </section>
      <SearchBar
        value={search}
        onChange={setSearch}
        onSubmit={onSearch}
        loading={status === "loading"}
      />
      {status === "ready" && (
        <div className="result-bar">
          <span>{total.toLocaleString()} books found</span>
          <span>
            Page {page} of {Math.max(1, Math.ceil(total / PAGE_SIZE))}
          </span>
        </div>
      )}
      {status === "loading" && <LoadingGrid />}
      {status === "error" && (
        <div className="state state-error">
          <h2>Something went wrong</h2>
          <p>Unable to load books right now. Please try again.</p>
          <button type="button" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
      {status === "ready" && books.length === 0 && (
        <div className="state">
          <h2>No books found</h2>
          <p>Try searching with a different title, author, or keyword.</p>
        </div>
      )}
      {status === "ready" && books.length > 0 && (
        <>
          <div className="book-grid">
            {books.map((book) => (
              <BookCard book={book} onOpen={onOpen} key={book.id} />
            ))}
          </div>
          <Pagination page={page} total={total} onChange={onPage} />
        </>
      )}
      {error && status !== "error" && <p className="inline-error">{error}</p>}
    </>
  );
}
