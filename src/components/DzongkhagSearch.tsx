import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { Search, MapPin } from 'lucide-react';
import { supabase } from "../lib/supabase";

export const DzongkhagSearch = ({ onSelect }: { onSelect: (locationName: string) => void }) => {
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

  // Update this to match your Supabase table 'dzongkhagweather'
  const { data, error } = await supabase
    .from('dzongkhagweather') 
    .select('name, latitude, longitude')
    .ilike('name', `%${searchTerm}%`)
    .limit(5);

  if (!error && data) {
    setResults(data);
  }
};

  const selectLocation = (loc: any) => {
  if (!loc) return;
  setQuery(loc.name);
  setIsOpen(false);
  onSelect(loc); // <--- Pass the whole object (name, lat, lon) to App.tsx
};
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        selectLocation(results[0]);
      } else if (query.trim()) {
        onSelect(query);
        setIsOpen(false);
      }
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      {/* Input Group */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-4 text-slate-400 z-10" size={18} />
          <input
            type="text"
            className="w-150 pl-12 pr-4 py-2.5 bg-white border border-emerald-100 rounded-full shadow-sm focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-700 transition-all"
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
        
        <button 
  onClick={() => onSelect(query)}
    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-black transition-all shadow-lg active:scale-95"
  >
  Search
</button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && results.length > 0 && (
  <div className="absolute z-50 w-full mt-2 bg-white border rounded-2xl shadow-xl overflow-hidden">
    {results.map((loc, index) => (
  <button
    key={index}
    onMouseDown={() => selectLocation(loc)}
    className="w-full text-left px-5 py-3 hover:bg-emerald-50 flex items-center gap-2"
  >
    <MapPin size={14} className="text-emerald-500" />
    {/* FIX: Use loc.name to show the actual place name */}
    <span className="font-semibold text-slate-700 text-sm">{loc.name}</span>
  </button>
))}

  </div>
)}
        </div>
      )};  