import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export const config = {
  api: {
    bodyParser: false // Desativa o bodyParser padrão para lidar com FormData
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Cria um buffer do corpo da requisição
  const formData = await request.formData()
  const file = formData.get('file') as File
  const title = formData.get('title') as string

  if (!file || !title) {
    return NextResponse.json(
      { error: 'File and title are required' },
      { status: 400 }
    )
  }

  try {
    // Converte o arquivo para Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Aqui você pode:
    // 1. Fazer upload para um serviço como AWS S3, Google Cloud Storage, etc.
    // 2. Salvar localmente (não recomendado para produção)

    // Exemplo com armazenamento local (apenas para desenvolvimento)
    const fs = require('fs')
    const path = require('path')

    const uploadDir = path.join(process.cwd(), 'public/uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const filename = `${uniqueSuffix}-${file.name}`
    const filePath = path.join(uploadDir, filename)

    fs.writeFileSync(filePath, buffer)
    const fileUrl = `/uploads/${filename}`

    // Salva no banco de dados
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const document = await prisma.document.create({
      data: {
        title,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        userId: user.id
      }
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}
