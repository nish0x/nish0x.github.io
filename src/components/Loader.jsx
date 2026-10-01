import { useEffect, useState } from 'react'
import ShapeLoader from './ShapeLoader'

export default function Loader() {
  const [hidden, setHidden] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setHidden(true), 400)
    const t2 = setTimeout(() => setRemoved(true), 1200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (removed) return null
  return (
    <div id="loader" className={hidden ? 'hide' : ''}>
      <ShapeLoader />
    </div>
  )
}
