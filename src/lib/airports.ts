import type { Airport } from 'airport-data-js'

export type AirportInfo = {
  iata: string
  name: string
  timezone: string
}

const TYPE_RANK: Record<string, number> = {
  large_airport: 0,
  medium_airport: 1,
  small_airport: 2,
  seaplane_base: 3,
  heliport: 4,
  closed: 5,
}

function hasScheduledService(airport: Airport): boolean {
  return (
    airport.scheduled_service === true ||
    airport.scheduled_service === 'yes' ||
    airport.scheduled_service === '1'
  )
}

export function airportProminenceScore(airport: Airport): number {
  const typeRank = TYPE_RANK[airport.type] ?? 3
  const scheduledRank = hasScheduledService(airport) ? 0 : 1
  const runwayLength = Number(airport.runway_length) || 0

  return typeRank * 1_000_000 - runwayLength * 10 + scheduledRank * 100_000
}

export function sortAirportsByProminence(airports: Airport[]): Airport[] {
  return [...airports].sort(
    (a, b) => airportProminenceScore(a) - airportProminenceScore(b),
  )
}

export function toAirportInfo(airport: Airport): AirportInfo {
  return {
    iata: airport.iata,
    name: airport.airport,
    timezone: airport.time,
  }
}

export async function searchAirports(query: string): Promise<AirportInfo[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const { getAutocompleteSuggestions, searchByName } = await import(
    'airport-data-js'
  )

  const [suggestions, nameMatches] = await Promise.all([
    getAutocompleteSuggestions(trimmed),
    searchByName(trimmed),
  ])

  const merged = new Map<string, Airport>()
  for (const airport of [...suggestions, ...nameMatches]) {
    if (airport.iata && airport.time) {
      merged.set(airport.iata, airport)
    }
  }

  return sortAirportsByProminence([...merged.values()])
    .slice(0, 12)
    .map(toAirportInfo)
}

export function formatAirportLabel(airport: AirportInfo): string {
  return `${airport.iata} — ${airport.name}`
}
