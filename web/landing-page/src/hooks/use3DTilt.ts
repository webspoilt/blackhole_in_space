'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface TiltState {
    rotateX: number
    rotateY: number
    scale: number
}

interface Use3DTiltOptions {
    maxRotation?: number
    perspective?: number
    scale?: number
    transitionDuration?: number
}

interface Use3DTiltResult {
    style: React.CSSProperties
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => void
    onMouseEnter: () => void
    onMouseLeave: () => void
    ref: React.RefObject<HTMLElement>
}

/**
 * Custom hook for creating 3D tilt effects on elements
 * 
 * @param options Configuration options for the tilt effect
 * @returns Object containing style, event handlers, and ref
 * 
 * @example
 * ```tsx
 * const { style, onMouseMove, onMouseEnter, onMouseLeave, ref } = use3DTilt()
 * 
 * return (
 *   <div
 *     ref={ref as React.RefObject<HTMLDivElement>}
 *     style={style}
 *     onMouseMove={onMouseMove}
 *     onMouseEnter={onMouseEnter}
 *     onMouseLeave={onMouseLeave}
 *   >
 *     Content
 *   </div>
 * )
 * ```
 */
export function use3DTilt(options: Use3DTiltOptions = {}): Use3DTiltResult {
    const {
        maxRotation = 15,
        perspective = 1000,
        scale = 1.02,
        transitionDuration = 300
    } = options

    const [tilt, setTilt] = useState<TiltState>({
        rotateX: 0,
        rotateY: 0,
        scale: 1
    })

    const [isHovering, setIsHovering] = useState(false)
    const ref = useRef<HTMLElement>(null)

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Calculate rotation based on mouse position relative to center
        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * maxRotation
        const rotateX = ((centerY - e.clientY) / (rect.height / 2)) * maxRotation

        setTilt({
            rotateX,
            rotateY,
            scale
        })
    }, [maxRotation, scale])

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true)
        setTilt(prev => ({ ...prev, scale }))
    }, [scale])

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false)
        setTilt({
            rotateX: 0,
            rotateY: 0,
            scale: 1
        })
    }, [])

    const style: React.CSSProperties = {
        transform: `perspective(${perspective}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
        transition: isHovering ? `transform ${transitionDuration}ms cubic-bezier(0.33, 1, 0.68, 1)` : `transform ${transitionDuration * 2}ms cubic-bezier(0.33, 1, 0.68, 1)`,
        transformStyle: 'preserve-3d' as const,
        willChange: 'transform'
    }

    return {
        style,
        onMouseMove: handleMouseMove,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        ref
    }
}

export default use3DTilt
