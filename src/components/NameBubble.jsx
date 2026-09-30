import { useEffect, useRef, useState } from 'react'
import { sendVisitorRow } from '../hooks/useVisitorTracker'

const KEY = 'nishx-name'

const ORACLE_URL =
  'https://script.google.com/macros/s/AKfycbxXKw6tKhtg850eY3hXRuwo46dU4ybRLEUKMiweJjDbTNmnnej0jC1B02vuw21t2M0e/exec'

const FALLBACK = name =>
  `"${name}" huh? Word on the street says it means "unstoppable with a side of snacks." The internet could not decide, so we are going with that.`

const JOIN_DEADLINE = 25000

const LOADING_LINES = [
  'Consulting the stars for {name} (between naps) \u2026',
  'Casting {name}\u2019s fate with paws crossed \u2026',
  'Shaking the sky until it confesses about {name} \u2026',
  'Reading {name}\u2019s future by whisker \u2026',
  'Summoning {name}\u2019s tomorrow from a dusty crystal ball \u2026',
  'Asking a passing pigeon about {name}\u2019s day \u2026',
  'Sharpening claws before judging {name} \u2026',
  'Checking the meow-roscope for {name} \u2026',
  'Stealing a glance at {name}\u2019s astral file \u2026',
  'Composing today\u2019s nonsense for {name} (while pretending to listen) \u2026',
]
const pickLine = () => LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)]

async function fetchMeaning(name) {
  const res = await fetch(ORACLE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'horoscope', name }),
  })
  if (!res.ok) throw new Error(`glhf ${res.status}`)
  const data = await res.json()
  const clean = typeof data === 'string' ? data.trim() : data?.horoscope?.trim()
  if (!clean) throw new Error('empty')
  return clean
}

export default function NameBubble() {
  const [name, setName] = useState(() => localStorage.getItem(KEY) || '')
  const [draft, setDraft] = useState('')
  const [mode, setMode] = useState(name ? 'loading' : 'ask')
  const [meaning, setMeaning] = useState('')
  const [loadingLine, setLoadingLine] = useState(pickLine)

  const joinedRef = useRef(null)

  useEffect(() => {
    if (mode !== 'loading') return
    if (joinedRef.current === name) return
    joinedRef.current = name
    let cancelled = false
    const t = setTimeout(() => {
      cancelled = true
      setMeaning(FALLBACK(name))
      setMode('done')
    }, JOIN_DEADLINE)
    fetchMeaning(name)
      .then(text => {
        if (cancelled) return
        setMeaning(text)
        setMode('done')
      })
      .catch(() => {
        if (cancelled) return
        setMeaning(FALLBACK(name))
        setMode('done')
      })
      .finally(() => clearTimeout(t))
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [mode, name])

  const ask = e => {
    e.preventDefault()
    const value = draft.trim()
    if (!value) return
    localStorage.setItem(KEY, value)
    setName(value)
    setDraft('')
    setLoadingLine(pickLine())
    setMode('loading')
    sendVisitorRow(value)
  }

  const reset = () => {
    localStorage.removeItem(KEY)
    setDraft('')
    joinedRef.current = null
    setMeaning('')
    setName('')
    setMode('ask')
  }

  return (
    <div className="nb" aria-live="polite">
      <div className="nb-body">
        {mode === 'ask' && (
          <form className="nb-form" onSubmit={ask}>
            <p className="nb-title">Meooooow</p>
            <p className="nb-msg">
              Let&rsquo;s ruin your day, together.
            </p>
            <div className="nb-input-container">
              <input
                className="nb-input"
                type="text"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="The stars want your name"
                maxLength={20}
                autoComplete="off"
                autoFocus
                aria-label="Your name"
              />
              <span className="nb-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M12 2l2.92 6.62 7.08.6-5.4 4.7 1.62 6.98L12 17.2l-6.22 3.7 1.62-6.98-5.4-4.7 7.08-.6z"/>
                </svg>
              </span>
            </div>
          </form>
        )}
        {mode === 'loading' && (
          <div className="nb-loading">
            <p className="nb-msg">
              {loadingLine.replace('{name}', name)}
            </p>
            <span className="nb-dots"><i /><i /><i /></span>
          </div>
        )}
        {mode === 'done' && (
          <div className="nb-done">
            <p className="nb-hey">Meow, {name}!</p>
            <p className="nb-result">{meaning}</p>
            <button className="nb-again" onClick={reset}>
              ruin again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}