export default function LoadingGrid() {
  return (
    <div className="book-grid">
      {Array.from({ length: 8 }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-cover" />
          <div className="skeleton-lines" />
        </div>
      ))}
    </div>
  );
}
