import { useState, type FormEvent } from 'react'
import type { AirportInfo } from '../lib/airports'
import type { TripInput } from '../lib/dietPlan'
import { AirportAutocomplete } from './AirportAutocomplete'
import { TimePicker } from './TimePicker'
import styles from './CalculatorForm.module.css'

export type CalculatorFormValues = TripInput

type Props = {
  initialValues?: Partial<TripInput>
  onSubmit: (values: TripInput) => void
}

export function CalculatorForm({ initialValues, onSubmit }: Props) {
  const [departureAirport, setDepartureAirport] = useState<AirportInfo | null>(
    initialValues?.departureAirport ?? null,
  )
  const [arrivalAirport, setArrivalAirport] = useState<AirportInfo | null>(
    initialValues?.arrivalAirport ?? null,
  )
  const [departureDate, setDepartureDate] = useState(
    initialValues?.departureDate ?? '',
  )
  const [departureTime, setDepartureTime] = useState(
    initialValues?.departureTime ?? '',
  )
  const [arrivalDate, setArrivalDate] = useState(
    initialValues?.arrivalDate ?? '',
  )
  const [arrivalTime, setArrivalTime] = useState(
    initialValues?.arrivalTime ?? '',
  )
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!departureAirport || !arrivalAirport) {
      setError('Please select both departure and arrival airports.')
      return
    }
    if (departureAirport.iata === arrivalAirport.iata) {
      setError('Departure and arrival airports must be different.')
      return
    }

    try {
      onSubmit({
        departureAirport,
        arrivalAirport,
        departureDate,
        departureTime,
        arrivalDate,
        arrivalTime,
      })
    } catch {
      setError('Could not build diet plan.')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <header className={styles.header}>
        <h1>Anti-Jetlag Diet Calculator</h1>
        <p>
          Enter your itinerary exactly as it appears in your reservation email.
          All times are local to each airport.
        </p>
      </header>

      <div className={styles.grid}>
        <AirportAutocomplete
          id="departure-airport"
          label="Departure airport"
          value={departureAirport}
          onChange={setDepartureAirport}
          required
        />
        <AirportAutocomplete
          id="arrival-airport"
          label="Arrival airport"
          value={arrivalAirport}
          onChange={setArrivalAirport}
          required
        />
      </div>

      <fieldset className={styles.fieldset}>
        <legend>Departure (local to departure airport)</legend>
        <div className={styles.row}>
          <label className={styles.simpleField}>
            Date
            <input
              type="date"
              required
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </label>
          <TimePicker
            id="departure-time"
            label="Time"
            required
            value={departureTime}
            onChange={setDepartureTime}
          />
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Arrival (local to destination airport)</legend>
        <div className={styles.row}>
          <label className={styles.simpleField}>
            Date
            <input
              type="date"
              required
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
            />
          </label>
          <TimePicker
            id="arrival-time"
            label="Time"
            required
            value={arrivalTime}
            onChange={setArrivalTime}
          />
        </div>
      </fieldset>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.submit}>
        Calculate my diet plan
      </button>
    </form>
  )
}
