export default function Rating({ book }) {
  if (book.rating == null || !book.ratingsCount) {
    return <span className="no-rating">No rating yet</span>;
  }

  return (
    <span className="rating">
      ★ {book.rating.toFixed(1)}{" "}
      <small>{book.ratingsCount.toLocaleString()} ratings</small>
    </span>
  );
}
