import { useEffect, useId, useRef, useState } from 'react'
import styles from './TimePicker.module.css'

type Props = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

const HOURS = Array.from({ length: 24 }, (_, hour) =>
  String(hour).padStart(2, '0'),
)
const MINUTES = Array.from({ length: 60 }, (_, minute) =>
  String(minute).padStart(2, '0'),
)

function parseTime(value: string): { hour: string; minute: string } {
  const [hour = '00', minute = '00'] = value.split(':')
  return { hour: hour.padStart(2, '0'), minute: minute.padStart(2, '0') }
}

function formatTime(hour: string, minute: string): string {
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
}

export function TimePicker({ id, label, value, onChange, required }: Props) {
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const parsed = parseTime(value || '00:00')
  const [hour, setHour] = useState(parsed.hour)
  const [minute, setMinute] = useState(parsed.minute)

  useEffect(() => {
    const next = parseTime(value || '00:00')
    setHour(next.hour)
    setMinute(next.minute)
  }, [value])

  useEffect(() => {
    if (!panelOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setPanelOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [panelOpen])

  function applyTime(nextHour: string, nextMinute: string) {
    onChange(formatTime(nextHour, nextMinute))
  }

  function openPicker() {
    const input = inputRef.current
    if (input && typeof input.showPicker === 'function') {
      input.focus()
      try {
        input.showPicker()
        return
      } catch {
        // Fall back to custom panel below.
      }
    }
    setPanelOpen(true)
  }

  function confirmPanel() {
    applyTime(hour, minute)
    setPanelOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className={styles.field} ref={rootRef}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.control}>
        <input
          ref={inputRef}
          id={id}
          type="time"
          step="60"
          lang="en-GB"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
          aria-describedby={`${id}-hint`}
          aria-controls={panelId}
          aria-expanded={panelOpen}
        />
        <button
          type="button"
          className={styles.clockButton}
          onClick={openPicker}
          aria-label={`Open clock picker for ${label}`}
          aria-expanded={panelOpen}
          aria-controls={panelId}
          title="Open clock picker"
        >
          <svg
            className={styles.clockIcon}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            />
            <path
              d="M12 7v5l3 2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {panelOpen && (
        <div id={panelId} className={styles.panel} role="dialog" aria-label={`${label} picker`}>
          <div className={styles.panelHeader}>
            <svg className={styles.panelClock} viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M32 10v22l12 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p className={styles.panelTitle}>Select time (24-hour)</p>
          </div>
          <div className={styles.selectRow}>
            <label className={styles.selectField}>
              Hour
              <select
                value={hour}
                onChange={(e) => {
                  setHour(e.target.value)
                  applyTime(e.target.value, minute)
                }}
              >
                {HOURS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <span className={styles.colon}>:</span>
            <label className={styles.selectField}>
              Minute
              <select
                value={minute}
                onChange={(e) => {
                  setMinute(e.target.value)
                  applyTime(hour, e.target.value)
                }}
              >
                {MINUTES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="button" className={styles.doneButton} onClick={confirmPanel}>
            Done
          </button>
        </div>
      )}

      <span id={`${id}-hint`} className={styles.hint}>
        24-hour time — use the clock button or type HH:MM (e.g. 19:00)
      </span>
    </div>
  )
}
