export default function SearchBar({ value, onChange, onSubmit, loading }) {
  return (
    <form className="search-bar rounded-sm" onSubmit={onSubmit}>
      <label htmlFor="book-search">Search books</label>
      <div className="search-input-wrap">
        <input
          id="book-search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by title, author, or keyword..."
        />
        <button
          className="transition-colors duration-200"
          type="submit"
          disabled={loading}
        >
          {loading ? "Searching" : "Search"}
        </button>
      </div>
    </form>
  );
}
