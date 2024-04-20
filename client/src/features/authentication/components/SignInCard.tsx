import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Title } from '@/components/ui/typography'
import SignInForm from '@/features/authentication/components/SignInForm'

export default function SignInCard() {
  return (
    <Card className="min-w-fit max-w-xl w-2/3 h-min">
      <CardHeader>
        <Title level={2}>Sign In</Title>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  )
}
