// app/api/documents/[id]/sign/route.ts
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || !session.user.name) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { signature } = await request.json()

  try {
    // Verifica se o documento existe e pertence ao usuário
    const document = await prisma.document.findUnique({
      where: {
        id: params.id,
        user: { email: session.user.email }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Atualiza o documento e cria a assinatura
    const [updatedDoc] = await prisma.$transaction([
      prisma.document.update({
        where: { id: params.id },
        data: { status: 'SIGNED' }
      }),
      prisma.signature.create({
        data: {
          documentId: params.id,
          signature,
          signedBy: session.user.name,
          userId: session.user.id
        }
      })
    ])

    return NextResponse.json(updatedDoc)
  } catch (error) {
    console.error('Signing error:', error)
    return NextResponse.json(
      { error: 'Failed to sign document' },
      { status: 500 }
    )
  }
}
