import { useMemo, type PointerEvent } from 'react'
import styles from './ClockFace.module.css'

type Mode = 'hour' | 'minute'

type Props = {
  mode: Mode
  hour: number
  minute: number
  onSelectHour: (hour: number) => void
  onSelectMinute: (minute: number) => void
}

const SIZE = 240
const CENTER = SIZE / 2
const RADIUS = 92

function positionForAngle(angleDeg: number, radius: number) {
  const radians = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  }
}

function valueFromPoint(clientX: number, clientY: number, rect: DOMRect, mode: Mode) {
  const x = clientX - rect.left - rect.width / 2
  const y = clientY - rect.top - rect.height / 2
  let angle = (Math.atan2(y, x) * 180) / Math.PI + 90
  if (angle < 0) angle += 360

  if (mode === 'hour') {
    return Math.round(angle / 15) % 24
  }

  return Math.round(angle / 6) % 60
}

export function ClockFace({
  mode,
  hour,
  minute,
  onSelectHour,
  onSelectMinute,
}: Props) {
  const hourHand = useMemo(() => {
    const angle = hour * 15 + minute * 0.25
    const tip = positionForAngle(angle, 52)
    return { tip }
  }, [hour, minute])

  const minuteHand = useMemo(() => {
    const angle = minute * 6
    const tip = positionForAngle(angle, 72)
    return { tip }
  }, [minute])

  function handlePointer(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const value = valueFromPoint(event.clientX, event.clientY, rect, mode)
    if (mode === 'hour') {
      onSelectHour(value)
    } else {
      onSelectMinute(value)
    }
  }

  const hourLabels = Array.from({ length: 24 }, (_, index) => {
    const angle = index * 15
    const labelPos = positionForAngle(angle, RADIUS - 16)
    const showLabel = index % 3 === 0
    return { index, labelPos, showLabel }
  })

  const minuteLabels = Array.from({ length: 12 }, (_, index) => {
    const minuteValue = index * 5
    const angle = minuteValue * 6
    const labelPos = positionForAngle(angle, RADIUS - 16)
    return { minuteValue, labelPos }
  })

  return (
    <svg
      className={styles.clock}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={mode === 'hour' ? 'Hour selector' : 'Minute selector'}
      onPointerDown={handlePointer}
    >
      <circle cx={CENTER} cy={CENTER} r={RADIUS} className={styles.face} />
      <circle cx={CENTER} cy={CENTER} r={RADIUS - 28} className={styles.innerFace} />

      {mode === 'hour'
        ? hourLabels.map(({ index, labelPos, showLabel }) => {
            const tick = positionForAngle(index * 15, RADIUS - 6)
            return (
              <g key={index}>
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={tick.x}
                  y2={tick.y}
                  className={styles.tick}
                />
                {showLabel && (
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    className={styles.hourLabel}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {String(index).padStart(2, '0')}
                  </text>
                )}
              </g>
            )
          })
        : minuteLabels.map(({ minuteValue, labelPos }) => {
            const tick = positionForAngle(minuteValue * 6, RADIUS - 6)
            return (
              <g key={minuteValue}>
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={tick.x}
                  y2={tick.y}
                  className={styles.tick}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  className={styles.minuteLabel}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {String(minuteValue).padStart(2, '0')}
                </text>
              </g>
            )
          })}

      <line
        x1={CENTER}
        y1={CENTER}
        x2={hourHand.tip.x}
        y2={hourHand.tip.y}
        className={styles.hourHand}
      />
      <line
        x1={CENTER}
        y1={CENTER}
        x2={minuteHand.tip.x}
        y2={minuteHand.tip.y}
        className={styles.minuteHand}
      />
      <circle cx={CENTER} cy={CENTER} r="5" className={styles.centerDot} />
    </svg>
  )
}
