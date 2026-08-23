export default function Rating({ book }) {
  if (book.rating == null) {
    return <span className="no-rating">No rating yet</span>;
  }

  return (
    <span className="rating">
      ★ {book.rating.toFixed(1)}{" "}
      {book.ratingsCount > 0 && (
        <small>{book.ratingsCount.toLocaleString()} ratings</small>
      )}
    </span>
  );
}
