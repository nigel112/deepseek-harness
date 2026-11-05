import { useEffect, useMemo, useState } from 'react'
import { DROP } from '../data/site'

const DROP_INTERVAL = 14 * 24 * 60 * 60 * 1000

function nextDropTime(date: string) {
  let target = new Date(date).getTime()
  const now = Date.now()
  if (Number.isNaN(target)) return now + DROP_INTERVAL
  while (target < now) target += DROP_INTERVAL
  return target
}

function split(remaining: number) {
  const total = Math.max(0, remaining)
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  }
}

export function Countdown() {
  const target = useMemo(() => nextDropTime(DROP.date), [])
  const [parts, setParts] = useState(() => split(target - Date.now()))
  useEffect(() => {
    const tick = () => setParts(split(target - Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [target])

  const cells = [
    { label: 'Days', value: parts.days },
    { label: 'Hours', value: parts.hours },
    { label: 'Minutes', value: parts.minutes },
    { label: 'Seconds', value: parts.seconds },
  ]

  return (
    <div className="countdown" role="timer" aria-live="off">
      {cells.map((cell) => (
        <div key={cell.label} className="countdown__cell">
          <span className="countdown__value">{String(cell.value).padStart(2, '0')}</span>
          <span className="countdown__label">{cell.label}</span>
        </div>
      ))}
    </div>
  )
}
