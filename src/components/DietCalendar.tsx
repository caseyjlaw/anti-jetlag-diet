import type { DietPlan } from '../lib/dietPlan'
import { DayCell } from './DayCell'
import styles from './DietCalendar.module.css'

type Props = {
  plan: DietPlan
  departureLabel: string
  arrivalLabel: string
  onEdit: () => void
}

export function DietCalendar({
  plan,
  departureLabel,
  arrivalLabel,
  onEdit,
}: Props) {
  const originZone = plan.departureLocal.zoneName ?? 'UTC'
  const destinationTz = `${plan.arrivalLocal.zoneName ?? 'UTC'}`

  return (
    <div className={styles.calendar}>
      <header className={styles.header}>
        <div>
          <h2>Your 5-day diet plan</h2>
          <p className={styles.route}>
            {departureLabel} → {arrivalLabel}
          </p>
          <p className={styles.meta}>
            Traveling{' '}
            <strong>{plan.direction === 'east' ? 'eastbound' : 'westbound'}</strong>
            {' · '}
            {plan.timezoneDiffHours > 0 ? '+' : ''}
            {plan.timezoneDiffHours}h time difference
          </p>
          <p className={styles.meta}>
            Departs{' '}
            {plan.departureLocal.toFormat('ccc, MMM d — h:mm a')} ({originZone})
            {' · '}
            Arrives{' '}
            {plan.arrivalLocal.toFormat('ccc, MMM d — h:mm a')} (
            {plan.arrivalLocal.zoneName})
          </p>
          <p className={styles.meta}>
            Break final fast:{' '}
            <strong>
              {plan.destinationBreakfast.toFormat('ccc, MMM d — h:mm a')}
            </strong>{' '}
            <span className={styles.tzHighlight}>
              destination local time ({destinationTz})
            </span>
          </p>
          {plan.breakfastNote && (
            <p className={styles.note}>{plan.breakfastNote}</p>
          )}
          <p className={styles.source}>
            Diet protocol based on the{' '}
            <a
              href="https://www.netlib.org/misc/jet-lag-diet"
              target="_blank"
              rel="noreferrer"
            >
              Argonne Anti-Jet-Lag Diet
            </a>{' '}
            (Netlib).
          </p>
        </div>
        <button type="button" className={styles.editButton} onClick={onEdit}>
          Edit trip
        </button>
      </header>

      <p className={styles.tzNote}>
        Calendar dates are shown in departure timezone ({originZone}). Prep-day
        meals and caffeine windows use origin-local times.
      </p>

      <div className={styles.grid}>
        {plan.days.map((day) => (
          <DayCell key={day.date} day={day} timezone={originZone} />
        ))}
      </div>
    </div>
  )
}
