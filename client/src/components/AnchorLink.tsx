import { Anchor, AnchorProps } from '@mantine/core'
import {
  AnyRoute,
  Link,
  LinkOptions,
  RegisteredRouter,
  RoutePaths,
} from '@tanstack/react-router'
import React from 'react'

type AdditionalProps = React.PropsWithChildren<{
  anchor?: AnchorProps
}>

export default function AnchorLink<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = '',
  TMaskFrom extends RoutePaths<TRouteTree> | string = TFrom,
  TMaskTo extends string = '',
>({
  anchor,
  ...linkProps
}: LinkOptions<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo> & AdditionalProps) {
  return (
    <Anchor
      component={(
        props: React.PropsWithoutRef<Omit<React.HTMLProps<'a'>, 'preload'>>,
      ) => {
        const { search, params, ...linkSubProps } = linkProps
        return (
          <Link
            {...linkSubProps}
            search={search as any} // eslint-disable-line
            params={params as any} // eslint-disable-line
            {...props}
          />
        )
      }}
      {...anchor}
    />
  )
}
