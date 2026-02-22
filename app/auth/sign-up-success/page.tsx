import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 text-foreground">
            <GraduationCap className="h-8 w-8" />
            <span className="text-xl font-semibold font-sans">SiGu</span>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Registro exitoso</CardTitle>
              <CardDescription>Revisa tu correo para confirmar</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Te hemos enviado un correo de confirmacion. Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
