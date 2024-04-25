import { Card } from '@mantine/core'

import SignInForm from '@/features/authentication/components/SignInForm'

import classes from './SignInCard.module.css'

export default function SignInCard() {
  return (
    <Card p="xl" radius="lg" className={classes.root}>
      <Card.Section>
        <SignInForm />
      </Card.Section>
    </Card>
  )
}
