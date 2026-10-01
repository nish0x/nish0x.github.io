import { useEffect, useRef } from 'react'
import { roles, links } from '../helper/constants'

export default function Hero() {
  const h1Ref = useRef(null)
  const typedRef = useRef(null)


  // Name animation
  useEffect(() => {
    const h1el = h1Ref.current
    if (!h1el) return
    // Clear any previously injected content (handles React StrictMode double-invoke)
    h1el.innerHTML = ''

    const lineData = [
      [{ t: 'Nishanth', cls: '' }, { t: ' ', cls: 'gap-span' }, { t: 'J', cls: 'italic-span' }, { t: ' ', cls: 'gap-span' }, { t: 'P', cls: 'italic-span' }]
    ]
    const allCharSpans = []
    lineData.forEach(line => {
      const lineDiv = document.createElement('div')
      line.forEach(part => {
        ;[...part.t].forEach(ch => {
          const span = document.createElement('span')
          span.className = 'char' + (part.cls ? ' ' + part.cls : '')
          span.textContent = ch
          span.style.opacity = '0'
          span.style.display = 'inline-block'
          lineDiv.appendChild(span)
          allCharSpans.push(span)
        })
      })
      h1el.appendChild(lineDiv)
    })

    function triggerGlow(span, delay) {
      setTimeout(() => {
        span.style.transition = 'none'
        span.style.opacity = '0'
        span.style.transform = 'scale(1.7)'
        span.style.filter = 'blur(4px)'
        requestAnimationFrame(() => requestAnimationFrame(() => {
          span.style.transition = 'opacity 0.4s ease, transform 0.5s cubic-bezier(.16,1,.3,1), filter 0.4s ease'
          span.style.opacity = '1'
          span.style.transform = 'scale(1)'
          span.style.filter = 'blur(0px)'
        }))
      }, delay)
    }

    const startDelay = 800
    let animIdx = 0
    allCharSpans.forEach(span => {
      const isSpace = span.textContent === ' ' || span.textContent.trim() === ''
      if (isSpace) { span.style.opacity = '1'; return }
      triggerGlow(span, startDelay + animIdx * 120)
      animIdx++
    })

    const introEnd = startDelay + allCharSpans.length * 160 + 600
    let waveTimeout
    function runWave() {
      let waveIdx = 0
      allCharSpans.forEach(ch => {
        const isSpace = ch.textContent === ' ' || ch.textContent.trim() === ''
        if (isSpace) return
        setTimeout(() => {
          ch.style.transition = 'transform 0.3s cubic-bezier(.16,1,.3,1)'
          ch.style.transform = 'scale(1.18)'
          setTimeout(() => {
            ch.style.transition = 'transform 0.45s cubic-bezier(.16,1,.3,1)'
            ch.style.transform = 'scale(1)'
          }, 260)
        }, waveIdx * 280)
        waveIdx++
      })
      waveTimeout = setTimeout(runWave, waveIdx * 280 + 3000)
    }
    const t = setTimeout(runWave, introEnd)
    return () => { clearTimeout(t); clearTimeout(waveTimeout) }
  }, [])

  // Typed roles
  useEffect(() => {
    let ri = 0, ci = 0, deleting = false
    const tel = typedRef.current
    if (!tel) return
    let timeout
    function type() {
      const word = roles[ri]
      if (!deleting) {
        tel.textContent = word.slice(0, ++ci)
        if (ci === word.length) { deleting = true; timeout = setTimeout(type, 1900); return }
      } else {
        tel.textContent = word.slice(0, --ci)
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length }
      }
      timeout = setTimeout(type, deleting ? 48 : 82)
    }
    const t = setTimeout(type, 2200)
    return () => { clearTimeout(t); clearTimeout(timeout) }
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero-photo-col">
        <div className="photo-scene">
          <div className="photo-main">
            <div className="photo-wrap">
              <div className="photo-ring"></div>
              <div className="photo-img-container">
                <img src="/nishanth.jpg" alt="Nishanth J P" loading="eager" />
              </div>
            </div>
            <img src="/cat.gif" alt="Cat" className="hero-cat" />
          </div>
        </div>
      </div>
      <div className="hero-content">
        <div className="eyebrow">
          <span className="pulse-dot"></span>Software Engineer &middot; Yottron Solutions
        </div>
        <h1 id="h1text" ref={h1Ref} aria-label="Nishanth J P"></h1>
        <p className="hero-sub">
          <span className="typed-wrap" ref={typedRef}></span><br />
          Crafting elegant digital experiences through clean code, thoughtful architecture, and a passion for building things that matter.
        </p>
        <div className="hero-cta">
          <a href={links.email} className="btn btn-p"><span>Get in Touch</span></a>
          <a href={links.github} target="_blank" rel="noopener" className="btn btn-g"><span>View GitHub</span></a>
        </div>
      </div>
    </section>
  )
}
