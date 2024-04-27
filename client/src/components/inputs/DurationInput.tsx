import { TextInput, TextInputProps } from '@mantine/core'
import { forwardRef, useCallback, useState } from 'react'

type Props = TextInputProps

const mask = '99:99:99'

export const DurationInput = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    const { onChange, value, defaultValue, ...inputProps } = props
    const [duration, setDuration] = useState(value || defaultValue || '')

    const handleChange = useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newDuration = evt.target.value
        const update = () => {
          setDuration(newDuration)
          onChange && onChange(evt)
        }

        if (newDuration.length > mask.length) return

        const lastCharacter = newDuration[newDuration.length - 1]
        const maskChar = mask[newDuration.length - 1]

        if (maskChar === '9' && /\d/.test(lastCharacter)) {
          update()
        } else if (maskChar === lastCharacter) {
          setDuration(newDuration)
        }
      },
      [onChange],
    )

    return (
      <TextInput
        ref={ref}
        placeholder="dd:hh:mm (e.g. 01:30 for every 1.5 hours)"
        description="How often to fetch new entries for the feed"
        value={duration}
        onChange={handleChange}
        {...inputProps}
      />
    )
  },
)
