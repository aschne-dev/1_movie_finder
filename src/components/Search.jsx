// Controlled search box that pushes user input back up to the parent component.
export default function Search({ searchTerm, setSearchTerm }) {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />

        <input
          type="text"
          id="search"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          // Mirror every keystroke so the debounced search stays in sync.
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
