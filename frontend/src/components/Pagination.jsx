const PAGE_SIZE = 12;

export default function Pagination({ page, total, onChange }) {
  const pageCount = Math.ceil(total / PAGE_SIZE);
  if (pageCount <= 1) return null;

  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  const pages = Array.from(
    { length: Math.min(5, pageCount) },
    (_, index) => start + index,
  );

  return (
    <nav className="pagination" aria-label="Book results pages">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>
      {pages.map((item) => (
        <button
          className={item === page ? "current" : ""}
          type="button"
          onClick={() => onChange(item)}
          key={item}
          aria-current={item === page ? "page" : undefined}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
      >
        Next
      </button>
    </nav>
  );
}
