'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { toast } from 'sonner'

// Esquema de validação com Zod
const formSchema = z.object({
  email: z
    .string()
    .email('Digite um e-mail válido')
    .min(5, 'E-mail muito curto'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(32, 'A senha não pode ter mais de 32 caracteres')
})

type FormData = z.infer<typeof formSchema>

export default function LoginPage() {
  const router = useRouter()

  // Inicialização do React Hook Form com Zod
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      // Mostrar loading
      const loadingToast = toast.loading('Processando login...')

      // Simular uma requisição de login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Aqui você faria a chamada real para sua API de autenticação
      // const response = await fetch('/api/auth/login', { ... })

      // Simulando login bem-sucedido
      toast.success('Login realizado com sucesso!', {
        id: loadingToast,
        description: 'Você será redirecionado para o dashboard'
      })

      router.push('/documentos')
    } catch (err) {
      toast.error('Erro no login', {
        description: 'Credenciais inválidas. Por favor, tente novamente.'
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Digite seu e-mail e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-6">
            <Button variant="outline" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
            <Button variant="outline" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.gitHub className="mr-2 h-4 w-4" />
              )}
              GitHub
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        autoComplete="current-password"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Entrar
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Button
            variant="link"
            className="text-sm"
            disabled={form.formState.isSubmitting}
          >
            Esqueceu sua senha?
          </Button>
          <div className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Button
              variant="link"
              className="p-0 text-sm"
              disabled={form.formState.isSubmitting}
            >
              Cadastre-se
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
