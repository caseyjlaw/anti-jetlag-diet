import { useRef } from 'react'
import styles from './TimePicker.module.css'

type Props = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function TimePicker({ id, label, value, onChange, required }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function openPicker() {
    const input = inputRef.current
    if (!input) return
    input.focus()
    if (typeof input.showPicker === 'function') {
      try {
        input.showPicker()
      } catch {
        input.click()
      }
    } else {
      input.click()
    }
  }

  return (
    <div className={styles.field}>
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
          onClick={openPicker}
          className={styles.input}
          aria-describedby={`${id}-hint`}
        />
        <button
          type="button"
          className={styles.clockButton}
          onClick={openPicker}
          aria-label={`Open clock picker for ${label}`}
          title="Open clock picker"
        >
          <svg
            className={styles.clockIcon}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" />
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
      <span id={`${id}-hint`} className={styles.hint}>
        24-hour time — use the clock or type HH:MM (e.g. 19:00)
      </span>
    </div>
  )
}
