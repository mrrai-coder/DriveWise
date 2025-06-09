"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = "",
  prefix = "",
  separator = ",",
  decimals = 0,
  id, // Unique identifier for this counter
}) => {
  const [count, setCount] = useState(0)
  const counterRef = useRef(null)
  const hasAnimated = useRef(false)
  const animationFrameRef = useRef(null)

  // Check if this counter has already been animated in this session
  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const animatedKey = `counter_animated_${id}`
      const wasAnimated = sessionStorage.getItem(animatedKey)
      if (wasAnimated) {
        hasAnimated.current = true
        setCount(end)
      }
    }
  }, [id, end])

  const animateCounter = useCallback(() => {
    if (hasAnimated.current) return

    hasAnimated.current = true
    let startTime = null
    const startValue = 0

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Smoother easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(easeOutCubic * (end - startValue) + startValue)

      setCount(currentCount)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        // Animation completed
        setCount(end)
        if (typeof window !== "undefined" && id) {
          const animatedKey = `counter_animated_${id}`
          sessionStorage.setItem(animatedKey, "true")
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [end, duration, id])

  useEffect(() => {
    if (hasAnimated.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasAnimated.current) {
          // Add a small delay to make the animation more noticeable
          setTimeout(() => {
            animateCounter()
          }, 200)
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
      },
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animateCounter])

  const formatNumber = (num) => {
    if (separator && num >= 1000) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    }
    return num.toFixed(decimals)
  }

  return (
    <span ref={counterRef} className="animated-counter">
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}

export default AnimatedCounter
