'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import SignatureCanvas from 'react-signature-canvas'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'

type Document = {
  id: string
  title: string
  status: 'Pendente' | 'Assinado'
  signedAt: Date | null
  signatureData: string | null
}

const formSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  signerName: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres')
})

export default function SignaturesPage() {
  const router = useRouter()
  const sigCanvas = useRef<SignatureCanvas>(null)
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'Contrato de Prestação de Serviços',
      status: 'Assinado',
      signedAt: new Date(2023, 10, 15),
      signatureData: 'data:image/png;base64,...'
    },
    {
      id: '2',
      title: 'Termo de Confidencialidade',
      status: 'Pendente',
      signedAt: null,
      signatureData: null
    }
  ])
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [isSigning, setIsSigning] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      signerName: ''
    }
  })

  const handleStartSigning = (doc: Document) => {
    setCurrentDocument(doc)
    setIsSigning(true)
    sigCanvas.current?.clear()
  }

  const handleClearSignature = () => {
    sigCanvas.current?.clear()
  }

  const handleSaveSignature = () => {
    if (!sigCanvas.current?.isEmpty()) {
      const signatureData = sigCanvas.current?.toDataURL()

      const updatedDocuments = documents.map((doc) =>
        doc.id === currentDocument?.id
          ? ({
              ...doc,
              status: 'Assinado' as 'Assinado',
              signedAt: new Date(),
              signatureData
            } as Document)
          : doc
      )

      setDocuments(updatedDocuments)
      setIsSigning(false)
      setCurrentDocument(null)

      toast.success('Documento assinado com sucesso!', {
        description: `Assinado em ${new Date().toLocaleString()}`
      })
    } else {
      toast.warning('Assinatura necessária', {
        description: 'Por favor, forneça sua assinatura antes de salvar.'
      })
    }
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newDocument: Document = {
      id: Math.random().toString(36).substring(2, 9),
      title: values.title,
      status: 'Pendente',
      signedAt: null,
      signatureData: null
    }

    setDocuments([newDocument, ...documents])
    form.reset()

    toast.success('Novo documento criado!', {
      description: 'Agora você pode solicitar a assinatura digital.'
    })
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Não assinado'
    return date.toLocaleString('pt-BR')
  }

  return (
    <div className="container mx-auto py-4 md:py-8 px-2 sm:px-4 space-y-4 md:space-y-6">
      {/* Formulário para criar novo documento - Responsivo */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Criar Novo Documento
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Preencha os campos abaixo para criar um novo documento para
            assinatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 md:space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-sm sm:text-base">
                      Título do Documento
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="Ex: Contrato de Serviços"
                        {...field}
                        className="text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="signerName"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-sm sm:text-base">
                      Nome do Signatário
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="Nome completo"
                        {...field}
                        className="text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full sm:w-auto">
                <Icons.plus className="mr-2 h-4 w-4" />
                <span className="text-sm sm:text-base">Criar Documento</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Lista de documentos - Responsivo */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Documentos para Assinatura
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Lista de documentos pendentes e já assinados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.length > 0 ? (
              documents.map((document) => (
                <div
                  key={document.id}
                  className="border rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                >
                  <div className="space-y-1 flex-1">
                    <h3 className="font-medium text-sm sm:text-base">
                      {document.title}
                    </h3>
                    <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                      <Badge
                        variant={
                          document.status === 'Assinado'
                            ? 'default'
                            : 'secondary'
                        }
                        className="w-fit"
                      >
                        {document.status}
                      </Badge>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {formatDate(document.signedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 justify-end">
                    {document.status === 'Pendente' && (
                      <Button
                        variant="outline"
                        onClick={() => handleStartSigning(document)}
                        className="h-8 px-2 sm:px-4 text-xs sm:text-sm"
                      >
                        <Icons.pen className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Assinar</span>
                      </Button>
                    )}
                    {document.status === 'Assinado' &&
                      document.signatureData && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setCurrentDocument(document)
                            setIsSigning(true)
                          }}
                          className="h-8 px-2 sm:px-4 text-xs sm:text-sm"
                        >
                          <Icons.eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Ver</span>
                        </Button>
                      )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-sm sm:text-base text-muted-foreground">
                Nenhum documento encontrado. Crie seu primeiro documento acima.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de assinatura - Responsivo */}
      {isSigning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <Card className="w-full max-w-md sm:max-w-2xl">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                Assinar Documento
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {currentDocument?.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="border rounded-lg p-1 sm:p-2">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{
                    width: '100%',
                    height: 150,
                    className: 'signature-canvas bg-white w-full'
                  }}
                />
              </div>
              <div className="mt-3 sm:mt-4">
                <Label className="text-sm sm:text-base">
                  Nome do Signatário
                </Label>
                <Input
                  placeholder="Seu nome completo"
                  className="mt-1 text-sm sm:text-base"
                  value={
                    currentDocument?.status === 'Assinado'
                      ? 'Documento já assinado'
                      : ''
                  }
                  readOnly
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 p-4 sm:p-6">
              <Button
                variant="outline"
                onClick={handleClearSignature}
                className="w-full sm:w-auto"
              >
                <Icons.undo className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span>Limpar</span>
              </Button>
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSigning(false)
                    setCurrentDocument(null)
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Cancelar
                </Button>
                {currentDocument?.status === 'Pendente' && (
                  <Button
                    onClick={handleSaveSignature}
                    className="flex-1 sm:flex-none"
                  >
                    <Icons.save className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Salvar</span>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
