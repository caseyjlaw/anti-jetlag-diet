import { describe, expect, it } from 'vitest'
import { computeDietPlan } from './dietPlan'
import type { AirportInfo } from './airports'

const JFK: AirportInfo = {
  iata: 'JFK',
  name: 'New York JFK',
  timezone: 'America/New_York',
}

const CDG: AirportInfo = {
  iata: 'CDG',
  name: 'Paris Charles de Gaulle',
  timezone: 'Europe/Paris',
}

const LAX: AirportInfo = {
  iata: 'LAX',
  name: 'Los Angeles International',
  timezone: 'America/Los_Angeles',
}

const SFO: AirportInfo = {
  iata: 'SFO',
  name: 'San Francisco International',
  timezone: 'America/Los_Angeles',
}

describe('computeDietPlan', () => {
  it('plans JFK to CDG eastbound with break-fast Monday 07:00 Paris', () => {
    const plan = computeDietPlan({
      departureAirport: JFK,
      arrivalAirport: CDG,
      departureDate: '2026-01-11',
      departureTime: '19:00',
      arrivalDate: '2026-01-12',
      arrivalTime: '10:35',
    })

    expect(plan.direction).toBe('east')
    expect(plan.travelDate).toBe('2026-01-11')
    expect(plan.days).toHaveLength(5)
    expect(plan.days[0].events).toHaveLength(1)
    expect(plan.days[0].events[0].label).toContain('Feast')
    expect(plan.days[4].dayType).toBe('travel')
    expect(
      plan.destinationBreakfast.toFormat('yyyy-MM-dd HH:mm'),
    ).toBe('2026-01-12 07:00')
    expect(plan.days[4].events.some((e) => e.kind === 'break-fast')).toBe(true)
    expect(
      plan.days[4].events.some((e) =>
        e.label.includes('6–11 PM'),
      ),
    ).toBe(true)
  })

  it('plans CDG to JFK westbound with morning caffeine', () => {
    const plan = computeDietPlan({
      departureAirport: CDG,
      arrivalAirport: JFK,
      departureDate: '2026-02-02',
      departureTime: '10:00',
      arrivalDate: '2026-02-02',
      arrivalTime: '22:00',
    })

    expect(plan.direction).toBe('west')
    expect(plan.travelDate).toBe('2026-02-02')
    expect(
      plan.days[4].events.some((e) =>
        e.label.includes('morning before departure'),
      ),
    ).toBe(true)
  })

  it('plans LAX to SFO same-day short haul', () => {
    const plan = computeDietPlan({
      departureAirport: LAX,
      arrivalAirport: SFO,
      departureDate: '2026-03-15',
      departureTime: '08:00',
      arrivalDate: '2026-03-15',
      arrivalTime: '09:30',
    })

    expect(plan.travelDate).toBe('2026-03-15')
    expect(plan.days[4].date).toBe('2026-03-15')
    expect(
      plan.destinationBreakfast.toFormat('yyyy-MM-dd'),
    ).toBe('2026-03-15')
  })

  it('rejects arrival before departure', () => {
    expect(() =>
      computeDietPlan({
        departureAirport: JFK,
        arrivalAirport: CDG,
        departureDate: '2026-01-12',
        departureTime: '19:00',
        arrivalDate: '2026-01-11',
        arrivalTime: '10:35',
      }),
    ).toThrow('Arrival must be after departure')
  })
})
