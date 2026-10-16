import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { AsYouType, getCountries, getCountryCallingCode, getExampleNumber, type CountryCode } from 'libphonenumber-js/min';
import examples from 'libphonenumber-js/mobile/examples';

/** Country names in English from the browser, so no name list has to ship with the site */
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

interface Country {
  code: CountryCode;
  name: string;
  dial: string;
}

const COUNTRIES: Country[] = getCountries()
  .map((code) => ({ code, name: regionNames.of(code) ?? code, dial: getCountryCallingCode(code) }))
  .sort((a, b) => a.name.localeCompare(b.name));

/** Everyday names people search for that differ from the official ones */
const ALIASES: Record<string, CountryCode> = { uk: 'GB', england: 'GB', britain: 'GB', uae: 'AE', usa: 'US', america: 'US' };
/** For dialling codes shared by several countries, the one most people mean */
const MAIN_FOR_CODE: Record<string, CountryCode> = { '1': 'US', '7': 'RU', '44': 'GB', '61': 'AU', '39': 'IT', '47': 'NO', '358': 'FI', '212': 'MA' };

/** Flags are static SVGs in /public/flags (from country-flag-icons, MIT licence), loaded only when shown */
const Flag: React.FC<{ code: CountryCode }> = ({ code }) => (
  <img
    src={`/flags/${code}.svg`}
    alt=""
    width={24}
    height={16}
    loading="lazy"
    className="h-4 w-6 shrink-0 rounded-[3px] object-cover ring-1 ring-ink/10"
  />
);

interface PhoneFieldProps {
  country: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  /** The number as typed, without the country code */
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  /** id of the error message, for screen readers */
  describedBy?: string;
}

/**
 * Phone number with a searchable country-code picker covering every country. The placeholder shows a real example
 * number for the chosen country, and the number is tidied into that country's usual format when the field is left.
 */
export const PhoneField: React.FC<PhoneFieldProps> = ({
  country,
  onCountryChange,
  value,
  onChange,
  invalid,
  describedBy,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selected = COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0];
  // Example in the country's own grouping, without a domestic trunk prefix (India: "81234 56789", not "081234 56789")
  const example = getExampleNumber(country, examples);
  const placeholder = example ? new AsYouType(country).input(example.nationalNumber) : 'Phone number';

  const results = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, '');
    if (!q) return COUNTRIES;
    // Best matches first: exact code or dialling code, then names starting with the text, then names containing it
    const rank = (c: Country) => {
      const name = c.name.toLowerCase();
      if (ALIASES[q] === c.code || MAIN_FOR_CODE[q] === c.code) return -1;
      if (c.code.toLowerCase() === q || c.dial === q) return 0;
      if (name.startsWith(q)) return 1;
      if (name.split(/[\s(-]+/).some((word) => word.startsWith(q))) return 2;
      if (c.dial.startsWith(q)) return 3;
      return name.includes(q) ? 4 : 9;
    };
    return COUNTRIES.map((c) => ({ c, r: rank(c) }))
      .filter(({ r }) => r < 9)
      .sort((a, b) => a.r - b.r)
      .map(({ c }) => c);
  }, [query]);

  // Close on a click outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // On opening: focus the search box and scroll the current country into view
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setHighlight(Math.max(0, COUNTRIES.findIndex((c) => c.code === country)));
    requestAnimationFrame(() => {
      searchRef.current?.focus();
      listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'center' });
    });
  }, [open, country]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${highlight}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [highlight]);

  const choose = (c: Country) => {
    onCountryChange(c.code);
    setOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(results.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[highlight]) choose(results[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative mt-2">
      <div
        className={`flex h-12 items-stretch overflow-hidden rounded-xl border bg-white transition-colors focus-within:border-gold focus-within:ring-4 focus-within:ring-gold/25 ${
          invalid ? 'border-red-600' : 'border-ink/15'
        }`}
      >
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Country code: ${selected.name} +${selected.dial}. Change country`}
          onClick={() => setOpen((o) => !o)}
          className="flex shrink-0 cursor-pointer items-center gap-2 border-r border-ink/10 pl-3.5 pr-2.5 text-base font-medium text-ink transition-colors hover:bg-ink/[0.04] focus:outline-none"
        >
          <Flag code={selected.code} />
          <span className="tabular-nums">+{selected.dial}</span>
          <ChevronDown
            className={`h-4 w-4 text-ink/60 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        <input
          ref={inputRef}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d\s()-]/g, ''))}
          onBlur={() => value && onChange(new AsYouType(country).input(value.replace(/\D/g, '')))}
          placeholder={placeholder}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          aria-label="Phone number"
          className="min-w-0 flex-1 bg-transparent px-3.5 text-base text-ink placeholder:text-ink/60 focus:outline-none"
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] sm:right-auto sm:w-[22rem]">
          <div className="flex items-center gap-2.5 border-b border-ink/10 px-4">
            <Search className="h-4 w-4 shrink-0 text-ink/60" aria-hidden="true" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlight(0);
              }}
              onKeyDown={onSearchKey}
              placeholder="Search country or code"
              aria-label="Search country or code"
              aria-controls={listId}
              aria-activedescendant={results[highlight] ? `${listId}-${results[highlight].code}` : undefined}
              className="h-12 w-full bg-transparent text-[15px] text-ink placeholder:text-ink/60 focus:outline-none"
            />
          </div>
          <ul ref={listRef} id={listId} role="listbox" aria-label="Countries" className="max-h-72 overflow-y-auto py-1.5" data-lenis-prevent>
            {results.length === 0 && <li className="px-4 py-3 text-[15px] text-ink/60">No country found</li>}
            {results.map((c, i) => (
              <li
                key={c.code}
                id={`${listId}-${c.code}`}
                data-index={i}
                role="option"
                aria-selected={c.code === country}
                onPointerEnter={() => setHighlight(i)}
                onClick={() => choose(c)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-[15px] text-ink ${
                  i === highlight ? 'bg-wax-deep' : ''
                } ${c.code === country ? 'font-semibold' : ''}`}
              >
                <Flag code={c.code} />
                <span className="min-w-0 flex-1 truncate">{c.name}</span>
                <span className="tabular-nums text-ink/60">+{c.dial}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
