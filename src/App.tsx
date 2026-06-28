import { useState } from 'react'
import { CalculatorForm, type CalculatorFormValues } from './components/CalculatorForm'
import { ContentSections } from './components/ContentSections'
import { DietCalendar } from './components/DietCalendar'
import { SiteFooter } from './components/SiteFooter'
import { formatAirportLabel } from './lib/airports'
import { computeDietPlan, type DietPlan } from './lib/dietPlan'
import './App.css'

function App() {
  const [formValues, setFormValues] = useState<CalculatorFormValues | null>(null)
  const [plan, setPlan] = useState<DietPlan | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  function handleSubmit(values: CalculatorFormValues) {
    try {
      const nextPlan = computeDietPlan(values)
      setFormValues(values)
      setPlan(nextPlan)
      setFormError(null)
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Could not build diet plan.',
      )
    }
  }

  function handleEdit() {
    setPlan(null)
  }

  const showCalendar = plan !== null && formValues !== null

  return (
    <div className="app">
      <section className="hero" aria-label="Diet calculator">
        <div className="heroStage">
          <div
            className={`panel calculatorPanel ${showCalendar ? 'panelHidden' : ''}`}
            aria-hidden={showCalendar}
          >
            <CalculatorForm
              initialValues={formValues ?? undefined}
              onSubmit={handleSubmit}
            />
            {formError && !showCalendar && (
              <p className="formError" role="alert">
                {formError}
              </p>
            )}
          </div>

          <div
            className={`panel calendarPanel ${showCalendar ? 'panelVisible' : ''}`}
            aria-hidden={!showCalendar}
          >
            {showCalendar && (
              <DietCalendar
                plan={plan}
                departureLabel={formatAirportLabel(formValues.departureAirport)}
                arrivalLabel={formatAirportLabel(formValues.arrivalAirport)}
                onEdit={handleEdit}
              />
            )}
          </div>
        </div>
      </section>

      <main className="content">
        <ContentSections />
        <SiteFooter />
      </main>
    </div>
  )
}

export default App
