import { DateTime } from 'luxon'
import type { AirportInfo } from './airports'

export type TravelDirection = 'east' | 'west'
export type DayType = 'feast' | 'fast' | 'travel'
export type DietEventKind =
  | 'feast'
  | 'fast'
  | 'caffeine'
  | 'travel'
  | 'break-fast'

export type DietEvent = {
  date: string
  time?: string
  label: string
  kind: DietEventKind
  timezoneNote?: string
}

export type DietDay = {
  date: string
  dayType: DayType
  label: string
  events: DietEvent[]
}

export type TripInput = {
  departureAirport: AirportInfo
  arrivalAirport: AirportInfo
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
}

export type DietPlan = {
  direction: TravelDirection
  travelDate: string
  departureLocal: DateTime
  arrivalLocal: DateTime
  destinationBreakfast: DateTime
  timezoneDiffHours: number
  days: DietDay[]
  breakfastNote?: string
}

const DAY_TYPES: DayType[] = ['feast', 'fast', 'feast', 'fast', 'travel']

function parseLocalDateTime(
  date: string,
  time: string,
  timezone: string,
): DateTime {
  const [hour, minute] = time.split(':').map(Number)
  const dt = DateTime.fromISO(date, { zone: timezone }).set({
    hour: hour ?? 0,
    minute: minute ?? 0,
    second: 0,
    millisecond: 0,
  })
  if (!dt.isValid) {
    throw new Error(`Invalid date/time: ${date} ${time}`)
  }
  return dt
}

export function getTravelDirection(
  departureLocal: DateTime,
  arrivalLocal: DateTime,
): TravelDirection {
  const originOffset = departureLocal.offset
  const destOffset = arrivalLocal.offset
  return destOffset > originOffset ? 'east' : 'west'
}

export function computeDestinationBreakfast(arrivalLocal: DateTime): DateTime {
  return arrivalLocal.startOf('day').set({ hour: 7, minute: 0 })
}

function feastEvents(date: string): DietEvent[] {
  return [
    {
      date,
      label:
        'Feast — high protein at breakfast and lunch; high carbohydrates at dinner. Caffeine only 3–5 PM.',
      kind: 'feast',
    },
  ]
}

function fastEvents(date: string): DietEvent[] {
  return [
    {
      date,
      label:
        'Fast — light meals, under 800 calories. Caffeine only 3–5 PM.',
      kind: 'fast',
    },
  ]
}

function formatDestinationTimezone(arrivalAirport: AirportInfo): string {
  return `${arrivalAirport.iata} local (${arrivalAirport.timezone})`
}

function travelEvents(
  date: string,
  direction: TravelDirection,
  destinationBreakfast: DateTime,
  arrivalAirport: AirportInfo,
  originZone: string,
): DietEvent[] {
  const caffeineLabel =
    direction === 'west'
      ? `Caffeinated drinks in the morning before departure (${originZone})`
      : `Caffeinated drinks between 6–11 PM (${originZone})`

  const breakfastTime = destinationBreakfast.toFormat('ccc, MMM d — h:mm a')
  const destinationTz = formatDestinationTimezone(arrivalAirport)

  return [
    {
      date,
      label: 'Fast — light meals throughout travel',
      kind: 'fast',
    },
    {
      date,
      label: caffeineLabel,
      kind: 'caffeine',
    },
    {
      date,
      label: 'No alcohol on the plane',
      kind: 'travel',
    },
    {
      date,
      label: `Break final fast — high-protein breakfast at ${breakfastTime}`,
      kind: 'break-fast',
      timezoneNote: destinationTz,
    },
    {
      date,
      label: 'Stay awake and active after breakfast',
      kind: 'travel',
    },
  ]
}

function dayTypeLabel(dayType: DayType): string {
  switch (dayType) {
    case 'feast':
      return 'Feast'
    case 'fast':
      return 'Fast'
    case 'travel':
      return 'Travel'
  }
}

export function computeDietPlan(input: TripInput): DietPlan {
  const departureLocal = parseLocalDateTime(
    input.departureDate,
    input.departureTime,
    input.departureAirport.timezone,
  )
  const arrivalLocal = parseLocalDateTime(
    input.arrivalDate,
    input.arrivalTime,
    input.arrivalAirport.timezone,
  )

  if (arrivalLocal <= departureLocal) {
    throw new Error('Arrival must be after departure.')
  }

  const travelDate = departureLocal.toISODate()
  if (!travelDate) {
    throw new Error('Could not determine travel date.')
  }

  const direction = getTravelDirection(departureLocal, arrivalLocal)
  const destinationBreakfast = computeDestinationBreakfast(arrivalLocal)
  const timezoneDiffHours =
    (arrivalLocal.offset - departureLocal.offset) / 60

  let breakfastNote: string | undefined
  if (arrivalLocal < destinationBreakfast) {
    breakfastNote =
      'Your flight arrives before 7:00 AM destination time. Break the fast at 7:00 AM or when the airline can serve a high-protein breakfast.'
  }

  const originZone = input.departureAirport.timezone
  const days: DietDay[] = DAY_TYPES.map((dayType, index) => {
    const offset = index - 4
    const dayDate = departureLocal.plus({ days: offset }).setZone(originZone)
    const date = dayDate.toISODate()!
    const events =
      dayType === 'feast'
        ? feastEvents(date)
        : dayType === 'fast'
          ? fastEvents(date)
          : travelEvents(
              date,
              direction,
              destinationBreakfast,
              input.arrivalAirport,
              originZone,
            )

    return {
      date,
      dayType,
      label: dayTypeLabel(dayType),
      events,
    }
  })

  return {
    direction,
    travelDate,
    departureLocal,
    arrivalLocal,
    destinationBreakfast,
    timezoneDiffHours,
    days,
    breakfastNote,
  }
}
