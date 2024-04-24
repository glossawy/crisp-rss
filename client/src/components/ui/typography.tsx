import React, { PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

type Props = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

const headingClasses = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
  h6: 'scroll-m-20 text-md font-semibold tracking-tight',
} as const

const Title = React.forwardRef<
  HTMLHeadingElement,
  PropsWithChildren<Props> & React.HTMLAttributes<HTMLHeadingElement>
>(({ children, level, className, ...props }, ref) => {
  const headingElement = `h${level || 1}` as const
  const classes = cn(headingClasses[headingElement], className)

  return React.createElement(
    headingElement,
    { ref, className: classes, ...props },
    children,
  )
})
Title.displayName = 'Title'

const Text = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ children, className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('leading-7 [&:not(:first-child)]:mt-7', className)}
      {...props}
    >
      {children}
    </p>
  )
})
Text.displayName = 'Text'

export { Title, Text }
