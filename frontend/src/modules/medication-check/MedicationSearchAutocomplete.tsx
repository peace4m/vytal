import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Plus, Sparkles } from 'lucide-react';
import { apiClient } from '@/services/api';
import { SelectedMedication } from './SelectedMedicationChips';

interface SearchResultItem {
  rxcui: string;
  name: string;
  synonym?: string;
  clinical_class?: string;
  drug_type?: string;
}

interface MedicationSearchAutocompleteProps {
  onSelectMedication: (med: SelectedMedication) => void;
  alreadySelectedNames: string[];
}

export const MedicationSearchAutocomplete: React.FC<MedicationSearchAutocompleteProps> = ({
  onSelectMedication,
  alreadySelectedNames,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await apiClient<any>(`/medications/search?q=${encodeURIComponent(query.trim())}`);
        setResults(data.results || []);
        setIsOpen(true);
      } catch (err) {
        console.error('Medication search failed', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: SearchResultItem) => {
    onSelectMedication({
      id: `${item.name}-${Date.now()}`,
      name: item.name,
      rxcui: item.rxcui,
      drug_class: item.clinical_class,
    });
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full space-y-2">
      <label htmlFor="medication-search" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
        Search Medication (Generic or Indian Brand Name)
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
        <input
          id="medication-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="e.g., Metformin, Glycomet, Aspirin, Ecosprin, Cardace, Dolo..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-2xs transition-all"
        />
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-72 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-xl divide-y divide-slate-100">
          {results.map((item) => {
            const isAlreadyAdded = alreadySelectedNames.some(
              (name) => name.toLowerCase() === item.name.toLowerCase()
            );

            return (
              <button
                key={item.rxcui + item.name}
                type="button"
                disabled={isAlreadyAdded}
                onClick={() => handleSelect(item)}
                className={`w-full text-left p-3 flex items-center justify-between gap-3 transition-colors ${
                  isAlreadyAdded
                    ? 'opacity-40 cursor-not-allowed bg-slate-50'
                    : 'hover:bg-teal-50/60 cursor-pointer'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{item.name}</span>
                    {item.rxcui && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        RxCUI: {item.rxcui}
                      </span>
                    )}
                  </div>
                  {item.synonym && (
                    <p className="text-xs text-slate-500">
                      <strong className="text-slate-700">Brands/Synonyms: </strong>
                      {item.synonym}
                    </p>
                  )}
                  {item.clinical_class && (
                    <span className="inline-block text-[11px] font-medium text-teal-700">
                      {item.clinical_class}
                    </span>
                  )}
                </div>

                <div className="shrink-0">
                  {isAlreadyAdded ? (
                    <span className="text-xs text-slate-400 font-medium">Added</span>
                  ) : (
                    <span className="p-1.5 rounded-lg bg-teal-100/80 text-teal-800 hover:bg-teal-600 hover:text-white transition-colors flex items-center">
                      <Plus className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Helpful Hint */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <Sparkles className="w-3 h-3 text-teal-500 shrink-0" />
        <span>Supports Indian trade names (e.g., Glycomet, Pan-40, Telma, Stamlo, Voveran).</span>
      </div>
    </div>
  );
};
