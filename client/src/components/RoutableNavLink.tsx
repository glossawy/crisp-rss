import { NavLink, NavLinkProps } from '@mantine/core'
import {
  AnyRoute,
  Link,
  LinkOptions,
  RegisteredRouter,
  RoutePaths,
} from '@tanstack/react-router'
import React from 'react'

type AdditionalProps = {
  navLink?: NavLinkProps
}

export default function RoutableNavLink<
  TRouteTree extends AnyRoute = RegisteredRouter['routeTree'],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = '',
  TMaskFrom extends RoutePaths<TRouteTree> | string = TFrom,
  TMaskTo extends string = '',
>({
  navLink,
  ...linkProps
}: LinkOptions<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo> & AdditionalProps) {
  return (
    <NavLink
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
      {...navLink}
    />
  )
}
