import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Pill } from '@/components/ui/pill'
import { Text } from '@/components/ui/typography'
import useAuth from '@/features/authentication/hooks/useAuth'
import useSession from '@/features/authentication/hooks/useSession'
import UserPill from '@/features/users/components/UserPill'

type Props = Omit<React.ComponentProps<typeof UserPill>, 'userId'>

export default function CurrentUserPill(props: Props) {
  const { userId } = useSession()
  const { logout } = useAuth()
  const [showOptions, setShowOptions] = useState(false)

  const { className, ...pillProps } = props

  if (!userId) return <Pill {...props}>Not Logged In</Pill>

  return (
    <Collapsible
      open={showOptions}
      onOpenChange={setShowOptions}
      className={className}
    >
      <CollapsibleTrigger asChild>
        <UserPill {...pillProps} userId={userId} />
      </CollapsibleTrigger>
      <CollapsibleContent className="absolute z-50 w-32 mt-2 right-1 rounded-md border border-slate-200 bg-white text-slate-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
        <Button
          className="w-full justify-start"
          variant="ghost"
          onClick={logout}
        >
          <Text className="text-md">Logout</Text>
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )
}
