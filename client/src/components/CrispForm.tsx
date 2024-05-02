import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, ButtonVariant, Group, Space } from '@mantine/core'
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react'
import React, { useMemo, useState } from 'react'
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  UseFormReturn,
  useForm,
} from 'react-hook-form'
import { z } from 'zod'

type ButtonsProps = { variant: ButtonVariant; disabled?: boolean }

type Props<TFieldValues extends FieldValues> = React.PropsWithChildren<{
  schema: z.ZodSchema<TFieldValues>
  defaults?: DefaultValues<TFieldValues>
  buttons?: (props: ButtonsProps) => React.ReactNode
  buttonsRight?: boolean
  buttonsVariant?: ButtonVariant
  onSubmitFactory: (props: {
    setAlert: (alertContent: AlertContent | null) => void
    form: UseFormReturn<TFieldValues>
  }) => (values: TFieldValues) => void | Promise<void>
}>

type AlertContent = { danger: boolean; message: string; icon?: React.ReactNode }

export default function CrispForm<TFieldValues extends FieldValues>({
  schema,
  defaults,
  buttons,
  buttonsRight,
  buttonsVariant,
  onSubmitFactory,
  children,
}: Props<TFieldValues>) {
  const form = useForm<TFieldValues>({
    defaultValues: defaults,
    resolver: zodResolver(schema),
    mode: 'onTouched',
  })

  const [alertContent, setAlertContent] = useState<AlertContent | null>(null)

  const variant = buttonsVariant == null ? 'outline' : buttonsVariant

  const alert =
    alertContent == null ? null : (
      <Alert
        variant="transparent"
        color={alertContent.danger ? 'red' : 'green'}
        flex={1}
        p={0}
        title={alertContent.message}
        icon={
          alertContent.icon ? (
            alertContent.icon
          ) : alertContent.danger ? (
            <IconExclamationCircle />
          ) : (
            <IconCheck />
          )
        }
      />
    )

  const submitDisabled =
    !form.formState.isValid || form.formState.isSubmitting || alert != null

  const clientSubmit = useMemo(
    () => onSubmitFactory({ setAlert: setAlertContent, form }),
    [onSubmitFactory, setAlertContent],
  )

  const onSubmit = form.handleSubmit((values) => {
    const rvalue = clientSubmit(values)

    if (rvalue instanceof Promise) {
      return rvalue.finally(() => form.reset(values))
    } else {
      form.reset(values)
    }
  })

  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit}
        onChange={() => {
          setAlertContent(null)
        }}
      >
        {children}
        <Space h="md" />
        <Group align="center" justify={buttonsRight ? 'end' : 'start'}>
          {buttonsRight ? alert : null}
          {buttons ? (
            buttons({ variant, disabled: submitDisabled })
          ) : (
            <Button type="submit" variant={variant} disabled={submitDisabled}>
              Submit
            </Button>
          )}
          {buttonsRight ? null : alert}
        </Group>
      </form>
    </FormProvider>
  )
}
