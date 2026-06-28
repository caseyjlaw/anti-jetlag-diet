import { describe, expect, it } from 'vitest'
import type { Airport } from 'airport-data-js'
import { airportProminenceScore, sortAirportsByProminence } from './airports'

function mockAirport(overrides: Partial<Airport>): Airport {
  return {
    iata: 'XXX',
    icao: 'KXXX',
    time: 'America/New_York',
    utc: '-05:00',
    country_code: 'US',
    continent: 'NA',
    airport: 'Test Airport',
    latitude: '0',
    longitude: '0',
    elevation: '0',
    elevation_ft: '0',
    type: 'small_airport',
    scheduled_service: false,
    ...overrides,
  }
}

describe('sortAirportsByProminence', () => {
  it('ranks large airports with scheduled service ahead of small airports', () => {
    const sorted = sortAirportsByProminence([
      mockAirport({ iata: 'SML', type: 'small_airport', runway_length: '3000' }),
      mockAirport({
        iata: 'JFK',
        type: 'large_airport',
        scheduled_service: true,
        runway_length: '12000',
      }),
      mockAirport({ iata: 'MED', type: 'medium_airport', runway_length: '8000' }),
    ])

    expect(sorted.map((a) => a.iata)).toEqual(['JFK', 'MED', 'SML'])
  })

  it('prefers longer runways within the same airport type', () => {
    const a = mockAirport({
      iata: 'A',
      type: 'large_airport',
      runway_length: '9000',
    })
    const b = mockAirport({
      iata: 'B',
      type: 'large_airport',
      runway_length: '12000',
    })

    expect(airportProminenceScore(b)).toBeLessThan(airportProminenceScore(a))
  })
})
