import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, ButtonVariant, Group, Space } from '@mantine/core'
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react'
import { useState } from 'react'
import {
  Controller,
  DefaultValues,
  FieldValues,
  FormProvider,
  Path,
  UseFormReturn,
  useForm,
} from 'react-hook-form'
import { z } from 'zod'

type ButtonsProps = { variant: ButtonVariant; disabled?: boolean }

type Props<TFieldValues extends FieldValues> = {
  schema: z.ZodSchema<TFieldValues>
  defaults?: DefaultValues<TFieldValues>
  buttons?: (props: ButtonsProps) => React.ReactNode
  buttonsRight?: boolean
  buttonsVariant?: ButtonVariant
  onSubmit: (params: {
    form: UseFormReturn<TFieldValues>
    setAlert: (content: AlertContent | null) => void
    values: TFieldValues
  }) => void | Promise<void>
  children:
    | React.ReactNode
    | ((
        Controlled: PartiallyAppliedControlled<TFieldValues>,
      ) => React.ReactNode)
}

type AlertContent = { danger: boolean; message: string; icon?: React.ReactNode }

type RequiredInputProps = {
  label?: React.ReactNode
  error?: React.ReactNode
}

type ControlledProps<
  TFieldValues extends FieldValues,
  TInputProps extends RequiredInputProps,
> = TInputProps & {
  component: React.ComponentType<TInputProps>
  label: React.ReactNode
  name: Path<TFieldValues>
}

type Controlled = <
  TFieldValues extends FieldValues,
  TProps extends RequiredInputProps,
>(
  props: ControlledProps<TFieldValues, TProps>,
) => React.ReactNode

type PartiallyAppliedControlled<TFieldValues extends FieldValues> = <
  TProps extends RequiredInputProps,
>(
  props: ControlledProps<TFieldValues, TProps>,
) => React.ReactNode

const ControlledField: Controlled = <
  TFieldValues extends FieldValues,
  TProps extends RequiredInputProps,
>({
  label,
  name,
  component,
  ...inputProps
}: ControlledProps<TFieldValues, TProps>) => {
  const Component = component
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Component
          label={label}
          error={error?.message}
          // TODO: Resolve this typecast
          {...(inputProps as unknown as TProps)}
          {...field}
        />
      )}
    />
  )
}

export default function CrispForm<TFieldValues extends FieldValues>({
  schema,
  defaults,
  buttons,
  buttonsRight,
  buttonsVariant,
  onSubmit,
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

  const handleSubmit = form.handleSubmit((values) => {
    const rvalue = onSubmit({ form, setAlert: setAlertContent, values })

    if (rvalue instanceof Promise) {
      return rvalue.finally(() => form.reset(values))
    } else {
      form.reset(values)
    }
  })

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit}
        onChange={() => {
          setAlertContent(null)
        }}
      >
        {typeof children === 'function' ? children(ControlledField) : children}
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
