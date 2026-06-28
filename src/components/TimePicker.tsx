import { useEffect, useId, useRef, useState } from 'react'
import { ClockFace } from './ClockFace'
import styles from './TimePicker.module.css'

type Props = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

type PickerMode = 'hour' | 'minute'

function parseTime(value: string): { hour: number; minute: number } {
  const [hourPart = '0', minutePart = '0'] = value.split(':')
  const hour = Number.parseInt(hourPart, 10)
  const minute = Number.parseInt(minutePart, 10)
  return {
    hour: Number.isNaN(hour) ? 0 : Math.min(23, Math.max(0, hour)),
    minute: Number.isNaN(minute) ? 0 : Math.min(59, Math.max(0, minute)),
  }
}

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function displayTime(value: string): string {
  if (!value) return 'Select time'
  return value
}

export function TimePicker({ id, label, value, onChange, required }: Props) {
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [mode, setMode] = useState<PickerMode>('hour')
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

  function openPicker() {
    setMode('hour')
    setPanelOpen(true)
  }

  function applyTime(nextHour: number, nextMinute: number) {
    onChange(formatTime(nextHour, nextMinute))
  }

  function handleHourSelect(nextHour: number) {
    setHour(nextHour)
    applyTime(nextHour, minute)
    setMode('minute')
  }

  function handleMinuteSelect(nextMinute: number) {
    setMinute(nextMinute)
    applyTime(hour, nextMinute)
  }

  function confirmPanel() {
    applyTime(hour, minute)
    setPanelOpen(false)
  }

  return (
    <div className={styles.field} ref={rootRef}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.control}>
        <button
          type="button"
          id={id}
          className={`${styles.displayButton} ${!value ? styles.displayEmpty : ''}`}
          onClick={openPicker}
          aria-expanded={panelOpen}
          aria-controls={panelId}
          aria-describedby={`${id}-hint`}
        >
          {displayTime(value)}
        </button>
        <button
          type="button"
          className={styles.clockButton}
          onClick={openPicker}
          aria-label={`Open clock picker for ${label}`}
          aria-expanded={panelOpen}
          aria-controls={panelId}
          title="Open clock picker"
        >
          <svg className={styles.clockIcon} viewBox="0 0 24 24" aria-hidden="true">
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

      <input
        tabIndex={-1}
        className={styles.hiddenInput}
        value={value}
        onChange={() => undefined}
        required={required}
        aria-hidden="true"
      />

      {panelOpen && (
        <div
          id={panelId}
          className={styles.panel}
          role="dialog"
          aria-label={`${label} picker`}
        >
          <p className={styles.digitalTime}>{formatTime(hour, minute)}</p>
          <div className={styles.modeTabs}>
            <button
              type="button"
              className={mode === 'hour' ? styles.modeActive : styles.modeTab}
              onClick={() => setMode('hour')}
            >
              Hour
            </button>
            <button
              type="button"
              className={mode === 'minute' ? styles.modeActive : styles.modeTab}
              onClick={() => setMode('minute')}
            >
              Minute
            </button>
          </div>
          <p className={styles.modeHint}>
            {mode === 'hour'
              ? 'Click the clock face to set the hour (24-hour).'
              : 'Click the clock face to set the minute.'}
          </p>
          <ClockFace
            mode={mode}
            hour={hour}
            minute={minute}
            onSelectHour={handleHourSelect}
            onSelectMinute={handleMinuteSelect}
          />
          <button type="button" className={styles.doneButton} onClick={confirmPanel}>
            Done
          </button>
        </div>
      )}

      <span id={`${id}-hint`} className={styles.hint}>
        Click the time or clock icon to open the graphical picker.
      </span>
    </div>
  )
}
