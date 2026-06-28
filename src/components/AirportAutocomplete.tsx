import { useEffect, useId, useRef, useState } from 'react'
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
  const [query, setQuery] = useState(value ? formatAirportLabel(value) : '')
  const [suggestions, setSuggestions] = useState<AirportInfo[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
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
        if (!cancelled) setSuggestions(results)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query, open, value])

  function selectAirport(airport: AirportInfo) {
    onChange(airport)
    setQuery(formatAirportLabel(airport))
    setOpen(false)
    setSuggestions([])
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        required={required}
        autoComplete="off"
        value={query}
        onChange={(e) => {
          onChange(null)
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          blurTimeout.current = window.setTimeout(() => setOpen(false), 150)
        }}
        placeholder="Search by city or code (e.g. JFK)"
      />
      {open && (suggestions.length > 0 || loading) && (
        <ul id={listId} className={styles.list} role="listbox">
          {loading && <li className={styles.status}>Searching…</li>}
          {suggestions.map((airport) => (
            <li key={airport.iata}>
              <button
                type="button"
                role="option"
                className={styles.option}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectAirport(airport)}
              >
                {formatAirportLabel(airport)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
