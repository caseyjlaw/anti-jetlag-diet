import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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

function normalizeTimeInput(raw: string): string | null {
  const trimmed = raw.trim()
  const match = trimmed.match(/^(\d{1,2}):(\d{1,2})$/)
  if (!match) return null

  const hour = Number.parseInt(match[1]!, 10)
  const minute = Number.parseInt(match[2]!, 10)
  if (hour > 23 || minute > 59) return null

  return formatTime(hour, minute)
}

export function TimePicker({ id, label, value, onChange, required }: Props) {
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const controlRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [mode, setMode] = useState<PickerMode>('hour')
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({})
  const parsed = parseTime(value || '00:00')
  const [hour, setHour] = useState(parsed.hour)
  const [minute, setMinute] = useState(parsed.minute)

  useEffect(() => {
    const next = parseTime(value || '00:00')
    setHour(next.hour)
    setMinute(next.minute)
  }, [value])

  useLayoutEffect(() => {
    if (!panelOpen || !controlRef.current || !panelRef.current) return

    function updatePosition() {
      const anchor = controlRef.current!.getBoundingClientRect()
      const panelHeight = panelRef.current!.offsetHeight
      const panelWidth = Math.max(anchor.width, 280)
      const margin = 8
      const spaceBelow = window.innerHeight - anchor.bottom - margin
      const spaceAbove = anchor.top - margin
      const openAbove = spaceBelow < panelHeight && spaceAbove > spaceBelow

      let left = anchor.left
      left = Math.max(margin, Math.min(left, window.innerWidth - panelWidth - margin))

      setPanelStyle({
        position: 'fixed',
        left,
        width: panelWidth,
        top: openAbove
          ? anchor.top - panelHeight - margin
          : anchor.bottom + margin,
        zIndex: 2000,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [panelOpen, mode, hour, minute])

  useEffect(() => {
    if (!panelOpen) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (
        rootRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return
      }
      setPanelOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setPanelOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
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

  function handleTextBlur() {
    if (!value.trim()) return
    const normalized = normalizeTimeInput(value)
    if (normalized) {
      onChange(normalized)
    }
  }

  const panel = panelOpen ? (
    <div
      id={panelId}
      ref={panelRef}
      className={styles.panel}
      style={panelStyle}
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
  ) : null

  return (
    <div className={styles.field} ref={rootRef}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.control} ref={controlRef}>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="19:00"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleTextBlur}
          className={styles.textInput}
          aria-describedby={`${id}-hint`}
          aria-expanded={panelOpen}
          aria-controls={panelId}
          pattern="[0-9]{2}:[0-9]{2}"
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

      {panel && createPortal(panel, document.body)}

      <span id={`${id}-hint`} className={styles.hint}>
        Type HH:MM (24-hour) or use the clock icon.
      </span>
    </div>
  )
}
