import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import {
  formatAirportLabel,
  searchAirports,
  type AirportInfo,
} from '../lib/airports'
import styles from './AirportAutocomplete.module.css'

type Props = {
  id: string
  label: string
  value: AirportInfo | null
  onChange: (airport: AirportInfo | null) => void
  required?: boolean
}

export function AirportAutocomplete({
  id,
  label,
  value,
  onChange,
  required,
}: Props) {
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [query, setQuery] = useState(value ? formatAirportLabel(value) : '')
  const [suggestions, setSuggestions] = useState<AirportInfo[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const blurTimeout = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (value) {
      setQuery(formatAirportLabel(value))
    }
  }, [value])

  useEffect(() => {
    if (!open || query.length < 2 || value) return

    let cancelled = false
    setLoading(true)
    searchAirports(query)
      .then((results) => {
        if (!cancelled) {
          setSuggestions(results)
          setHighlightIndex(results.length > 0 ? 0 : -1)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query, open, value])

  useEffect(() => {
    if (highlightIndex < 0 || !listRef.current) return
    const item = listRef.current.children[highlightIndex] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [highlightIndex])

  function selectAirport(airport: AirportInfo) {
    onChange(airport)
    setQuery(formatAirportLabel(airport))
    setOpen(false)
    setSuggestions([])
    setHighlightIndex(-1)
  }

  function acceptHighlighted() {
    if (suggestions.length === 0) return
    const index = highlightIndex >= 0 ? highlightIndex : 0
    selectAirport(suggestions[index]!)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const hasSuggestions = open && suggestions.length > 0

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      if (hasSuggestions) {
        setHighlightIndex((current) =>
          Math.min(current + 1, suggestions.length - 1),
        )
      }
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (hasSuggestions) {
        setHighlightIndex((current) => Math.max(current - 1, 0))
      }
      return
    }

    if (event.key === 'Enter' && hasSuggestions) {
      event.preventDefault()
      acceptHighlighted()
      return
    }

    if (event.key === 'Tab' && hasSuggestions) {
      acceptHighlighted()
      return
    }

    if (event.key === 'Escape') {
      setOpen(false)
      setHighlightIndex(-1)
    }
  }

  const activeOptionId =
    highlightIndex >= 0 ? `${listId}-option-${highlightIndex}` : undefined

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        required={required}
        autoComplete="off"
        value={query}
        onChange={(e) => {
          onChange(null)
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          blurTimeout.current = window.setTimeout(() => {
            setOpen(false)
            setHighlightIndex(-1)
          }, 150)
        }}
        placeholder="Search by city or code (e.g. JFK)"
      />
      {open && (suggestions.length > 0 || loading) && (
        <div className={styles.dropdown}>
          <ul id={listId} ref={listRef} className={styles.list} role="listbox">
            {loading && <li className={styles.status}>Searching…</li>}
            {suggestions.map((airport, index) => (
              <li
                key={airport.iata}
                id={`${listId}-option-${index}`}
                role="presentation"
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={index === highlightIndex}
                  className={`${styles.option} ${
                    index === highlightIndex ? styles.optionActive : ''
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onClick={() => selectAirport(airport)}
                >
                  {formatAirportLabel(airport)}
                </button>
              </li>
            ))}
          </ul>
          {suggestions.length > 0 && !loading && (
            <p className={styles.keyboardHint}>
              ↑↓ to navigate · Tab or Enter to select
            </p>
          )}
        </div>
      )}
    </div>
  )
}
