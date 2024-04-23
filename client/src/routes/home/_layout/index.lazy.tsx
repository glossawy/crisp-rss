import { Link, createLazyFileRoute } from '@tanstack/react-router'

import { Affix } from '@/components/Affix'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Title } from '@/components/ui/typography'
import CurrentUserPill from '@/features/users/components/CurrentUserPill'

export const Route = createLazyFileRoute('/home/_layout/')({
  component: () => {
    return (
      <div className="h-full flex flex-col">
        <Affix>
          <CurrentUserPill className="absolute top-5 right-5" />
        </Affix>
        <ResizablePanelGroup className="flex-grow" direction="horizontal">
          <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
            <Link to="/home">
              <Title level={2}>CrispRSS</Title>
            </Link>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={90}>Test</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    )
  },
})
