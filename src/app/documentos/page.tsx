'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Icons } from '@/components/ui/icons'

// Tipos e esquemas
type Document = {
  id: string
  name: string
  size: number
  uploadedAt: Date
  url: string
}

const formSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'O arquivo deve ter no máximo 5MB'
    })
    .refine((file) => file.type === 'application/pdf', {
      message: 'Apenas arquivos PDF são permitidos'
    })
})

export default function DocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Contrato de Serviços.pdf',
      size: 2.4 * 1024 * 1024,
      uploadedAt: new Date(2023, 10, 15),
      url: '/sample.pdf'
    },
    {
      id: '2',
      name: 'Relatório Anual.pdf',
      size: 1.8 * 1024 * 1024,
      uploadedAt: new Date(2023, 9, 22),
      url: '/sample.pdf'
    }
  ])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  )
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  )
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const fileRef = form.register('file')

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const loadingToast = toast.loading('Enviando documento...')

      // Simular upload do arquivo
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Aqui você faria o upload real para seu backend
      // const formData = new FormData();
      // formData.append("file", values.file);
      // const response = await fetch('/api/documents', { method: 'POST', body: formData });

      // Adicionar o novo documento à lista
      const newDocument: Document = {
        id: Math.random().toString(36).substring(2, 9),
        name: values.file.name,
        size: values.file.size,
        uploadedAt: new Date(),
        url: URL.createObjectURL(values.file)
      }

      setDocuments([newDocument, ...documents])
      setIsUploadDialogOpen(false)
      form.reset()

      toast.success('Documento enviado com sucesso!', {
        id: loadingToast
      })
    } catch (error) {
      toast.error('Erro ao enviar documento', {
        description:
          'Ocorreu um erro ao enviar o arquivo. Por favor, tente novamente.'
      })
    }
  }

  const handleDelete = async () => {
    if (!documentToDelete) return

    try {
      const loadingToast = toast.loading('Excluindo documento...')

      // Simular exclusão
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Aqui você faria a chamada real para sua API de exclusão
      // await fetch(`/api/documents/${documentToDelete.id}`, { method: 'DELETE' });

      setDocuments(documents.filter((doc) => doc.id !== documentToDelete.id))
      setDocumentToDelete(null)

      toast.success('Documento excluído com sucesso!', {
        id: loadingToast
      })
    } catch (error) {
      toast.error('Erro ao excluir documento', {
        description:
          'Ocorreu um erro ao excluir o arquivo. Por favor, tente novamente.'
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Meus Documentos</CardTitle>
              <CardDescription>
                Gerencie todos os seus documentos em um só lugar
              </CardDescription>
            </div>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Icons.upload className="mr-2 h-4 w-4" />
              Enviar Documento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Data de Upload</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length > 0 ? (
                documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">
                      {document.name}
                    </TableCell>
                    <TableCell>{formatFileSize(document.size)}</TableCell>
                    <TableCell>{formatDate(document.uploadedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <Icons.moreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedDocument(document)}
                          >
                            <Icons.eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDocumentToDelete(document)}
                          >
                            <Icons.trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum documento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Upload */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar novo documento</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <Input type="file" accept=".pdf" {...fileRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsUploadDialogOpen(false)
                    form.reset()
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  <Icons.upload className="mr-2 h-4 w-4" />
                  Enviar
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização */}
      <Dialog
        open={!!selectedDocument}
        onOpenChange={(open) => !open && setSelectedDocument(null)}
      >
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1">
            {selectedDocument && (
              <iframe
                src={selectedDocument.url}
                className="w-full h-full border rounded-md"
                title={selectedDocument.name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmação de Exclusão */}
      <AlertDialog
        open={!!documentToDelete}
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O documento será permanentemente
              removido do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
