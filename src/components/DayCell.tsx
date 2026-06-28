import { DateTime } from 'luxon'
import type { DietDay } from '../lib/dietPlan'
import styles from './DayCell.module.css'

type Props = {
  day: DietDay
  timezone: string
}

const kindClass: Record<string, string> = {
  feast: styles.eventFeast,
  fast: styles.eventFast,
  caffeine: styles.eventCaffeine,
  travel: styles.eventTravel,
  'break-fast': styles.eventBreakFast,
}

export function DayCell({ day, timezone }: Props) {
  const dateLabel = DateTime.fromISO(day.date, { zone: timezone }).toFormat(
    'ccc, MMM d',
  )

  const dayClass =
    day.dayType === 'feast'
      ? styles.feast
      : day.dayType === 'fast'
        ? styles.fast
        : styles.travel

  const isTravelDay = day.dayType === 'travel'

  return (
    <article className={`${styles.cell} ${dayClass}`}>
      <div className={styles.header}>
        <span className={styles.date}>{dateLabel}</span>
        <span className={styles.badge}>{day.label}</span>
      </div>

      {isTravelDay ? (
        <ul className={styles.events}>
          {day.events.map((event) => (
            <li
              key={`${event.kind}-${event.label}`}
              className={`${styles.event} ${kindClass[event.kind] ?? ''}`}
            >
              <span>{event.label}</span>
              {event.timezoneNote && (
                <span className={styles.tzNote}>
                  Time zone: {event.timezoneNote}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className={`${styles.summary} ${kindClass[day.dayType] ?? ''}`}>
          {day.events[0]?.label}
        </p>
      )}
    </article>
  )
}
