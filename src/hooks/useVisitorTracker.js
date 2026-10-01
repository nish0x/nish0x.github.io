import { useEffect } from 'react'

const ENDPOINT =
  'https://script.google.com/macros/s/AKfycbw3MvNtTGJ8wh7HE9wsNrFBdWaawAmTeu1QnMaDdJzve45YeAOT4pGScMM7seZT3SVv/exec'

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

export default function useVisitorTracker() {
  useEffect(() => {
    if (sessionStorage.getItem('vt')) return
    sessionStorage.setItem('vt', '1')

    ;(async () => {
      const info = await getIpInfo()
      const { device, browser } = detectDevice()
      fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          ...info,
          language: navigator.language || '',
          device,
          browser,
          screen: `${screen.width}x${screen.height}`,
        }),
      }).catch(() => {
        // tracking is best-effort, never block the page
      })
    })()
  }, [])
}
