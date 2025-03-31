// actions/document-actions.ts
'use server'

import { getServerSession } from 'next-auth'
import fs from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function uploadDocument(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const title = formData.get('title') as string
  const file = formData.get('file') as File

  try {
    // Cria o diretório de uploads se não existir
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    // Gera um nome único para o arquivo
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${uniqueSuffix}-${file.name}`
    const filePath = path.join(uploadDir, filename)

    // Converte o arquivo para Buffer e salva
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await fs.writeFile(filePath, buffer)

    // Salva no banco de dados
    await prisma.document.create({
      data: {
        title,
        fileUrl: `/uploads/${filename}`,
        fileName: file.name,
        fileSize: file.size,
        userId: session.user.id
      }
    })

    // Atualiza o cache da página de documentos
    revalidatePath('/documents')

    return { success: true }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Failed to upload document' }
  }
}
