// app/documents/[id]/page.tsx
import { getServerSession } from 'next-auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { DocumentViewer } from '@/components/document-viewer'
import Link from 'next/link'
import SignDocumentForm from './sign-document-form'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export default async function SignDocumentPage({
  params
}: {
  params: { id: string }
}) {
  // Garante que params está disponível
  if (!params?.id) {
    return (
      <div className="container mx-auto py-8">
        <p>ID do documento não fornecido.</p>
        <Link href="/documents" className="text-blue-500 hover:underline">
          Voltar para a lista de documentos
        </Link>
      </div>
    )
  }

  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return (
      <div className="container mx-auto py-8">
        <p>Por favor, faça login para visualizar este documento.</p>
      </div>
    )
  }

  try {
    const document = await prisma.document.findUnique({
      where: {
        id: params.id, // Agora params.id está seguro para usar
        userId: session.user.id
      },
      include: {
        signature: true
      }
    })

    if (!document) {
      return (
        <div className="container mx-auto py-8">
          <p>
            Documento não encontrado ou você não tem permissão para acessá-lo.
          </p>
          <Link href="/documents" className="text-blue-500 hover:underline">
            Voltar para a lista de documentos
          </Link>
        </div>
      )
    }

    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>{document.title}</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <DocumentViewer url={document.fileUrl} />
            </div>

            {document.status === 'PENDING' ? (
              <SignDocumentForm documentId={document.id} />
            ) : (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Assinado por:</h3>
                  <p>{document.signature?.signedBy}</p>
                  <p className="text-sm text-muted-foreground">
                    Em {document.signature?.signedAt.toLocaleString()}
                  </p>
                  <div className="mt-4">
                    <img
                      src={document.signature?.signature}
                      alt="Assinatura"
                      className="max-w-full h-auto border rounded"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link href="/documentos">Voltar</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Error fetching document:', error)
    return (
      <div className="container mx-auto py-8">
        <p>Ocorreu um erro ao carregar o documento.</p>
        <Link href="/documentos" className="text-blue-500 hover:underline">
          Voltar para a lista de documentos
        </Link>
      </div>
    )
  }
}
