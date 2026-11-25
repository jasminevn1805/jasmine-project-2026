'use client'
// D1 · Dialog · Connect calendar (flow 3; reopened in flow 14). Solves P1 · E, C, D.
// Step 1 asks where the clinic books today. Three ways out, none a dead end:
//   Cal.com / Calendly → step 2: sign in, pick an event type, Connect
//   Practice software  → step 2: needs a developer/partner; primary = sample calendar for now
//   Not ready?         → sample calendar straight from step 1
import { useEffect, useState } from 'react'
import { Button } from '@jasmine/design-system'
import { Calendar as CalendarIcon, ChevronLeft, CircleCheck, X } from 'lucide-react'
import { Badge, Dialog, Icon } from '@/components/ui'
import { calendarOptions, eventTypes, providerAccount } from '@/lib/agent/fixtures'
import type { Calendar, CalendarProvider } from '@/lib/agent/model'
import s from './dialog.module.css'

type Choice = (typeof calendarOptions)[number]['id']
type Step = 'where' | 'provider' | 'practice'

export function ConnectCalendarDialog({
  open,
  onSample = false,
  onClose,
  onConnect,
  onIntegrations,
}: {
  open: boolean
  /** Opened from the sample calendar (Switch / Connect real calendar): don't offer it again. */
  onSample?: boolean
  onClose: () => void
  onConnect: (calendar: Calendar) => void
  onIntegrations: () => void
}) {
  const [step, setStep] = useState<Step>('where')
  const [choice, setChoice] = useState<Choice | null>(null)
  const [error, setError] = useState(false)
  const [signIn, setSignIn] = useState<'idle' | 'working' | 'done'>('idle')
  const [eventType, setEventType] = useState(eventTypes[0])

  // Every open starts fresh at step 1.
  useEffect(() => {
    if (!open) return
    setStep('where')
    setChoice(null)
    setError(false)
    setSignIn('idle')
    setEventType(eventTypes[0])
  }, [open])

  const provider = (choice === 'Cal.com' || choice === 'Calendly' ? choice : 'Cal.com') as CalendarProvider
  const useSample = () => onConnect({ kind: 'sample' })

  const next = () => {
    if (!choice) return setError(true)
    setStep(choice === 'practice' ? 'practice' : 'provider')
  }

  const simulateSignIn = () => {
    // Prototype: a real build opens the provider's OAuth window here.
    setSignIn('working')
    setTimeout(() => setSignIn('done'), 900)
  }

  return (
    <Dialog open={open} onClose={onClose} labelledBy="d1-title" describedBy="d1-desc">
      <header className={s.head}>
        <div>
          <p className={s.step}>Step {step === 'where' ? 1 : 2} of 2</p>
          <h2 id="d1-title" className={s.title}>
            {step === 'practice' ? 'Practice software' : 'Connect calendar'}
          </h2>
        </div>
        <button type="button" className={s.close} aria-label="Close" onClick={onClose}>
          <Icon icon={X} />
        </button>
      </header>

      {step === 'where' && (
        <>
          <div className={s.body}>
            <p id="d1-desc" className={s.desc}>
              For Check availability and Book appointment.
            </p>
            <fieldset className={s.fieldset} aria-describedby={error ? 'd1-error' : undefined}>
              <legend className={s.legend}>Where do you book appointments today?</legend>
              {calendarOptions.map((o) => (
                <label key={o.id} className={s.option}>
                  <input
                    type="radio"
                    name="d1-where"
                    value={o.id}
                    checked={choice === o.id}
                    onChange={() => {
                      setChoice(o.id)
                      setError(false)
                    }}
                  />
                  <span>
                    <span className={s.optionTitle}>{o.title}</span>
                    <span className={s.optionDetail}>{o.detail}</span>
                  </span>
                </label>
              ))}
              {error && (
                <p id="d1-error" role="alert" className={s.error}>
                  Choose where you book appointments, or use the sample calendar below.
                </p>
              )}
            </fieldset>

            {!onSample && (
            <section className={s.sample} aria-labelledby="d1-sample">
              <p className={s.sampleLead}>Not ready to connect?</p>
              <div className={s.sampleCard}>
                <div className={s.sampleText}>
                  <p id="d1-sample" className={s.optionTitle}>
                    Sample calendar <Badge tone="neutral">Test only</Badge>
                  </p>
                  <p className={s.optionDetail}>Book test calls into sample slots. Connect a real calendar before you publish.</p>
                </div>
                <Button type="Text" size="S" className={s.sampleBtn} onClick={useSample}>
                  <Icon icon={CalendarIcon} size="s" />
                  Use sample calendar
                </Button>
              </div>
            </section>
            )}
          </div>
          <footer className={s.foot}>
            <span />
            <div className={s.footActions}>
              <Button type="Outline" size="M" onClick={onClose}>
                Cancel
              </Button>
              <Button type="Primary" size="M" onClick={next}>
                Continue
              </Button>
            </div>
          </footer>
        </>
      )}

      {step === 'provider' && (
        <>
          <div className={s.body}>
            {signIn !== 'done' ? (
              <>
                <p id="d1-desc" className={s.desc}>
                  Sign in to {provider} so Retell can check free slots and book into it. You stay in control: bookings only go
                  into the event type you pick next.
                </p>
                <div className={s.signIn}>
                  <Button type="Primary" size="M" loading={signIn === 'working'} onClick={simulateSignIn}>
                    <Icon icon={CalendarIcon} size="s" />
                    Sign in to {provider}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p id="d1-desc" className={s.signedIn}>
                  <Icon icon={CircleCheck} size="s" />
                  {provider} · signed in as {providerAccount}
                </p>
                <fieldset className={s.fieldset}>
                  <legend className={s.legend}>Which event type should bookings go into?</legend>
                  {eventTypes.map((t) => (
                    <label key={t} className={s.option}>
                      <input type="radio" name="d1-event" value={t} checked={eventType === t} onChange={() => setEventType(t)} />
                      <span>
                        <span className={s.optionTitle}>{t}</span>
                      </span>
                    </label>
                  ))}
                </fieldset>
              </>
            )}
          </div>
          <footer className={s.foot}>
            <button type="button" className={s.back} onClick={() => setStep('where')}>
              <Icon icon={ChevronLeft} size="s" />
              Back
            </button>
            <div className={s.footActions}>
              {signIn === 'done' && (
                <Button type="Primary" size="M" onClick={() => onConnect({ kind: 'provider', provider, eventType })}>
                  Connect
                </Button>
              )}
            </div>
          </footer>
        </>
      )}

      {step === 'practice' && (
        <>
          <div className={s.body}>
            <p id="d1-desc" className={s.desc}>
              Dentrix, Jane App and similar tools connect through Integrations. This needs a developer or a Retell partner.
            </p>
            <div className={s.keepBuilding}>
              <p className={s.optionTitle}>Keep building in the meantime</p>
              <p className={s.optionDetail}>
                Use a sample calendar with your clinic hours and some slots already booked. Every feature works, including test
                bookings. Switch to your real calendar any time before you publish.
              </p>
            </div>
          </div>
          <footer className={s.foot}>
            <button type="button" className={s.back} onClick={() => setStep('where')}>
              <Icon icon={ChevronLeft} size="s" />
              Back
            </button>
            <div className={s.footActions}>
              <Button type="Outline" size="M" onClick={onIntegrations}>
                Continue to Integrations
              </Button>
              <Button type="Primary" size="M" onClick={onSample ? onClose : useSample}>
                {onSample ? 'Keep the sample calendar for now' : 'Use sample calendar for now'}
              </Button>
            </div>
          </footer>
        </>
      )}
    </Dialog>
  )
}
