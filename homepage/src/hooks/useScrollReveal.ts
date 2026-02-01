'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseScrollRevealOptions {
    threshold?: number
    rootMargin?: string
    triggerOnce?: boolean
    delay?: number
}

interface UseScrollRevealResult {
    ref: React.RefObject<HTMLElement>
    isVisible: boolean
    style: React.CSSProperties
}

/**
 * Custom hook for scroll-triggered reveal animations
 * 
 * @param options Configuration options for the scroll reveal
 * @returns Object containing ref, visibility state, and ready-to-apply styles
 * 
 * @example
 * ```tsx
 * const { ref, isVisible, style } = useScrollReveal({ delay: 200 })
 * 
 * return (
 *   <div ref={ref as React.RefObject<HTMLDivElement>} style={style}>
 *     Content that reveals on scroll
 *   </div>
 * )
 * ```
 */
export function useScrollReveal(options: UseScrollRevealOptions = {}): UseScrollRevealResult {
    const {
        threshold = 0.1,
        rootMargin = '0px 0px -50px 0px',
        triggerOnce = true,
        delay = 0
    } = options

    const ref = useRef<HTMLElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [hasTriggered, setHasTriggered] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        // Check if IntersectionObserver is available
        if (typeof IntersectionObserver === 'undefined') {
            setIsVisible(true)
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (triggerOnce && hasTriggered) return

                        // Apply delay if specified
                        if (delay > 0) {
                            setTimeout(() => {
                                setIsVisible(true)
                                setHasTriggered(true)
                            }, delay)
                        } else {
                            setIsVisible(true)
                            setHasTriggered(true)
                        }
                    } else if (!triggerOnce) {
                        setIsVisible(false)
                    }
                })
            },
            {
                threshold,
                rootMargin
            }
        )

        observer.observe(element)

        return () => {
            observer.disconnect()
        }
    }, [threshold, rootMargin, triggerOnce, delay, hasTriggered])

    const style: React.CSSProperties = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 800ms cubic-bezier(0.33, 1, 0.68, 1), transform 800ms cubic-bezier(0.33, 1, 0.68, 1)',
        willChange: 'opacity, transform'
    }

    return {
        ref,
        isVisible,
        style
    }
}

/**
 * Hook variant that returns multiple refs for staggered animations
 * 
 * @param count Number of elements to animate
 * @param staggerDelay Delay between each element in ms
 * @param options Base options for scroll reveal
 */
export function useStaggeredScrollReveal(
    count: number,
    staggerDelay: number = 100,
    options: UseScrollRevealOptions = {}
) {
    const results = Array.from({ length: count }, (_, index) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useScrollReveal({
            ...options,
            delay: (options.delay || 0) + index * staggerDelay
        })
    })

    return results
}

export default useScrollReveal
