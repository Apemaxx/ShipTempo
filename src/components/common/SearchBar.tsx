import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchShipments } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  reference: string;
  type: string;
  status: string;
  customer?: string;
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle clicks outside of the search component to close results
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Debounce search to avoid too many requests
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 3) {
        setIsSearching(true);
        try {
          const searchResults = await searchShipments(query);
          setResults(searchResults);
          setShowResults(true);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length >= 3) {
      setIsSearching(true);
      try {
        const searchResults = await searchShipments(query);
        setResults(searchResults);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(`/tracking/${result.id}`);
    setShowResults(false);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search shipments, references, PRO numbers..."
            className="pl-10 pr-10 h-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 3 && setShowResults(true)}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>
      </form>

      {showResults && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-[300px] overflow-auto rounded-md border bg-background shadow-md">
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((result) => (
                <li
                  key={result.id}
                  className="px-4 py-2 hover:bg-accent cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{result.reference}</span>
                    <span className="text-sm text-muted-foreground">
                      {result.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{result.customer}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        result.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : result.status === "in_transit"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-center text-sm text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
