export default function Cover({ book, large = false }) {
  return (
    <div className={`cover ${large ? "cover-large" : ""}`}>
      {book.coverUrl ? (
        <img src={book.coverUrl} alt={`Cover of ${book.title}`} />
      ) : (
        <span>No cover</span>
      )}
    </div>
  );
}
