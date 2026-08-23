export default function Header({ onBrowse }) {
  function browse(event) {
    event.preventDefault();
    onBrowse();
  }

  return (
    <header className="site-header px-1 sm:px-2">
      <a className="brand" href="/books" onClick={browse}>
        Book <i>Explorer</i>
      </a>
      <nav className="tracking-[0.14em]" aria-label="Primary navigation">
        <a href="/books" onClick={browse}>
          Browse
        </a>
        <a href="#about">About</a>
      </nav>
    </header>
  );
}
