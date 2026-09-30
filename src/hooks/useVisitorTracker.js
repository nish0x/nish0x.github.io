import { useEffect } from 'react'

const ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxXKw6tKhtg850eY3hXRuwo46dU4ybRLEUKMiweJjDbTNmnnej0jC1B02vuw21t2M0e/exec'

const VISIT_KEY = 'vt-visit'
const VISIT_NAMES_KEY = 'vt-visit-names'
const NAME_KEY = 'nishx-name'

function getStoredName() {
  try {
    return localStorage.getItem(NAME_KEY) || ''
  } catch {
    return ''
  }
}

function getVisitId() {
  let id = sessionStorage.getItem(VISIT_KEY)
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    sessionStorage.setItem(VISIT_KEY, id)
  }
  return id
}

function getVisitNames() {
  return sessionStorage.getItem(VISIT_NAMES_KEY) || ''
}

function recordName(name) {
  const clean = (name || '').trim()
  if (!clean) return getVisitNames()
  const parts = getVisitNames()
    .split(',')
    .map(p => p.trim())
    .filter(Boolean)
  if (!parts.some(p => p.toLowerCase() === clean.toLowerCase())) parts.push(clean)
  const list = parts.join(', ')
  sessionStorage.setItem(VISIT_NAMES_KEY, list)
  return list
}

function detectDevice() {
  const ua = navigator.userAgent
  const device = /Mobi|Android|iPhone/i.test(ua)
    ? /iPad|Tablet/i.test(ua)
      ? 'Tablet'
      : 'Mobile'
    : 'Desktop'
  const browserMatch = ua.match(/(Edg|Chrome|Firefox|Safari|OPR|MSIE)[/\s]([\d.]+)/)
  const browser = browserMatch ? `${browserMatch[1]} ${browserMatch[2]}` : 'Unknown'
  return { device, browser }
}

async function getIpInfo() {
  try {
    const res = await fetch('https://ipwho.is/')
    if (!res.ok) return {}
    const d = await res.json()
    return {
      ip: d.ip || '',
      country: d.country || '',
      city: d.city || '',
      region: d.region || '',
      isp: d.connection?.isp || '',
      timezone: d.timezone?.id || '',
    }
  } catch {
    return {}
  }
}

export async function sendVisitorRow(name) {
  try {
    const info = await getIpInfo()
    const { device, browser } = detectDevice()
    await fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        ...info,
        visit: getVisitId(),
        name: name ? recordName(name) : getVisitNames() || getStoredName(),
        language: navigator.language || '',
        device,
        browser,
        screen: `${screen.width}x${screen.height}`,
      }),
    })
  } catch {
    // tracking is best-effort, never block the page
  }
}

export default function useVisitorTracker() {
  useEffect(() => {
    if (sessionStorage.getItem('vt')) return
    sessionStorage.setItem('vt', '1')
    sendVisitorRow()
  }, [])
}
