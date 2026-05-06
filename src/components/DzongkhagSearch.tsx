import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { Search, MapPin } from 'lucide-react';
import { supabase } from "../lib/supabase";

export const DzongkhagSearch = ({ onSelect }: { onSelect: (location: any) => void }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const { data, error } = await supabase
      .from('bhutan_locations')
      .select('dzongkhag, dungkhag, gewog') // No need for lat/lon here since App.tsx geocodes now
      .or(`gewog.ilike.%${searchTerm}%,dungkhag.ilike.%${searchTerm}%,dzongkhag.ilike.%${searchTerm}%`)
      .limit(5);

    if (!error && data) {
      setResults(data);
    }
  };

  const selectLocation = (loc: any) => {
    if (!loc) return;
    const displayName = loc.gewog || loc.dzongkhag;
    setQuery(displayName);
    setIsOpen(false);
    onSelect(loc); 
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Select first result if available, otherwise just try to search what was typed
      if (results.length > 0) {
        selectLocation(results[0]);
      } else if (query.trim()) {
        onSelect({ gewog: query }); // Fallback: just send the typed name
        setIsOpen(false);
      }
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      {/* Input Group */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-slate-400 z-10" size={18} />
        <input
          type="text"
          className="w-full pl-12 pr-4 py-2.5 bg-white border border-emerald-100 rounded-full shadow-sm focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-700 transition-all"
          placeholder="Search places..."
          value={query}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            setIsOpen(true);
            handleSearch(val);
          }}
        />
      </div>

      {/* Single Dropdown Menu */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {results.map((loc, index) => (
            <button
              key={index}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevents blur before click
                selectLocation(loc);
              }}
              className="w-full text-left px-5 py-3 hover:bg-emerald-50 flex flex-col border-b border-slate-50 last:border-0 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-500" />
                <span className="font-semibold text-slate-700 text-sm">
                  {loc.gewog || loc.dzongkhag}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider ml-6">
                {loc.dungkhag ? `${loc.dungkhag} • ` : ""}{loc.dzongkhag}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};