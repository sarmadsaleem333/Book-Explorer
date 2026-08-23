import Cover from "../components/Cover.jsx";
import Rating from "../components/Rating.jsx";

export default function DetailsPage({ book, onBack }) {
  return (
    <main className="details-page min-h-[60vh]">
      <button className="back-button" type="button" onClick={onBack}>
        ← Back to browse
      </button>
      <section className="details-layout">
        <Cover book={book} large />
        <div className="details-copy">
          <p className="eyebrow">Book details</p>
          <h1>{book.title}</h1>
          <p className="detail-author">
            {book.authors?.join(", ") || "Unknown author"}
          </p>
          <div className="detail-rating">
            <Rating book={book} />
          </div>
          <p className="detail-description">
            {book.description || "No description available for this book."}
          </p>
          <dl className="metadata">
            <div>
              <dt>Publication</dt>
              <dd>{book.publishedYear || "Unknown"}</dd>
            </div>
            <div>
              <dt>Publisher</dt>
              <dd>{book.publisher || "Unknown"}</dd>
            </div>
            <div>
              <dt>ISBN</dt>
              <dd>{book.isbn || "Not available"}</dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>{book.language || "Not available"}</dd>
            </div>
          </dl>
          {book.categories?.length > 0 && (
            <div className="categories">
              <dt>Categories</dt>
              <div>
                {book.categories.map((category) => (
                  <span key={category}>{category}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
