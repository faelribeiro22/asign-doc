// app/documents/page.tsx
import { getServerSession } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Icons } from '@/components/ui/icons'
import Link from 'next/link'
import { formatDate, formatFileSize } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DocumentUploadModal } from '@/components/document-modal'
import { authOptions } from '../api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <p>Por favor, faça login para visualizar seus documentos.</p>
      </div>
    )
  }

  const documents = await prisma.document.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const statusVariant = (status: string) => {
    switch (status) {
      case 'SIGNED':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'ARCHIVED':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Documentos</h1>
        <DocumentUploadModal>
          <Button>
            <Icons.upload className="mr-2 h-4 w-4" />
            Novo Documento
          </Button>
        </DocumentUploadModal>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell>{doc.fileName}</TableCell>
                  <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(doc.status)}>
                      {doc.status === 'SIGNED' ? 'Assinado' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(doc.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/documentos/${doc.id}`}>
                          {doc.status === 'PENDING' ? 'Assinar' : 'Visualizar'}
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
