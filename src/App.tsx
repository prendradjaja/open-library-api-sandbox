import { useState, KeyboardEvent } from 'react'
import { ZodError } from 'zod';
import * as OpenLibrary from './open-library-api-types';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OpenLibrary.BookSearchResponse | undefined>(undefined);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const inputEl = event.target as HTMLInputElement;
      handleEnter(inputEl.value);
    }
  }

  async function handleEnter(searchText: string) {
    const url = new URL('https://openlibrary.org/search.json');
    url.searchParams.set('q', searchText);
    url.searchParams.set('limit', '10');
    setLoading(true);
    setResults(undefined);
    const rawResults = await fetch(url.toString()).then(res => res.json());
    let results: OpenLibrary.BookSearchResponse | undefined;
    try {
      results = OpenLibrary.BookSearchResponse.parse(rawResults);
    } catch (e) {
      if (e instanceof ZodError) {
        console.log(JSON.stringify(e.issues, null, 2));
        console.log('Zod parse error (see above for details)');
      }
    }
    setLoading(false);
    if (results) {
      setResults(results);
      (window as any).results = results;
    }
  }

  return (
    <>
      <h1>
      OpenLibrary API sandbox
      </h1>
      <p>
      Documentation:
      <br/>
      <a href="https://openlibrary.org/dev/docs/api/search">https://openlibrary.org/dev/docs/api/search</a>
      <br/>
      <a href="https://openlibrary.org/dev/docs/api/covers">https://openlibrary.org/dev/docs/api/covers</a>
      </p>
      <p>
      Type something below and press enter to search (examples: "foundation asimov" "pride and prejudice" "william shakespeare")
      </p>
      <input autoFocus onKeyDown={handleKeyDown} defaultValue="foundation asimov" />
      {loading && <p>Loading...</p>}
      {
        results &&
        <>
          <p>
          <strong>
          Showing {results.docs.length} results of {results.num_found}
          </strong>
          </p>
          <p>See <code>results</code> in the console for more details</p>
        </>
      }
      <table><tbody>
      {
        results &&
        results.docs.map((doc, i) =>
          <tr key={i}>
            <td>{doc.title}</td>
            <td>{(doc.author_name ?? []).join(', ')}</td>
            <td>{doc.cover_edition_key}</td>

            {/*
            Covers API supports several different ID types. Here I'm using OLID
            -- all the examples I tried gave OLIDs. Not sure if that might
            change in the future. If it does, change the /olid part of the URL
            */}
            <td>{doc.cover_edition_key &&
              <a href={`https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-L.jpg`} target="_blank">
              <img src={`https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-S.jpg`} />
              </a>
            }</td>
          </tr>
        )
      }
      </tbody></table>
    </>
  )
}

export default App
