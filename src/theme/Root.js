import React, {useEffect, useMemo, useRef, useState} from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./Root.module.css";

export default function Root({children}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const indexUrl = useBaseUrl("/search-index.json");

  useEffect(() => {
    const handleClick = (event) => {
      if (event.target.closest(".book-search-trigger")) setOpen(true);
    };
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (entries.length || loading) return;
    setLoading(true);
    fetch(indexUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Search index: ${response.status}`);
        return response.json();
      })
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [entries.length, indexUrl, loading, open]);

  const results = useMemo(() => search(entries, query), [entries, query]);

  return (
    <>
      {children}
      {open && (
        <div
          className={styles.backdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label="Search the book"
          >
            <header className={styles.searchHeader}>
              <label htmlFor="book-search-input">Search the book</label>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
              >
                Close
              </button>
            </header>
            <input
              id="book-search-input"
              ref={inputRef}
              className={styles.searchInput}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search concepts, APIs, models, and examples"
              autoComplete="off"
            />
            <div className={styles.results} aria-live="polite">
              {loading && <p className={styles.status}>Loading index...</p>}
              {!loading && query.trim().length < 2 && (
                <p className={styles.status}>
                  Enter at least two characters. Press Escape to close.
                </p>
              )}
              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <p className={styles.status}>No matching chapters found.</p>
              )}
              {results.map((result) => (
                <a className={styles.result} href={result.route} key={result.route}>
                  <span className={styles.resultPart}>{result.part}</span>
                  <strong>{result.title}</strong>
                  <p>{result.snippet}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function search(entries, rawQuery) {
  const terms = rawQuery
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 1);
  if (!terms.length) return [];

  return entries
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const description = entry.description.toLowerCase();
      const headings = entry.headings.join(" ").toLowerCase();
      const text = entry.text.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) score += 14;
        if (headings.includes(term)) score += 8;
        if (description.includes(term)) score += 5;
        score += Math.min(5, countOccurrences(text, term));
      }
      return {
        ...entry,
        score,
        snippet: createSnippet(entry.text, terms),
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 10);
}

function countOccurrences(text, term) {
  let count = 0;
  let position = 0;
  while ((position = text.indexOf(term, position)) !== -1) {
    count += 1;
    position += term.length;
  }
  return count;
}

function createSnippet(text, terms) {
  const lower = text.toLowerCase();
  const positions = terms
    .map((term) => lower.indexOf(term))
    .filter((position) => position >= 0);
  const position = positions.length ? Math.min(...positions) : 0;
  const start = Math.max(0, position - 85);
  const end = Math.min(text.length, position + 190);
  return `${start ? "..." : ""}${text.slice(start, end).trim()}${
    end < text.length ? "..." : ""
  }`;
}
