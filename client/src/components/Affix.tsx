import { forwardRef, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

// Shamelessly adapted and simplified form of https://mantine.dev/core/affix/

function createPortalNode(props: React.ComponentPropsWithoutRef<'div'>) {
  const node = document.createElement('div')
  node.setAttribute('data-portal', 'true')

  if (typeof props.className === 'string')
    node.className = cn(node.className, props.className)

  if (typeof props.style === 'object') Object.assign(node.style, props.style)

  if (typeof props.id === 'string') node.setAttribute('id', props.id)

  return node
}

export const Affix = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & { children: React.ReactNode }
>((props, ref) => {
  const { children, ...divProps } = props

  const [mounted, setMounted] = useState(false)
  const portalRef = useRef<HTMLDivElement>()

  useEffect(() => {
    setMounted(true)

    portalRef.current = createPortalNode(divProps)

    if (typeof ref === 'function') {
      ref(portalRef.current)
    } else if (ref && typeof ref === 'object') {
      ref.current = portalRef.current
    }

    if (portalRef.current) document.body.appendChild(portalRef.current)

    return () => {
      if (portalRef.current) document.body.removeChild(portalRef.current)
    }
  }, [])

  if (!mounted || !portalRef.current) return null

  return createPortal(<>{children}</>, portalRef.current)
})
