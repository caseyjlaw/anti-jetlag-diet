import { DateTime } from 'luxon'
import type { DietDay } from '../lib/dietPlan'
import styles from './DayCell.module.css'

type Props = {
  day: DietDay
  timezone: string
  expanded: boolean
  onToggle: () => void
}

const kindClass: Record<string, string> = {
  feast: styles.eventFeast,
  fast: styles.eventFast,
  caffeine: styles.eventCaffeine,
  travel: styles.eventTravel,
  'break-fast': styles.eventBreakFast,
}

export function DayCell({ day, timezone, expanded, onToggle }: Props) {
  const dateLabel = DateTime.fromISO(day.date, { zone: timezone }).toFormat(
    'ccc, MMM d',
  )

  const dayClass =
    day.dayType === 'feast'
      ? styles.feast
      : day.dayType === 'fast'
        ? styles.fast
        : styles.travel

  return (
    <article className={`${styles.cell} ${dayClass}`}>
      <button
        type="button"
        className={styles.header}
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span className={styles.date}>{dateLabel}</span>
        <span className={styles.badge}>{day.label}</span>
      </button>
      <ul className={expanded ? styles.events : styles.eventsCollapsed}>
        {day.events.map((event) => (
          <li
            key={`${event.kind}-${event.label}`}
            className={`${styles.event} ${kindClass[event.kind] ?? ''}`}
          >
            {event.time && (
              <span className={styles.time}>{event.time} · </span>
            )}
            {event.label}
          </li>
        ))}
      </ul>
    </article>
  )
}
