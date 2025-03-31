// app/documents/[id]/sign-document-form.tsx
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { toast } from 'sonner'

export default function SignDocumentForm({
  documentId
}: {
  documentId: string
}) {
  const router = useRouter()
  const sigCanvas = useRef<SignatureCanvas>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClear = () => {
    sigCanvas.current?.clear()
  }

  const handleSign = async () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.warning('Por favor, forneça sua assinatura')
      return
    }

    setIsSubmitting(true)
    try {
      const signatureData = sigCanvas.current?.toDataURL()

      const response = await fetch(`/api/documents/${documentId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ signature: signatureData })
      })

      if (!response.ok) throw new Error('Failed to sign document')

      toast.success('Documento assinado com sucesso!')
      router.refresh()
      router.push('/documentos')
    } catch (error) {
      toast.error('Erro ao assinar documento', {
        description:
          error instanceof Error ? error.message : 'Tente novamente mais tarde'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-2">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            width: '100%',
            height: 200,
            className: 'w-full bg-white'
          }}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleClear}>
          <Icons.undo className="mr-2 h-4 w-4" />
          Limpar
        </Button>
        <Button onClick={handleSign} disabled={isSubmitting}>
          {isSubmitting ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.pen className="mr-2 h-4 w-4" />
          )}
          Assinar Documento
        </Button>
      </div>
    </div>
  )
}
