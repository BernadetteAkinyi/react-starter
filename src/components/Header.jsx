/**
 * Presentational header.
 *
 * Week 1 assignment: notice how this component receives no props. That is
 * fine — not every component needs data. Keep it simple until it needs more.
 */
export default function Header() {
  return (
    <header className="header">
      <a className="brand" href="/" aria-label="TaskFlow home">
        <span className="brand-mark" aria-hidden="true">
          TF
        </span>
        <span>TaskFlow</span>
      </a>

      <nav className="nav" aria-label="Main navigation">
        <a href="#tasks">Tasks</a>
        <a href="#about">About</a>
      </nav>

      <button
        className="ghost-button"
        type="button"
        disabled
        title="You will build the theme toggle in Week 4"
      >
        Theme
      </button>
    </header>
  )
}
