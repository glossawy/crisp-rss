import {
  PolymorphicComponentProps,
  UnstyledButton,
  UnstyledButtonProps,
} from '@mantine/core'
import clsx from 'clsx'

import classes from './PillCard.module.css'

type Props = React.PropsWithChildren<
  PolymorphicComponentProps<'button', UnstyledButtonProps>
>

export default function PillCard({ children, className, ...btnProps }: Props) {
  return (
    <UnstyledButton {...btnProps} className={clsx(classes.pill, className)}>
      {children}
    </UnstyledButton>
  )
}
