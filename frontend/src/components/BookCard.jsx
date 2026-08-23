import Cover from "./Cover.jsx";
import Rating from "./Rating.jsx";

export default function BookCard({ book, onOpen }) {
  return (
    <article className="book-card transition-colors duration-200">
      <button
        className="book-link rounded-sm"
        type="button"
        onClick={() => onOpen(book)}
        aria-label={`View details for ${book.title}`}
      >
        <Cover book={book} />
        <div className="card-copy">
          <div className="card-meta">
            <span>{book.publishedYear || "Year unknown"}</span>
            <Rating book={book} />
          </div>
          <h2>{book.title}</h2>
          <p className="author">
            {book.authors?.join(", ") || "Unknown author"}
          </p>
          <p className="card-description">
            {book.description || "No description available."}
          </p>
        </div>
      </button>
    </article>
  );
}
