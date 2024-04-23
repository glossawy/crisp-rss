import { forwardRef } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Pill = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<React.ComponentPropsWithoutRef<'button'>>
>(({ className, ...btnProps }, ref) => {
  return (
    <Button
      className={cn('py2 px-4 shadow-md rounded-full', className)}
      variant="outline"
      {...btnProps}
      ref={ref}
    />
  )
})
