import { Outlet, createFileRoute } from '@tanstack/react-router'

import { Affix } from '@/components/Affix'
import Sidebar from '@/components/Sidebar'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import AuthRedirect from '@/features/authentication/components/AuthRedirect'
import { redirectWhenUnauthenticated } from '@/features/authentication/lib/utils'
import CurrentUserPill from '@/features/users/components/CurrentUserPill'

export const Route = createFileRoute('/_auth')({
  beforeLoad({ location }) {
    redirectWhenUnauthenticated(location)
  },
  component: () => (
    <AuthRedirect>
      <div className="h-full flex flex-col">
        <Affix>
          <CurrentUserPill className="absolute top-5 right-5" />
        </Affix>
        <ResizablePanelGroup className="flex-grow" direction="horizontal">
          <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={90}>
            <Outlet />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AuthRedirect>
  ),
})
