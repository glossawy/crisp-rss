import { ActionIcon, TextInput, TextInputProps } from '@mantine/core'
import { useToggle } from '@mantine/hooks'
import { IconEye, IconEyeClosed } from '@tabler/icons-react'
import { forwardRef } from 'react'

type Props = { revealable?: boolean } & TextInputProps

export const SecretInput = forwardRef<HTMLInputElement, Props>(
  ({ revealable, ...inputProps }, ref) => {
    const [showText, toggleShowText] = useToggle([false, true])

    if (revealable)
      return (
        <TextInput
          {...inputProps}
          type={showText ? 'text' : 'password'}
          rightSection={
            <ActionIcon
              variant="subtle"
              color="gray"
              tabIndex={-1}
              onMouseDown={(evt) => {
                evt.preventDefault()
                toggleShowText()
              }}
            >
              {showText ? <IconEye /> : <IconEyeClosed />}
            </ActionIcon>
          }
        />
      )
    else return <TextInput type="password" {...inputProps} ref={ref} />
  },
)
