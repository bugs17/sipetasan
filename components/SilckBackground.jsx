'use client'

import { useEffect, useRef } from 'react'

export default function Silk({
  speed = 0.6,
  amplitude = 120,
  layers = 7,
  color = '#7c2ae8',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }

    resize()
    window.addEventListener('resize', resize)

    let t = 0

    const draw = () => {
      t += speed * 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = 'lighter'

      for (let l = 0; l < layers; l++) {
        const layerOffset = l * 0.6
        const alpha = 0.12 + l * 0.04
        const blur = 30 + l * 10

        ctx.save()
        ctx.filter = `blur(${blur}px)`
        ctx.strokeStyle = hexToRgba(color, alpha)
        ctx.lineWidth = 180

        ctx.beginPath()

        for (let x = -200; x <= canvas.width + 200; x += 20) {
          const y =
            canvas.height / 2 +
            Math.sin(x * 0.004 + t + layerOffset) * amplitude +
            Math.sin(x * 0.002 + t * 0.7) * 80

          if (x === -200) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        ctx.stroke()
        ctx.restore()
      }

      ctx.globalCompositeOperation = 'source-over'
      requestAnimationFrame(draw)
    }

    draw()

    return () => window.removeEventListener('resize', resize)
  }, [speed, amplitude, layers, color])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  )
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
