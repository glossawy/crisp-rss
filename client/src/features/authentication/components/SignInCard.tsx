import { Anchor, Card, Space, Title } from '@mantine/core'
import { useToggle } from '@mantine/hooks'

import { ContentHeader } from '@/components/ContentHeader'
import RegistrationForm from '@/features/authentication/components/RegistrationForm'
import SignInForm from '@/features/authentication/components/SignInForm'

import classes from './SignInCard.module.css'

export default function SignInCard() {
  const [authType, toggleAuthType] = useToggle(['login', 'register'] as const)

  return (
    <Card p="xl" radius="lg" className={classes.root}>
      <Card.Section>
        <ContentHeader
          leftSection={
            <Title>{authType === 'login' ? 'Sign In' : 'Register'}</Title>
          }
          rightSection={
            <Anchor component="button" onClick={() => toggleAuthType()}>
              {authType === 'login' ? 'Register Here' : 'Sign In'}
            </Anchor>
          }
        />
      </Card.Section>
      <Space h="md" />
      <Card.Section>
        {authType === 'login' ? <SignInForm /> : <RegistrationForm />}
      </Card.Section>
    </Card>
  )
}
