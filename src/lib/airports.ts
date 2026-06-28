import type { Airport } from 'airport-data-js'

export type AirportInfo = {
  iata: string
  name: string
  timezone: string
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

  const { getAutocompleteSuggestions } = await import('airport-data-js')
  const results = await getAutocompleteSuggestions(trimmed)
  return results
    .filter((a) => a.iata && a.time)
    .map(toAirportInfo)
}

export function formatAirportLabel(airport: AirportInfo): string {
  return `${airport.iata} — ${airport.name}`
}
