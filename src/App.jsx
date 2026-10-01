import { useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import { useScrollReveal } from './hooks/useScrollReveal'
import useVisitorTracker from './hooks/useVisitorTracker'
import Features from './helper/features'

import './styles/base.css'
import './styles/background.css'
import './styles/header.css'
import './styles/hero.css'
import './styles/marquee.css'
import './styles/about.css'
import './styles/stats.css'
import './styles/skills.css'
import './styles/experience.css'
import './styles/contact.css'
import './styles/footer.css'
import './styles/animations.css'
import './styles/loader.css'
import './styles/shapeloader.css'
import './styles/donate.css'
import './styles/techstacks.css'
import './styles/responsive.css'
import './styles/uiverse-cards.css'
import './styles/music.css'
import './styles/theme-toggle.css'
import './styles/transitions.css'

export default function App() {
  const { isLight, toggle } = useTheme()
  useScrollReveal()
  useVisitorTracker()

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const navLinks = document.querySelectorAll('nav a')
    function onScroll() {
      const scrollY = window.scrollY
      let current = ''
      sections.forEach(sec => { if (scrollY >= sec.offsetTop - 120) current = sec.id })
      if (window.innerHeight + scrollY >= document.body.scrollHeight - 60)
        current = sections[sections.length - 1]?.id || ''
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <Features isLight={isLight} toggleTheme={toggle} />
}
